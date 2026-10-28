# DIMA-3332 — Gateway routes for supplier live search + extraction_status

- Task: DIMA-3332 — https://work.sdsmanager.com/task/DIMA-3332
- Parent: DIMA-1177 (sdsadmin PR #3247) — the admin55 endpoints this gateway forwards to.
- Status: implemented, PR open against `develop`.

## Goal

A customer calling `api.sdsmanager.com` can run the whole DIMA-1177 flow:
supplierSearch → `import_handle` → supplierImport → getExtractionStatus →
details with `extraction_status`. Request/response shapes, status codes and
error codes match admin55's public API. The docs page documents both endpoints.

## Evidence before the change

- `POST https://rc-api.sdsmanager.com/sds/supplierSearch/` and `/supplierImport/`
  → `404 {"detail":"Not Found"}`, while `/sds/details/` on the same host reaches
  its handler (2026-10-28 09:34 GMT+7).
- `SDSDetailsSchema` had no `extraction_status`, so `response_model` filtered it
  out of `/details/` and `/multipleDetails/`. Reproduced locally by the new tests
  (`KeyError: 'extraction_status'`) before the schema change.

## Design decisions

1. **Passthrough, not re-mapping.** The two new routes return admin55's status,
   JSON body and `Retry-After` unchanged (`_upstream_response` in `api/sds.py`).
   The existing routes map upstream errors to `{"detail": ...}`, which would lose
   `error_code` (`CONNECTOR_SEARCH_NOT_ENABLED`, `INVALID_IMPORT_HANDLE`, …) and
   DRF field errors — the AC requires those unchanged.
   - Only gateway-side failures use the gateway shape: transport error or a
     non-JSON upstream answer → `500 {"detail": "SDS API request failed"}`.
   - Rejected: adding new exception classes per upstream error code — more code,
     and every new upstream code would need a gateway change.
2. **Request validation stays upstream.** The body schemas declare every field
   `str | None` and forward only what the caller sent (`exclude_none`), so
   admin55's 400 field errors (`{"country": ["This field is required."]}`) reach
   the caller. Rejected: Pydantic `required`/length constraints at the gateway —
   they would answer FastAPI 422 instead of admin55's 400.
3. **End customer.** Body `customer_id` is forwarded inside the JSON body; the
   `X-Customer-Id` header is forwarded as a header when present. admin55 reads
   body → query → header, so both forms reach `record_end_customer`.
4. **Timeout floor for supplierSearch.** admin55 stops a live lookup at
   `SUPPLIER_PUBLIC_SEARCH_TIMEOUT` = 50 s and answers 200
   `live_search_failed: true`. The search call uses
   `max(SDS_API_TIMEOUT, 90)`, so a low `SDS_API_TIMEOUT` in an environment
   cannot turn that answer into a gateway 500. 90 s stays below admin55's
   gunicorn kill (120 s). supplierImport returns 202 at once and keeps
   `SDS_API_TIMEOUT`.
5. **Rate limits.** Both routes carry `@limiter.limit("5/minute")` like every
   other POST route. `CustomLimiter` skips it for callers that send
   `X-SDS-SEARCH-ACCESS-API-KEY`, so for API customers the only limit is
   admin55's per-key connector bucket (20 per 180 s), whose 429 +
   `Retry-After` passes through unchanged. A gateway limit for key holders
   would answer a gateway-shaped 429 without admin55's `error_code` — rejected.
6. **`extraction_status`** added to `SDSDetailsSchema` (inherited by
   `SDSDetailsWithHazardousSchema`), so `/details/`, `/multipleDetails/` and the
   synchronous `/upload/` response carry it, as on admin55. `getExtractionStatus`
   already passed `file_info` through as a dict.
7. **Import id round trip** needs no change: `file_info.<file>.id` is
   Fernet-encrypted by `SDSExtractionStatusSchema` and decrypted by
   `SDSDetailsBodySchema`. Covered by a test.
8. **Docs page** (`sdsSearchDoc.tsx`): new "Supplier Live Search and Import"
   section from the DIMA-1177 API doc, without its "Internal notes", with the
   gateway's URLs, header name and `request_id` polling parameter. The RC-only
   `diagnostics` block is not documented.

## Test plan

- `backend/tests/test_supplier_routes.py` (unittest + FastAPI `TestClient`,
  upstream replaced by `httpx.MockTransport`; no new dependency):
  `cd backend && python -m unittest discover -s tests -t .`
  - 200 body passthrough incl. unknown keys; 400 field errors, 400
    `SUPPLIER_LIVE_SEARCH_UNSUPPORTED_SUPPLIER`, 403
    `CONNECTOR_SEARCH_NOT_ENABLED`, 429 + `Retry-After`.
  - supplierImport forwards a 4,096-char handle unchanged, returns 202 `{id}`;
    `INVALID_IMPORT_HANDLE` passes through.
  - `customer_id` (body) and `X-Customer-Id` (header) reach upstream for both
    routes; nothing is sent when absent.
  - import id → getExtractionStatus → encrypted SDS id → `/details/` sends 331.
  - `extraction_status` kept on `/details/` and `/multipleDetails/`.
  - timeout floor; transport error / non-JSON upstream → 500.
- Live: local gateway (port 8013) → `rc-admin55` public API with an invalid key:
  both routes answer 401 `SDS_API_UNAUTHORIZED`, byte-identical to calling
  rc-admin55 directly. Before the change the same paths were 404 on rc-api.
- Docs page: `tsc --noEmit` clean for the file; rendered with
  `react-dom/server` — new section present, no "Internal notes", no
  `rc-admin55`, no `diagnostics`.
- Not tested here: a full opted-in import through the gateway (needs a customer
  API key that is opted in) — QA step on staging / RC.

## Risks

- Low — the gateway's fallback key (`SDS_API_KEY`, used without an API-key
  header when the Origin matches or `CORS_ORIGINS` is `*`) can also reach the
  two routes. admin55 answers 403 `CONNECTOR_SEARCH_NOT_ENABLED` unless that
  internal account is opted in, so keep it opted out. Not in the task scope;
  not changed.
- Low — the RC-only `diagnostics` block from admin55 passes through on RC, as
  it does when calling rc-admin55 directly. Never sent on production.
- Low — a body that is not a JSON object, or a field of a non-string type that
  Pydantic cannot coerce, gets FastAPI's 422 instead of admin55's 400.
- Low — until admin55 production has DIMA-1177, `/details/` on the gateway
  returns `"extraction_status": null`.

## Migration / CLI steps

None. No env change; `SDS_API_TIMEOUT` keeps its meaning.
