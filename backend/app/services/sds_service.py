from fastapi import UploadFile

from app import schemas
from app.clients.sds_api_client import SDSAPIClient


class SDSService:
    def __init__(self, sds_api_key: str):
        self.sds_api_client = SDSAPIClient(api_key=sds_api_key)

    async def search_sds(
        self,
        search: schemas.SearchSDSFilesBodySchema,
        page: int,
        page_size: int,
    ) -> list[schemas.ListSDSSchema]:
        api_response = await self.sds_api_client.search_sds(
            search=search.search,
            search_type=search.search_type,
            advanced_search=search.advanced_search,
            language_code=search.language_code,
            order_by=search.order_by,
            minimum_revision_date=search.minimum_revision_date,
            region_short_name=search.region_short_name,
            page=page,
            page_size=page_size,
        )
        return [schemas.ListSDSSchema(**el) for el in api_response]

    async def get_sds_details(
        self, search: schemas.SDSDetailsBodySchema
    ) -> schemas.SDSDetailsSchema:
        api_response = await self.sds_api_client.get_sds_details(
            sds_id=search.sds_id,
            language_code=search.language_code,
            pdf_md5=search.pdf_md5,
        )
        return schemas.SDSDetailsSchema(**api_response)

    async def get_multiple_sds_details(
        self, search: schemas.MultipleSDSDetailsBodySchema
    ) -> list[schemas.SDSDetailsSchema]:
        api_response = await self.sds_api_client.get_multiple_sds_details(
            sds_id=search.sds_id,
            pdf_md5=search.pdf_md5,
        )
        return [schemas.SDSDetailsSchema(**el) for el in api_response]

    async def get_newer_sds_info(
        self, search: schemas.SDSDetailsBodySchema
    ) -> schemas.NewRevisionInfoSchema:
        api_response = await self.sds_api_client.get_new_revision_sds_info(
            sds_id=search.sds_id,
            pdf_md5=search.pdf_md5,
        )
        return schemas.NewRevisionInfoSchema(**api_response)
    
    async def get_multiple_newer_sds_info(
        self, search: schemas.MultipleSDSNewRevisionsBodySchema
    ) -> list[schemas.MultipleNewRevisionInfoSchema]:
        api_response = await self.sds_api_client.get_multiple_new_revision_sds_info(
            sds_id=search.sds_id,
            pdf_md5=search.pdf_md5,
        )
        return [schemas.MultipleNewRevisionInfoSchema(**el) for el in api_response]

    async def upload_sds(self, file: UploadFile) -> schemas.SDSDetailsSchema:
        api_response = await self.sds_api_client.upload_sds(file=file)
        return schemas.SDSDetailsSchema(**api_response)
