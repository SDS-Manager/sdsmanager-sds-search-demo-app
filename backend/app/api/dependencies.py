from fastapi import Depends, HTTPException, Request
from fastapi.security import APIKeyHeader
from starlette import status

from app.core.config import settings
from app.services.sds_service import SDSService


def get_api_key(
    request: Request,
    api_key_from_header: str = Depends(
        APIKeyHeader(name="X-SDS-SEARCH-ACCESS-API-KEY", auto_error=False)
    ),
) -> str:
    if api_key_from_header:
        return api_key_from_header

    if (
        settings.SDS_API_KEY
        and request.headers.get("origin") in settings.CORS_ORIGINS
    ):
        return settings.SDS_API_KEY
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)


def get_sds_service(api_key: str = Depends(get_api_key)):
    return SDSService(sds_api_key=api_key)


sds_service_dependency = Depends(get_sds_service)
