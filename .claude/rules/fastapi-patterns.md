# FastAPI Patterns

## App Structure

```
app/
  api/
    sds.py            # Route handlers — thin, only orchestrate + exception mapping
    dependencies.py   # FastAPI Depends() factories
  clients/
    sds_api_client.py # External HTTP client (httpx AsyncClient pool)
  core/
    config.py         # Pydantic BaseSettings loaded from .env
  exceptions/
    sds_api.py        # Custom exception classes
  schemas/
    sds.py            # Pydantic request/response models
  services/
    sds_service.py    # Business logic layer
  throttling.py       # slowapi limiter
  main.py             # FastAPI app, middleware, lifespan
```

## Route Handler Pattern

Route handlers in `api/sds.py` must be thin: receive input → call service → catch exceptions → return response. No business logic in handlers.

```python
@router.post(
    "/details/",
    response_model=schemas.SDSDetailsSchema,
)
@limiter.limit("5/minute")
async def sds_details(
    request: Request,
    search_body: schemas.SDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False),
):
    try:
        return await sds_service.get_sds_details(search=search_body, fe=fe)
    except (SDSAPIParamsRequired, SDSBadRequestException):
        raise HTTPException(status_code=400, detail="At least one param is required")
    except SDSAPIRequestNotAuthorized as ex:
        raise HTTPException(status_code=401, detail=ex.args[0] or "Invalid API key")
    except SDSNotFoundException:
        raise HTTPException(status_code=404, detail="SDS not found")
    except SDSAPIRateLimitError as ex:
        raise HTTPException(
            status_code=429,
            detail=ex.args[0] or "Rate limit exceeded",
            headers={"Retry-After": ex.retry_after} if ex.retry_after else None,
        )
    except SDSAPIInternalError:
        raise HTTPException(status_code=500, detail="SDS API request failed")
```

Always use `status.HTTP_*` constants from `starlette.status` — **never** raw integers in production-facing code.

## Dependency Injection

Use `fastapi.Depends()` for injecting the service. Wrap the `Depends()` call in a module-level variable so it can be reused across multiple route handlers:

```python
# dependencies.py
def get_sds_service(api_key: str = Depends(get_api_key)):
    return SDSService(sds_api_key=api_key)

sds_service_dependency = Depends(get_sds_service)

# sds.py
async def my_route(sds_service: SDSService = sds_service_dependency):
    ...
```

## Pydantic Schemas

- All schemas live in `backend/app/schemas/`.
- Use `BaseModel` from pydantic for all request/response types.
- Use `validator` or `field_validator` decorators for custom validation (e.g., date format checks, ID encryption).
- `BaseSDSSchema` applies Fernet encryption to integer SDS IDs — extend it for any schema that returns SDS IDs to the frontend.
- Use `response_model=` on every route — never return raw dicts from handlers.

```python
class SDSDetailsBodySchema(BaseModel):
    sds_id: str | None = None
    pdf_md5: str | None = None
```

## Service Layer

Business logic lives in `SDSService` in `backend/app/services/sds_service.py`. The service:

- Receives Pydantic schemas as input
- Calls `SDSAPIClient` for external requests
- Decrypts incoming IDs (Fernet) and encrypts outgoing IDs
- Returns typed Pydantic schemas (or raises custom exceptions)

```python
class SDSService:
    def __init__(self, sds_api_key: str):
        self.client = SDSAPIClient.get_or_create_client(sds_api_key)
        self.fernet = Fernet(settings.SECRET_KEY)

    async def get_sds_details(
        self, search: SDSDetailsBodySchema, fe: bool
    ) -> SDSDetailsSchema:
        ...
```

## External API Client

`SDSAPIClient` in `backend/app/clients/sds_api_client.py` manages an `httpx.AsyncClient` pool (max 256 entries, LRU eviction). Always use `SDSAPIClient.get_or_create_client(api_key)` — never create `httpx.AsyncClient` instances manually in services.

## Rate Limiting

- Apply `@limiter.limit("5/minute")` to all `POST` routes.
- The `CustomLimiter` in `throttling.py` automatically bypasses the limit when the `X-SDS-SEARCH-ACCESS-API-KEY` header is present.
- Never skip rate limiting on new public-facing endpoints.
- Always include `request: Request` as the first parameter on rate-limited routes (required by slowapi).

## Configuration

Settings are loaded via `app.core.config.settings` (a `pydantic.BaseSettings` instance). Always access config values through `settings.*` — never read `os.environ` directly.

## Exception Classes

Raise the specific custom exception from `app/exceptions/sds_api.py`. Let the route handler translate it to an `HTTPException`:

| Raise | Maps to HTTP |
|-------|-------------|
| `SDSNotFoundException` / `SDSNotFoundError` | 404 |
| `SDSBadRequestException` / `SDSAPIParamsRequired` | 400 |
| `SDSAPIRequestNotAuthorized` | 401 |
| `SDSAPIRateLimitError` | 429 |
| `SDSAPIInternalError` | 500 |

Never raise `HTTPException` from inside the service layer — keep HTTP concerns in route handlers.

## Lifespan Events

Use the `@asynccontextmanager` lifespan pattern (not deprecated `on_startup`/`on_shutdown`) for initializing and cleaning up the client pool:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.SDS_API_KEY:
        SDSAPIClient.get_or_create_client(settings.SDS_API_KEY)
    yield
    await SDSAPIClient.close_all_clients()

app = FastAPI(lifespan=lifespan, ...)
```
