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
    SECRET_KEY: str


settings = Settings()
