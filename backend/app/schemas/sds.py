import datetime
import enum
from uuid import UUID

from pydantic import BaseModel, validator

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
    sds_id: int
    revision_date: datetime.date


class NewRevisionInfoSchema(BaseModel):
    newer: NewerSDSInfoSchema


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
    search_type: str | None
    order_by: str | None
    minimum_revision_date: datetime.datetime | None


class SDSDetailsBodySchema(BaseModel):
    sds_id: str | int | None
    pdf_md5: str | None
    language_code: str | None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            return decrypt_to_number(value, settings.SECRET_KEY)
        return value


class MultipleSDSDetailsBodySchema(BaseModel):
    sds_id: list[int] | None
    pdf_md5: list[str] | None
