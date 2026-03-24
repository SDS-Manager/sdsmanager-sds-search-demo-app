class SDSNotFoundException(Exception):
    """Raised when SDS was not found"""


class SDSBadRequestException(Exception):
    """Raised when SDS API failed to process request"""


class SDSAPIInternalError(Exception):
    """Raised when HTTP error happen during SDS API request"""


class SDSAPIParamsRequired(Exception):
    """Raised when all parameters were not specified"""


class SDSAPIRequestNotAuthorized(Exception):
    """Raised when invalid API key was provided"""


class SDSNotFoundError(Exception):
    """Raised when API not found"""


class SDSAPIRateLimitError(Exception):
    """Raised when SDS API rate limit is exceeded"""

    def __init__(self, *args, retry_after: str | None = None):
        super().__init__(*args)
        self.retry_after = retry_after