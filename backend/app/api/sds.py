from fastapi import APIRouter, Body, HTTPException, Query, UploadFile
from starlette import status

from app import schemas
from app.exceptions import (
    SDSAPIInternalError,
    SDSAPIParamsRequired,
    SDSBadRequestException,
    SDSNotFoundException,
)
from app.services.sds_service import SDSService

from .dependencies import sds_service_dependency

router = APIRouter(prefix="/sds")


@router.post(
    "/details",
    description="Returns JSON with extracted data of SDS",
    response_model=schemas.SDSDetailsSchema,
)
async def sds_details(
    *,
    search_body: schemas.SDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
):
    try:
        return await sds_service.get_sds_details(search=search_body)
    except (SDSAPIParamsRequired, SDSBadRequestException):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one param is required",
        )
    except SDSNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="SDS not found"
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/multipleDetails",
    description="return list of SDS extracted data",
    response_model=list[schemas.SDSDetailsSchema],
)
async def multiple_sds_details(
    *,
    search_body: schemas.MultipleSDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
):
    try:
        return await sds_service.get_multiple_sds_details(search=search_body)
    except (SDSAPIParamsRequired, SDSBadRequestException):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one param is required",
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/search",
    description="Search for SDS files",
    response_model=list[schemas.ListSDSSchema],
)
async def search_for_sds(
    *,
    page: int = Query(...),
    page_size: int = Query(...),
    search_body: schemas.SearchSDSFilesBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
):
    try:
        return await sds_service.search_sds(
            search=search_body,
            page_size=page_size,
            page=page,
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/newRevisionInfo",
    description="Get newer SDS ID and newer revision date if it exists",
    response_model=schemas.NewRevisionInfoSchema,
)
async def search_for_new_sds_revision_info(
    *,
    search_body: schemas.SDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
):
    try:
        return await sds_service.get_newer_sds_info(search=search_body)
    except (SDSAPIParamsRequired, SDSBadRequestException):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one param is required",
        )
    except SDSNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="SDS not found"
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/upload",
    description="If SDS will be successfully extracted, all information will be returned in response",
    response_model=schemas.SDSDetailsSchema,
)
async def upload_new_sds(
    *, file: UploadFile, sds_service: SDSService = sds_service_dependency
):
    try:
        return await sds_service.upload_sds(file=file)
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )
