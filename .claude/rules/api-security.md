# API Security

## API Key Authentication

All endpoints require an API key. The key is resolved in `backend/app/api/dependencies.py`:

1. **From the request header:** `X-SDS-SEARCH-ACCESS-API-KEY`
2. **Fallback:** `settings.SDS_API_KEY` — only allowed when the request `origin` is in `settings.CORS_ORIGINS`

```python
def get_api_key(
    request: Request,
    api_key_from_header: str = Depends(
        APIKeyHeader(name="X-SDS-SEARCH-ACCESS-API-KEY", auto_error=False)
    ),
) -> str:
    if api_key_from_header:
        return api_key_from_header
    if settings.SDS_API_KEY and (
        request.headers.get("origin") in settings.CORS_ORIGINS
        or settings.CORS_ORIGINS[0] == "*"
    ):
        return settings.SDS_API_KEY
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
```

**Never hardcode an API key** — always resolve through `get_api_key()`.

## ID Encryption

All SDS IDs are Fernet-encrypted before being sent to the frontend:

- `SECRET_KEY` in `.env` is a base64-encoded Fernet key.
- Encryption/decryption happens in `SDSService` and `BaseSDSSchema` validators.
- Never log or expose raw integer SDS IDs in error messages or responses.

## CORS

CORS origins are configured via `settings.CORS_ORIGINS`. Do not set `CORS_ORIGINS=["*"]` in production — use specific origin domains.

## Rate Limiting

- Default rate: `5/minute` per IP (via slowapi `@limiter.limit("5/minute")`).
- Requests with a valid `X-SDS-SEARCH-ACCESS-API-KEY` header bypass IP-based rate limiting.
- Do not remove or skip rate limiting on new endpoints.
- Redis can be configured (`REDIS_HOST`, `REDIS_PORT`, etc.) for distributed rate limiting across multiple workers.

## Secret Handling

- Never log `settings.SDS_API_KEY`, `settings.SECRET_KEY`, or any user-supplied API key.
- Error responses must not include secrets or internal service details.
- The `500` exception handler in `main.py` returns a generic error — do not replace it with one that leaks stack traces.

## File Upload Security

- Max file size is enforced via `settings.SDS_MAX_FILE_SIZE` (default 5 MB).
- Only accept PDF files at the `/upload/` endpoint — validate MIME type.
- Do not store uploaded files locally — pass them directly to the upstream SDS API client.

## Request Authorization Errors

Always raise `SDSAPIRequestNotAuthorized` (→ HTTP 401) when the upstream API rejects the key. Include the upstream error message when available, but strip any internal credentials before passing it through:

```python
except SDSAPIRequestNotAuthorized as ex:
    detail = ex.args[0] if len(ex.args) > 0 and ex.args[0] else "Invalid API key"
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
```
