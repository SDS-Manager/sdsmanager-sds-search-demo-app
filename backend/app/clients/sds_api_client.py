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
from app.utils import encrypt_number, update_search_id


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
        is_current_version: bool | None = None,
        page: int = 1,
        page_size: int = 20,
        fe: bool = False,
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
        if is_current_version and isinstance(is_current_version, bool):
            search_data["is_current_version"] = is_current_version
        elif is_current_version is None:
            search_data["is_current_version"] = "all"

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
        
        if response.status_code == status.HTTP_403_FORBIDDEN:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You do not have permission to access this resource"
                    )
                )
            raise SDSAPIRequestNotAuthorized

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            raise SDSBadRequestException(
                response.json().get("error_message", "Default bad request")
            )

        if response.status_code != status.HTTP_200_OK:
            raise SDSAPIInternalError

        response_jsons: dict = response.json()
        if response.status_code == status.HTTP_200_OK:
            for response_json in response_jsons:
                if response_json and response_json.get("id"):
                    if fe or self.session.headers.get("SDS-SEARCH-ACCESS-API-KEY") == settings.SDS_API_KEY:
                        response_json["search_id"] = encrypt_number(
                            response_json.get("id"),
                            settings.SECRET_KEY,
                        )
                    else:
                        response_json["search_id"] = response_json.get("id")

        return response_jsons

    async def get_sds_details(
        self,
        sds_id: int | None = None,
        pdf_md5: str | None = None,
        language_code: str | None = None,
        fe: bool = False,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = sds_id.get("id")
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

        response_json: dict = response.json()
        if response.status_code == status.HTTP_200_OK:
            if response_json and response_json.get("id"):
                response_json["search_id"] = encrypt_number(
                        response_json.get("id"),
                        settings.SECRET_KEY,
                    )
                
                # access_key_match = fe or self.session.headers.get("SDS-SEARCH-ACCESS-API-KEY") == settings.SDS_API_KEY

                # update_search_id(
                #     response_json,
                #     [sds_id] if sds_id else None,
                #     access_key_match,
                #     search_key="id",
                #     allow_none=True
                # )

        return response_json

    async def get_multiple_sds_details(
        self,
        sds_id: list[int] = None,
        pdf_md5: list[str] = None,
        fe: bool = False,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = [item.get("id") for item in sds_id]
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

        response_jsons: dict = response.json()
        if response.status_code == status.HTTP_200_OK:
            for response_json in response_jsons:
                if response_json and response_json.get("id"):
                    access_key_match = fe or self.session.headers.get("SDS-SEARCH-ACCESS-API-KEY") == settings.SDS_API_KEY

                    update_search_id(
                        response_json,
                        sds_id,
                        access_key_match,
                        search_key="id",
                        allow_none=True
                    )

        return response_jsons

    async def get_new_revision_sds_info(
        self,
        sds_id: list[int] = None,
        pdf_md5: list[int] = None,
        fe: bool = False,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = sds_id.get("id")
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
            if response_json["newer"] and response_json["newer"].get(
                "search_id"
            ):
                response_json["newer"]["search_id"] = encrypt_number(
                    response_json["newer"]["search_id"], settings.SECRET_KEY
                )
            #     access_key_match = fe or self.session.headers.get("SDS-SEARCH-ACCESS-API-KEY") == settings.SDS_API_KEY

            #     update_search_id(
            #         response_json["newer"],
            #         [sds_id] if sds_id else None,
            #         access_key_match,
            #         search_key="search_id",
            #         allow_none=False
            #     )
        return response_json

    async def get_multiple_new_revision_sds_info(
        self,
        sds_id: list[int] = None,
        pdf_md5: list[str] = None,
        fe: bool = False,
    ):
        search_data = {}
        if sds_id:
            search_data["sds_id"] = [item.get("id") for item in sds_id]
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
                    access_key_match = fe or self.session.headers.get("SDS-SEARCH-ACCESS-API-KEY") == settings.SDS_API_KEY

                    update_search_id(
                        response_json["newer"],
                        sds_id,
                        access_key_match,
                        search_key="search_id",
                        allow_none=False
                    )

        return response_jsons

    async def upload_sds(self, file: UploadFile, fe: bool = False, sku:str = '', upc_ean:str = '', product_code:str = '', request_id: str = '', email: str | None = None):
        try:
            if file.content_type != "application/pdf":
                raise SDSBadRequestException("Only PDF files are allowed")
            file_contents = await file.read()
            if len(file_contents) > settings.SDS_MAX_FILE_SIZE:
                raise SDSBadRequestException(
                    f"File size exceeds the limit of {settings.SDS_MAX_FILE_SIZE / (1024 * 1024)} MB"
                )
            form_data = {
                "sku": sku,
                "upc_ean": upc_ean,
                "product_code": product_code,
                "id": request_id,
                "email": email,
            }
            response = await self.session.post(
                url="/sds/upload/",
                timeout=600,
                files={"file": (file.filename, file_contents)},
                data=form_data
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
        
        if response.status_code == status.HTTP_403_FORBIDDEN:
            if response.content:
                raise SDSAPIRequestNotAuthorized(
                    response.json().get(
                        "error_message", "You do not have permission to access this resource"
                    )
                )
            raise SDSAPIRequestNotAuthorized
        
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            if response.content:
                raise SDSBadRequestException(
                    response.json().get("error_message", "Bad request, SDS upload failed")
                )
            raise SDSBadRequestException

        if response.status_code != status.HTTP_200_OK:
            if response.content:
                raise SDSAPIInternalError(
                    response.json().get("error_message", "SDS upload failed")
                )
            raise SDSAPIInternalError

        response_json: dict = response.json()
        if response.status_code == status.HTTP_200_OK:
            if response_json and response_json.get("id"):
                if fe or self.session.headers.get("SDS-SEARCH-ACCESS-API-KEY") == settings.SDS_API_KEY:
                    response_json["search_id"] = encrypt_number(
                        response_json.get("id"),
                        settings.SECRET_KEY,
                    )
                else:
                    response_json["search_id"] = response_json.get("id")

        return response_json
    
    async def get_extraction_status(self, request_id: str, email: str | None = None, fe: bool = False):
        urlParams = {}
        if email: 
            urlParams['email'] = email
        urlParams['id'] = request_id
        try:
            response = await self.session.get(
                url="/sds/getExtractionStatus/",
                params=urlParams
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

        response_json: dict = response.json()
        return response_json