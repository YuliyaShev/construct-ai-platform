from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
import os
from sqlalchemy.orm import Session

from models.file_record import FileRecord
from utils.db import get_db
from services.pdf.pdf_utils import extract_text_from_path

router = APIRouter(tags=["Files"])


@router.get("/files")
def list_files(db: Session = Depends(get_db)):
    records = db.query(FileRecord).order_by(FileRecord.created_at.desc()).all()
    return [record.as_dict() for record in records]


@router.get("/files/{file_id}")
def get_file_metadata(file_id: int, db: Session = Depends(get_db)):
    record = db.query(FileRecord).filter(FileRecord.id == file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    return record.as_dict()


@router.get("/files/{file_id}/download")
def download_file(file_id: int, db: Session = Depends(get_db)):
    record = db.query(FileRecord).filter(FileRecord.id == file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    if not os.path.exists(record.path):
        raise HTTPException(status_code=404, detail="File missing on disk.")

    return FileResponse(
        record.path,
        filename=record.original_name,
        media_type="application/pdf"
    )


@router.get("/files/{file_id}/analyze")
def analyze_file(file_id: int, db: Session = Depends(get_db)):
    record = db.query(FileRecord).filter(FileRecord.id == file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    if not os.path.exists(record.path):
        raise HTTPException(status_code=404, detail="File missing on disk.")

    try:
        return extract_text_from_path(record.path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="PDF not found.")
