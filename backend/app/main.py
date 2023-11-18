from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.api.sds import router as sds_api_router
from app.core.config import settings

app = FastAPI(
    title="SDS Search Service", description="SDS Search APIs", docs_url="/docs"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

app.include_router(sds_api_router, tags=["SDS API"])


@app.exception_handler(500)
async def internal_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=jsonable_encoder(
            {"detail": f"Internal Server Error: {str(exc)}"}
        ),
    )


@app.get("/")
def get_root():
    """
    The API root, redirects to docs.

    :returns: Redirection to the docs page.
    """
    return RedirectResponse(url="docs/")
