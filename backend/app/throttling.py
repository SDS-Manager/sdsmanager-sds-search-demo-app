from typing import Any, Callable, Optional
from urllib.parse import quote
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

class CustomLimiter(Limiter):
    def _check_request_limit(
        self,
        request: Request,
        endpoint_func: Optional[Callable[..., Any]],
        in_middleware: bool = True,
    ) -> None:
        if request.headers.get("X-SDS-SEARCH-ACCESS-API-KEY"):
            request.state.view_rate_limit = 1
            return
        return super()._check_request_limit(
            request, endpoint_func, in_middleware
        )

def get_real_ip(request: Request) -> str:
    real_ip = request.headers.get("x-real-ip", request.headers.get("x-remote_addr"))
    # print(f"Real IP: {real_ip}")
    return real_ip


if settings.REDIS_HOST and settings.REDIS_PORT and settings.REDIS_DB:
    redis_url = (
        f"redis://{quote(settings.REDIS_PASSWORD, '')}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
        if settings.REDIS_PASSWORD
        else f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
    )
    limiter = CustomLimiter(key_func=get_real_ip, storage_uri=redis_url)
else:
    limiter = CustomLimiter(key_func=get_real_ip)
