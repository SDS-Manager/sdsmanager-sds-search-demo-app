import datetime
import enum
import re
from typing import List
from uuid import UUID
import uuid

from cryptography.fernet import InvalidToken
from fastapi import HTTPException
from pydantic import BaseModel, validator
from starlette import status

from app.core.config import settings
from app.utils import decrypt_to_number, encrypt_number, is_valid_uuid


class BaseSDSSchema(BaseModel):
    search_id: str | None
    id: str | None
    uuid: UUID | None
    pdf_md5: str | None
    sds_pdf_product_name: str | None
    sds_pdf_manufacture_name: str | None
    sds_pdf_revision_date: str | None
    # master_date: str | None
    language: str | None
    regulation_area: str | None
    product_code: str | None
    # cas_no: str | None
    sku: str | None
    permanent_link: str | None
    sds_web_page: str | None
    replaced_by_id: str | None
    newest_version_of_sds_id: str | None
    is_current_version: bool | None
    label_generator: str | None
    safety_information_summary: str | None
    english_sdspdf_id: str | None
    # sds_pdf_chemical_components: list[dict] | None

    @validator("id", pre=True)
    def validate_id(cls, value, values):
        if isinstance(value, int):
            value =  encrypt_number(value, settings.SECRET_KEY)
            search_id = values.get("search_id")
            if isinstance(search_id, str):
                if not search_id.isdigit():
                    if search_id != value:
                        return search_id
        return value
    
    @validator("replaced_by_id", pre=True)
    def validate_replaced_by_id(cls, value, values):
        if isinstance(value, int):
            value =  encrypt_number(value, settings.SECRET_KEY)
            return value
        return value
    
    @validator("newest_version_of_sds_id", pre=True)
    def validate_newest_version_of_sds_id(cls, value, values):
        if isinstance(value, int):
            value =  encrypt_number(value, settings.SECRET_KEY)
            return value
        return value

    @validator("english_sdspdf_id", pre=True)
    def validate_english_sdspdf_id(cls, value):
        if isinstance(value, int):
            value = encrypt_number(value, settings.SECRET_KEY)
            return value
        return value
    
    


class ListSDSSchema(BaseSDSSchema):
    pass


class SDSDetailsSchema(BaseSDSSchema):
    extracted_data: dict | None
    other_data: dict | None
    sds_pdf_manufacture_full_info: dict | None


class NewerSDSInfoSchema(BaseModel):
    sds_id: str
    revision_date: datetime.date | None
    uuid: uuid.UUID
    search_id: str
    # encryption_search_id: str
    search_pdf_md5: str


class NewRevisionInfoSchema(BaseModel):
    newer: NewerSDSInfoSchema | None


class MultipleNewerSDSInfoSchema(BaseModel):
    sds_id: str
    revision_date: datetime.date | None
    search_id: str
    encryption_search_id: str
    search_pdf_md5: str


class MultipleNewRevisionInfoSchema(BaseModel):
    newer: MultipleNewerSDSInfoSchema | None


class AdvancedSearchSchema(BaseModel):
    supplier_name: str | None
    product_name: str | None
    cas_no: str | None
    product_code: str | None
    sku: str | None


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
    is_current_version: bool | None


class SDSDifLanguageVersionsBodySchema(BaseModel):
    sds_id: str | None
    pdf_md5: str | None
    language_code: str | None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            if is_valid_uuid(value):
                return {
                    "id": value,
                }

            try:
                return {
                    "id": decrypt_to_number(value, settings.SECRET_KEY),
                    "encrypt": f"{value}",
                }
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


class SDSDetailsBodySchema(BaseModel):
    sds_id: str | None
    pdf_md5: str | None
    language_code: str | None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            if is_valid_uuid(value):
                return {
                    "id": value,
                }

            try:
                return {
                    "id": decrypt_to_number(value, settings.SECRET_KEY),
                    "encrypt": f"{value}",
                }
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
            if len(value) > settings.VALUE_LIMIT:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Value limit is {settings.VALUE_LIMIT} SDS IDs",
                )
            try:
                return [
                    {
                        "id": decrypt_to_number(v, settings.SECRET_KEY),
                        "encrypt": f"{v}",
                    }
                    for v in value
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
            if len(value) > settings.VALUE_LIMIT:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Value limit is {settings.VALUE_LIMIT} PDF MD5",
                )
            for v in value:
                if not re.findall(r"^([a-fA-F\d]{32})$", v):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Unknown PDF MD5",
                    )

        return value


class MultipleSDSNewRevisionsBodySchema(BaseModel):
    sds_id: list[str] | None
    pdf_md5: list[str] | None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            if len(value) > settings.VALUE_LIMIT:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Value limit is {settings.VALUE_LIMIT} SDS IDs",
                )
            try:
                return [
                    {
                        "id": decrypt_to_number(v, settings.SECRET_KEY),
                        "encrypt": f"{v}",
                    }
                    for v in value
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
            if len(value) > settings.VALUE_LIMIT:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Value limit is {settings.VALUE_LIMIT} PDF MD5",
                )
            for v in value:
                if not re.findall(r"^([a-fA-F\d]{32})$", v):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Unknown PDF MD5",
                    )

        return value

class SDSExtractionStatusSchema(BaseModel):
    request_id: str | None = None
    progress: int | None = None
    step: str | None = None
    email: str | None = None
    replace: bool | None = None
    show_for: bool | None = None
    signup_with_uploading: bool | None = None
    error_message: str | None = None
    error_code: str | None = None
    compression_file_info: dict | None = None
    file_info: dict | None = None
    booklet_info: dict | None = None
    log: dict | None = None

    @validator("file_info", pre=True)
    def encrypt_file_info_ids(cls, value):
        def encrypt_ids(data):
            if isinstance(data, dict):
                for key, val in data.items():
                    if key == "id" and isinstance(val, int):
                        data[key] = encrypt_number(val, settings.SECRET_KEY)
                    elif isinstance(val, (dict, list)):
                        encrypt_ids(val)
            elif isinstance(data, list):
                for item in data:
                    encrypt_ids(item)
            return data

        if value and isinstance(value, (dict, list)):
            value = encrypt_ids(value)
        return value


class SDSSafetyInformationSummaryBodySchema(BaseModel):
    sds_id: str | None = None
    pdf_md5: str | None = None
    section_display: str | None = None

    @validator("sds_id")
    def validate_sds_id(cls, value):
        if value:
            if is_valid_uuid(value):
                return {
                    "id": value,
                }

            try:
                return {
                    "id": decrypt_to_number(value, settings.SECRET_KEY),
                    "encrypt": f"{value}",
                }
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

   