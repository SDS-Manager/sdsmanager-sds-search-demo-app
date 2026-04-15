# API Design

## URL Structure

All API endpoints are registered in `backend/app/api/sds.py` via `APIRouter(prefix="/sds")` and included in `main.py`.

```python
router = APIRouter(prefix="/sds")

@router.post("/my-endpoint/")
async def my_endpoint(...):
    ...
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Route path | `camelCase` segments or `kebab-case` | `"/newRevisionInfo/"`, `"/get-dif-language-versions/"` |
| Schema names | `PascalCase` + `Schema` suffix | `SDSDetailsSchema` |
| Service methods | `snake_case` | `get_sds_details` |

---

## HTTP Methods

| Operation | Method |
|-----------|--------|
| Search / query | `POST` (when body params required) |
| Status poll (no body) | `GET` |
| Upload | `POST` (multipart) |
| Binary response (PDF) | `POST` → `Response(content, media_type="application/pdf")` |

---

## Request & Response

### Success response

Always declare `response_model=` on every route. Return the Pydantic schema directly — no wrapper envelope:

```python
@router.post("/details/", response_model=schemas.SDSDetailsSchema)
async def sds_details(...):
    return await sds_service.get_sds_details(...)
```

### Binary (PDF) response

```python
pdf_content = await sds_service.get_sds_safety_information_summary(...)
return Response(pdf_content, media_type="application/pdf")
```

### Validation errors

Pydantic automatically returns `422 Unprocessable Entity` with field-level details when request body fails schema validation. Do not duplicate this manually.

---

## Error Responses

FastAPI routes map custom service exceptions to `HTTPException`. Follow the existing pattern:

```python
except SDSAPIRequestNotAuthorized as ex:
    detail = ex.args[0] if len(ex.args) > 0 and ex.args[0] else "Invalid API key"
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
```

Always include the `Retry-After` header on `429` responses when the upstream provides it:

```python
except SDSAPIRateLimitError as ex:
    raise HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail=ex.args[0] or "Rate limit exceeded",
        headers={"Retry-After": ex.retry_after} if ex.retry_after else None,
    )
```

---

## Common Query Parameters

| Param | Type | Purpose |
|-------|------|---------|
| `fe` | `bool` | Frontend flag — passed to service to adjust response shaping |
| `page` | `int` | Page number for paginated endpoints |
| `page_size` | `int` | Items per page |
| `request_id` | `str` | Extraction request ID for status polling |

---

## File Upload

Use FastAPI `UploadFile` + `Form` fields for multipart endpoints:

```python
@router.post("/upload/", response_model=schemas.SDSDetailsSchema)
async def upload_new_sds(
    request: Request,
    file: UploadFile,
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False),
    sku: str = Form(default=''),
    upc_ean: str = Form(default=''),
    product_code: str = Form(default=''),
    private_import: bool = Form(default=False),
    email: str | None = Form(default=None),
):
    ...
```

---

## Do NOT

- Do not return raw Python dicts from route handlers — always use a Pydantic `response_model`.
- Do not put business logic (API calls, data transformation, encryption) inside route handlers — that belongs in the service layer.
- Do not hardcode API base URLs — read from `settings.SDS_API_URL`.
- Do not skip `response_model=` on any route.
- Do not bypass rate limiting on new public-facing endpoints.
