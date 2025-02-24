from fastapi import APIRouter, Body, HTTPException, Query, Request, UploadFile
from starlette import status

from app import schemas
from app.exceptions import (
    SDSAPIInternalError,
    SDSAPIParamsRequired,
    SDSAPIRequestNotAuthorized,
    SDSBadRequestException,
    SDSNotFoundException,
)
from app.services.sds_service import SDSService
from app.throttling import limiter

from .dependencies import sds_service_dependency

router = APIRouter(prefix="/sds")


@router.post(
    "/details/",
    description="Returns JSON with extracted data of SDS",
    response_model=schemas.SDSDetailsSchema,
)
@limiter.limit("5/minute")
async def sds_details(
    request: Request,
    search_body: schemas.SDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False, description="Optional 'fe' parameter"),
):
    try:
        return await sds_service.get_sds_details(search=search_body, fe=fe)
    except (SDSAPIParamsRequired, SDSBadRequestException):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one param is required",
        )
    except SDSAPIRequestNotAuthorized as ex:
        detail = (
            ex.args[0]
            if len(ex.args) > 0 and ex.args[0]
            else "Invalid API key"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
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
    "/multipleDetails/",
    description="return list of SDS extracted data",
    response_model=list[schemas.SDSDetailsSchema],
)
@limiter.limit("5/minute")
async def multiple_sds_details(
    request: Request,
    search_body: schemas.MultipleSDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False, description="Optional 'fe' parameter"),
):
    try:
        return await sds_service.get_multiple_sds_details(
            search=search_body, fe=fe
        )
    except (SDSAPIParamsRequired, SDSBadRequestException) as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                ex.args[0]
                if len(ex.args) > 0 and ex.args[0]
                else "At least one param is required"
            ),
        )
    except SDSAPIRequestNotAuthorized as ex:
        detail = (
            ex.args[0]
            if len(ex.args) > 0 and ex.args[0]
            else "Invalid API key"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/search/",
    description="Search for SDS files",
    response_model=list[schemas.ListSDSSchema],
)
@limiter.limit("5/minute")
async def search_for_sds(
    request: Request,
    search_body: schemas.SearchSDSFilesBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False, description="Optional 'fe' parameter"),
):
    try:
        return await sds_service.search_sds(
            search=search_body,
            page_size=request.query_params._dict.get("page_size", 10),
            page=request.query_params._dict.get("page", 1),
            fe=fe
        )
    except SDSBadRequestException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ex.args[0],
        )
    except SDSAPIRequestNotAuthorized as ex:
        detail = (
            ex.args[0]
            if len(ex.args) > 0 and ex.args[0]
            else "Invalid API key"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/newRevisionInfo/",
    description="Get newer SDS ID and newer revision date if it exists",
    response_model=schemas.NewRevisionInfoSchema,
)
@limiter.limit("5/minute")
async def search_for_new_sds_revision_info(
    request: Request,
    search_body: schemas.SDSDetailsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False, description="Optional 'fe' parameter"),
):
    try:
        return await sds_service.get_newer_sds_info(search=search_body, fe=fe)
    except (SDSAPIParamsRequired, SDSBadRequestException):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one param is required",
        )
    except SDSAPIRequestNotAuthorized as ex:
        detail = (
            ex.args[0]
            if len(ex.args) > 0 and ex.args[0]
            else "Invalid API key"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
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
    "/multipleNewRevisionInfo/",
    description="return list of newer SDS ID and newer revision date if it exists",
    response_model=list[schemas.MultipleNewRevisionInfoSchema],
)
@limiter.limit("5/minute")
async def search_for_multiple_new_sds_revision_info(
    request: Request,
    search_body: schemas.MultipleSDSNewRevisionsBodySchema = Body(...),
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False, description="Optional 'fe' parameter"),
):
    try:
        return await sds_service.get_multiple_newer_sds_info(
            search=search_body, fe=fe
        )
    except (SDSAPIParamsRequired, SDSBadRequestException) as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                ex.args[0]
                if len(ex.args) > 0 and ex.args[0]
                else "At least one param is required"
            ),
        )
    except SDSAPIRequestNotAuthorized as ex:
        detail = (
            ex.args[0]
            if len(ex.args) > 0 and ex.args[0]
            else "Invalid API key"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )


@router.post(
    "/upload/",
    description="If SDS will be successfully extracted, all information will be returned in response",
    response_model=schemas.SDSDetailsSchema,
)
@limiter.limit("5/minute")
async def upload_new_sds(
    request: Request,
    file: UploadFile,
    sds_service: SDSService = sds_service_dependency,
    fe: bool = Query(False, description="Optional 'fe' parameter"),
):
    try:
        return await sds_service.upload_sds(file=file, fe=fe)
    except SDSAPIRequestNotAuthorized as ex:
        detail = (
            ex.args[0]
            if len(ex.args) > 0 and ex.args[0]
            else "Invalid API key"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )
    except SDSAPIInternalError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SDS API request failed",
        )
