from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from typing import List

from pdf.rfi_pdf_service import generate_single_rfi_pdf, generate_rfi_zip, load_rfi_json

router = APIRouter(prefix="/rfi", tags=["RFI"])


@router.get("/{rfi_number}/pdf")
async def get_rfi_pdf(rfi_number: str):
    saved = load_rfi_json(rfi_number)
    if not saved:
        raise HTTPException(status_code=404, detail="RFI not found.")
    pdf_path = generate_single_rfi_pdf(saved)
    return FileResponse(pdf_path, filename=os.path.basename(pdf_path), media_type="application/pdf")


@router.post("/pdf")
async def generate_rfi_pdf(rfi: dict):
    if not rfi:
        raise HTTPException(status_code=400, detail="RFI payload required")
    pdf_path = generate_single_rfi_pdf(rfi)
    return FileResponse(pdf_path, filename=os.path.basename(pdf_path), media_type="application/pdf")


@router.post("/pdf/batch")
async def get_rfi_zip(rfis: List[dict]):
    if not rfis:
        raise HTTPException(status_code=400, detail="No RFIs provided")
    zip_path = generate_rfi_zip(rfis)
    return FileResponse(zip_path, filename="rfi_batch.zip", media_type="application/zip")
