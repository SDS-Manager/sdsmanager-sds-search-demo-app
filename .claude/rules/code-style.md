# Code Style

## Backend (Python)

### Tools

| Tool    | Version | Purpose           |
|---------|---------|-------------------|
| Black   | 22.3.0  | Formatting        |
| isort   | 5.12.0  | Import sorting    |
| flake8  | 6.1.0   | Linting           |

Run checks via pre-commit hooks (`.pre-commit-config.yaml`).

### Line Length

- Max **79 characters** (Black + flake8 config in `pyproject.toml`).
- Black wraps automatically; do not override.

### Flake8 Ignored Codes

`E203`, `W503`, `E501`, `E402`, `B008` — do not add suppressions for other codes without good reason.

### Import Order (isort, profile=black)

1. Standard library (`datetime`, `os`, `typing`, etc.)
2. Third-party packages (`fastapi`, `pydantic`, `httpx`, `slowapi`, etc.)
3. Local app imports (absolute paths — **no relative imports**)

```python
# Good
from app.core.config import settings
from app.schemas.sds import SDSDetailsSchema

# Bad
from ..core.config import settings
```

### Naming Conventions (Python)

- **Variables / functions:** `snake_case`
- **Classes:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Pydantic schemas:** `{Subject}Schema` or `{Subject}BodySchema`

### General Python Style

- Follow PEP 8.
- Prefer explicit over implicit.
- No `print()` in production code — use Python's `logging` module.
- Use Python 3.10+ union syntax `str | None` for type hints (not `Optional[str]`).
- All async functions must use `async def` and `await` throughout the call chain.

---

## Frontend (TypeScript / React)

### Tools

- ESLint with `react` plugin and `only-warn` mode (errors shown as warnings)
- Prettier with single quotes enabled
- TypeScript `strict: true`

### Naming Conventions (Frontend)

- **Component files:** `PascalCase.tsx` or `kebab-case/` directory with `index.tsx`
- **Variables / functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **CSS classes / MUI `sx` props:** prefer MUI `sx` prop over raw CSS classes

### React / TypeScript Style

- Use functional components with hooks — no class components.
- Type all props explicitly; avoid `any`.
- Use absolute imports from `src/` (configured via `baseUrl: "src"` in `tsconfig.json`).
- Prefer MUI `sx` prop for inline styles over separate CSS files.
- Do not introduce new styling solutions (CSS Modules, styled-components) — use MUI.
- Keep component files focused; extract sub-components when a file exceeds ~200 lines.
