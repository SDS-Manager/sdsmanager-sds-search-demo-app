from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.api.sds import router as sds_api_router
from app.core.config import settings

from app.throttling import limiter
from app.exceptions.sds_api import SDSBadRequestException

app = FastAPI(
    title="SDS Search Service",
    description="The SDS Manager API is designed to streamline the search process for Safety Data Sheets (SDS). This powerful tool allows users to efficiently locate SDS documents by querying product names, CAS numbers, or supplier details. The API ensures that users have quick access to critical safety information, helping maintain compliance with safety regulations. Its robust search capabilities enable integration into various systems, making it an essential resource for industries that handle hazardous materials. <p><b>You should to fill API key first in Authorize button.<b/><p>",
    docs_url="/docs",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

@app.exception_handler(SDSBadRequestException)
async def bad_request_exception_handler(request: Request, exc: SDSBadRequestException):
    return JSONResponse(
        status_code=400,
        content=jsonable_encoder({"detail": str(exc)})
    )


@app.get("/")
def get_root():
    """
    The API root, redirects to docs.

    :returns: Redirection to the docs page.
    """
    return RedirectResponse(url="docs/")
