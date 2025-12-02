from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse

from services.revisions.revision_compare import (
    compare_revisions,
    create_revision_overlay,
    export_comparison_to_excel
)
from utils.helpers import read_upload_bytes

router = APIRouter(tags=["Revisions"])


@router.post("/compare-revisions")
async def compare_revisions_endpoint(request: Request, file_a: UploadFile = File(...), file_b: UploadFile = File(...)):
    file_a_bytes = await read_upload_bytes(file_a)
    file_b_bytes = await read_upload_bytes(file_b)
    return compare_revisions(file_a_bytes, file_b_bytes, request.app.state.client)


@router.post("/compare-revisions-export")
async def compare_revisions_export(request: Request, file_a: UploadFile = File(...), file_b: UploadFile = File(...)):
    file_a_bytes = await read_upload_bytes(file_a)
    file_b_bytes = await read_upload_bytes(file_b)
    compare_result = compare_revisions(file_a_bytes, file_b_bytes, request.app.state.client)

    tmp_path = export_comparison_to_excel(compare_result)

    return FileResponse(
        tmp_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="compare_revisions_report.xlsx"
    )


@router.post("/compare-revisions-overlay")
async def compare_revisions_overlay(file_a: UploadFile = File(...), file_b: UploadFile = File(...)):
    file_a_bytes = await file_a.read()
    file_b_bytes = await file_b.read()

    try:
        tmp_path = create_revision_overlay(file_a_bytes, file_b_bytes)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return FileResponse(
        tmp_path,
        media_type="application/pdf",
        filename="revision_overlay.pdf"
    )
