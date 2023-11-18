class SDSNotFoundException(Exception):
    """Raised when SDS was not found"""


class SDSBadRequestException(Exception):
    """Raised when SDS API failed to process request"""


class SDSAPIInternalError(Exception):
    """Raised when HTTP error happen during SDS API request"""


class SDSAPIParamsRequired(Exception):
    """Raised when all parameters were not specified"""
