import datetime
import enum
import re
from uuid import UUID

from cryptography.fernet import InvalidToken
from fastapi import HTTPException
from pydantic import BaseModel, validator
from starlette import status

from app.core.config import settings
from app.utils import decrypt_to_number, encrypt_number


class BaseSDSSchema(BaseModel):
    id: str
    uuid: UUID
    pdf_md5: str
    sds_pdf_product_name: str
    sds_pdf_manufacture_name: str
    sds_pdf_revision_date: str | None
    master_date: str | None
    language: str
    regulation_area: str | None
    product_code: str | None
    cas_no: str | None
    permanent_link: str

    @validator("id", pre=True)
    def validate_id(cls, value):
        if isinstance(value, int):
            return encrypt_number(value, settings.SECRET_KEY)
        return value


class ListSDSSchema(BaseSDSSchema):
    pass


class SDSDetailsSchema(BaseSDSSchema):
    extracted_data: dict
    other_data: dict


class NewerSDSInfoSchema(BaseModel):
    sds_id: str
    revision_date: datetime.date


class NewRevisionInfoSchema(BaseModel):
    newer: NewerSDSInfoSchema | None


class AdvancedSearchSchema(BaseModel):
    supplier_name: str | None
    product_name: str | None
    cas_no: str | None
    product_code: str | None


class SearchTypeEnum(str, enum.Enum):
    SIMPLE_QUERY_STRING = "simple_query_string"
    MATCH = "match"
    MATCH_PHRASE = "match_phrase"


class SearchSDSFilesBodySchema(BaseModel):
    advanced_search: AdvancedSearchSchema | None
    search: str | None
    language_code: str | None
    region_short_name: str | None
    search_type: str | None
    order_by: str | None
    minimum_revision_date: datetime.datetime | None


class SDSDetailsBodySchema(BaseModel):
    sds_id: str | None
    pdf_md5: str | None
    language_code: str | None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            try:
                return decrypt_to_number(value, settings.SECRET_KEY)
            except InvalidToken:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unknown SDS ID",
                )

        return value

    @validator("pdf_md5")
    def validate_pdf_md5(cls, value):
        if value:
            if not re.findall(r"^([a-fA-F\d]{32})$", value):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unknown PDF MD5",
                )

        return value


class MultipleSDSDetailsBodySchema(BaseModel):
    sds_id: list[str] | None
    pdf_md5: list[str] | None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            try:
                return [
                    decrypt_to_number(v, settings.SECRET_KEY) for v in value
                ]
            except InvalidToken:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unknown SDS ID",
                )

        return value

    @validator("pdf_md5")
    def validate_pdf_md5(cls, value):
        if value:
            for v in value:
                if not re.findall(r"^([a-fA-F\d]{32})$", v):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Unknown PDF MD5",
                    )

        return value
