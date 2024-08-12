from datetime import datetime

from fastapi import UploadFile
from fastapi.encoders import jsonable_encoder
from httpx import AsyncClient, HTTPError
from starlette import status

from app import schemas
from app.core.config import settings
from app.exceptions import (
    SDSAPIInternalError,
    SDSAPIParamsRequired,
    SDSAPIRequestNotAuthorized,
    SDSBadRequestException,
    SDSNotFoundException,
)
from app.utils import encrypt_number


class SDSAPIClient:
    def __init__(self, api_key: str):
        self._session = AsyncClient(
            base_url=settings.SDS_API_URL,
            timeout=settings.SDS_API_TIMEOUT,
            headers={"SDS-SEARCH-ACCESS-API-KEY": api_key},
        )

    @property
    def session(self):
        if self._session.is_closed:
            self._session = AsyncClient(
                base_url=settings.SDS_API_URL,
                timeout=settings.SDS_API_TIMEOUT,
                headers={"SDS-SEARCH-ACCESS-API-KEY": settings.SDS_API_KEY},
            )
        return self._session

    async def search_sds(
        self,
        advanced_search: schemas.AdvancedSearchSchema | None = None,
        search: str | None = None,
        language_code: str | None = None,
        search_type: str | None = None,
        order_by: str | None = "-id",
        minimum_revision_date: datetime | None = None,
        region_short_name: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> list[dict]:
        search_data = {}
        if advanced_search:
            search_data["advanced_search"] = jsonable_encoder(advanced_search)
        if search:
            search_data["search"] = search
        if language_code:
            search_data["language_code"] = language_code
        if search_type:
            search_data["search_type"] = search_type
        if order_by:
            search_data["order_by"] = order_by
        if minimum_revision_date:
            search_data["minimum_revision_date"] = minimum_revision_date
        if region_short_name:
            search_data["region_short_name"] = region_short_name

        try:
            response = await self.session.post(
                url="/sds/search/",
                params={"page": page, "page_size": page_size},
                json=search_data,
            )
        except HTTPError:
            raise SDSAPIInternalError

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You are not authorized"
                    )
                )
            raise SDSAPIRequestNotAuthorized

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            raise SDSBadRequestException(
                response.json().get("error_message", "Default bad request")
            )

        if response.status_code != status.HTTP_200_OK:
            raise SDSAPIInternalError

        return response.json()

    async def get_sds_details(
        self,
        sds_id: int | None = None,
        pdf_md5: str | None = None,
        language_code: str | None = None,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = sds_id
        if pdf_md5:
            search_data["pdf_md5"] = pdf_md5
        if language_code:
            search_data["language_code"] = language_code
        if not search_data:
            raise SDSAPIParamsRequired

        try:
            response = await self.session.post(
                url="/sds/details/",
                json=search_data,
            )
        except HTTPError:
            raise SDSAPIInternalError

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You are not authorized"
                    )
                )
            raise SDSAPIRequestNotAuthorized
        if response.status_code == status.HTTP_404_NOT_FOUND:
            raise SDSNotFoundException
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            raise SDSBadRequestException

        return response.json()

    async def get_multiple_sds_details(
        self,
        sds_id: list[int] = None,
        pdf_md5: list[str] = None,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = sds_id
        if pdf_md5:
            search_data["pdf_md5"] = pdf_md5
        if not search_data:
            raise SDSAPIParamsRequired

        try:
            response = await self.session.post(
                url="/sds/multipleDetails/",
                json=search_data,
            )
        except HTTPError:
            raise SDSAPIInternalError

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You are not authorized"
                    )
                )
            raise SDSAPIRequestNotAuthorized
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            if response.content:
                raise SDSBadRequestException(
                    response.json().get(
                        "error_message", "At least one param is required"
                    )
                )
            raise SDSBadRequestException

        return response.json()

    async def get_new_revision_sds_info(
        self,
        sds_id: list[int] = None,
        pdf_md5: list[int] = None,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = sds_id
        if pdf_md5:
            search_data["pdf_md5"] = pdf_md5

        try:
            response = await self.session.post(
                url="/sds/newRevisionInfo/",
                json=search_data,
            )
        except HTTPError:
            raise SDSAPIInternalError

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You are not authorized"
                    )
                )
            raise SDSAPIRequestNotAuthorized
        if response.status_code == status.HTTP_404_NOT_FOUND:
            raise SDSNotFoundException
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            raise SDSBadRequestException

        response_json: dict = response.json()

        if response.status_code == status.HTTP_200_OK:
            if response_json["newer"] and response_json["newer"].get("sds_id"):
                response_json["newer"]["sds_id"] = encrypt_number(
                    response_json["newer"]["sds_id"], settings.SECRET_KEY
                )

        return response_json

    async def get_multiple_new_revision_sds_info(
        self,
        sds_id: list[int] = None,
        pdf_md5: list[str] = None,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = sds_id
        if pdf_md5:
            search_data["pdf_md5"] = pdf_md5
        if not search_data:
            raise SDSAPIParamsRequired

        try:
            response = await self.session.post(
                url="/sds/multipleNewRevisionInfo/",
                json=search_data,
            )
        except HTTPError:
            raise SDSAPIInternalError

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You are not authorized"
                    )
                )
            raise SDSAPIRequestNotAuthorized
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            if response.content:
                raise SDSBadRequestException(
                    response.json().get(
                        "error_message", "At least one param is required"
                    )
                )
            raise SDSBadRequestException

        response_jsons: dict = response.json()

        if response.status_code == status.HTTP_200_OK:
            for response_json in response_jsons:
                if response_json["newer"] and response_json["newer"].get(
                    "sds_id"
                ):
                    response_json["newer"]["sds_id"] = encrypt_number(
                        response_json["newer"]["sds_id"], settings.SECRET_KEY
                    )
                if response_json["newer"] and response_json["newer"].get(
                    "search_id"
                ):
                    response_json["newer"]["search_id"] = encrypt_number(
                        response_json["newer"]["search_id"],
                        settings.SECRET_KEY,
                    )

        return response_jsons

    async def upload_sds(self, file: UploadFile):
        try:
            response = await self.session.post(
                url="/sds/upload/",
                timeout=600,
                files={"file": (file.filename, await file.read())},
            )
        except HTTPError:
            raise SDSAPIInternalError

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You are not authorized"
                    )
                )
            raise SDSAPIRequestNotAuthorized

        if response.status_code != status.HTTP_200_OK:
            raise SDSAPIInternalError

        return response.json()
