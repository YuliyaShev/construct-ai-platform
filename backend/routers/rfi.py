from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
import os
from typing import List
from sqlalchemy.orm import Session

from pdf.rfi_pdf_service import generate_single_rfi_pdf, generate_rfi_zip, load_rfi_json
from ai.rfi_generator.rfi_service import create_rfi, list_rfis, get_rfi, update_rfi_status
from utils.db import get_db
from sqlalchemy.orm import Session

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


@router.post("/create")
async def create_rfi_endpoint(payload: dict, db: Session = Depends(get_db)):
    file_id = payload.get("file_id")
    issue = payload.get("issue")
    if file_id is None or issue is None:
        raise HTTPException(status_code=400, detail="file_id and issue are required")
    try:
        result = create_rfi(db, file_id, issue)
        return {"rfi_id": result["id"], "rfi": result}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list/{file_id}")
async def list_rfi_endpoint(file_id: int, db: Session = Depends(get_db)):
    return list_rfis(db, file_id)


@router.get("/{rfi_id}")
async def get_rfi_endpoint(rfi_id: int, db: Session = Depends(get_db)):
    rfi = get_rfi(db, rfi_id)
    if not rfi:
        raise HTTPException(status_code=404, detail="RFI not found")
    return rfi


@router.patch("/{rfi_id}/status")
async def update_rfi_status_endpoint(rfi_id: int, payload: dict, db: Session = Depends(get_db)):
    status = payload.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="status is required")
    rfi = update_rfi_status(db, rfi_id, status)
    if not rfi:
        raise HTTPException(status_code=404, detail="RFI not found")
    return rfi
