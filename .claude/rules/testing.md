# Testing

## Backend

### Framework

- Use Python's standard `unittest.TestCase` or `pytest` (no specific test runner is configured — `pytest` is recommended for new tests).
- FastAPI provides `TestClient` (wraps `httpx`) for integration-style route testing.

### Location

Tests should live in `backend/tests/` or alongside the module being tested.

### Test Structure

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sds_search_returns_results():
    response = client.post(
        "/sds/search/",
        json={"product_name": "acetone"},
        headers={"X-SDS-SEARCH-ACCESS-API-KEY": "test-key"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### What to Test

- Route handlers: correct HTTP status codes and response shapes
- Pydantic schema validation: required fields, date format, ID encryption
- Service logic: encryption/decryption of SDS IDs
- Exception mapping: each custom exception maps to the correct HTTP status
- Rate limiting bypass: API key header skips IP-based limit

### What NOT to Test

- External SDS Manager API behavior — mock `SDSAPIClient` at the service boundary
- httpx internals or FastAPI internals
- Third-party library behavior (slowapi, Fernet, etc.)

### Running Backend Tests

```bash
cd backend
pytest
# or
python -m pytest tests/
```

---

## Frontend

### Framework

- Create React App testing setup (`@testing-library/react`, `jest`)

### Running Frontend Tests

```bash
cd frontend
npm test
```

### What to Test

- Formik form validation logic (field-level and schema-level)
- API error handling in axios interceptor
- Utility functions (`getEnv`, `renderSnackbar`)

### What NOT to Test

- MUI component rendering internals
- Axios HTTP behavior
- React Router internals
