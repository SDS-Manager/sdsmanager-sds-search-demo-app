from typing import Any, Callable, Optional

from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


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


limiter = CustomLimiter(key_func=get_remote_address)
