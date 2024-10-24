from typing import Any, Callable, Optional

from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


# Custom Limiter that skips rate limiting for certain requests
class CustomLimiter(Limiter):
    def _check_request_limit(
        self,
        request: Request,
        endpoint_func: Optional[Callable[..., Any]],
        in_middleware: bool = True,
    ) -> None:
        # Skip rate limiting if 'X-SDS-SEARCH-ACCESS-API-KEY' is present in the header
        if request.headers.get("X-SDS-SEARCH-ACCESS-API-KEY"):
            return
        # Otherwise, apply rate limiting as normal
        return super()._check_request_limit(
            request, endpoint_func, in_middleware
        )

def get_real_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For", request.headers.get("x-forwarded-for"))
    if forwarded:
        return forwarded.split(",")[0]
    return get_remote_address(request)


limiter = CustomLimiter(key_func=get_real_ip)
