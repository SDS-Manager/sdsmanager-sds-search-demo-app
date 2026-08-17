from typing import List

from dotenv import load_dotenv
from pydantic import BaseSettings

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    CORS_ORIGINS: List[str]
    CORS_ALLOW_CREDENTIALS: bool
    CORS_ALLOW_METHODS: List[str]
    CORS_ALLOW_HEADERS: List[str]
    SDS_API_URL: str
    SDS_API_KEY: str | None = None
    SDS_API_TIMEOUT: int = 120
    # Shared secret proving to the upstream SDS API that a request comes
    # from this gateway; unlocks the wish-list-gated `hazardous` block on
    # /sds/details/. Unset = block stays disabled end to end.
    SDS_GATEWAY_SECRET: str | None = None
    SECRET_KEY: str
    VALUE_LIMIT: int = 100
    REDIS_HOST: str | None = None
    REDIS_PORT: int | None = None
    REDIS_DB: int | None = None
    REDIS_PASSWORD: str | None = None
    SDS_MAX_FILE_SIZE: int = 5242880  # Default to 5 MB

settings = Settings()
