from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
import os
from sqlalchemy.orm import Session

from services.files_service import (
    create_file_record,
    get_file_by_id,
    get_file_path,
    list_files,
    save_file_to_disk,
)
from services.analyzer_service import run_text_analysis
from utils.db import get_db

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename, size = await save_file_to_disk(file)
    record = create_file_record(
        db,
        original_name=file.filename or filename,
        filename=filename,
        content_type=file.content_type or "application/octet-stream",
        size=size,
    )
    return record.as_dict()


@router.get("")
def list_file_records(db: Session = Depends(get_db)):
    records = list_files(db)
    return [r.as_dict() for r in records]


@router.get("/{file_id}")
def get_file_metadata(file_id: int, db: Session = Depends(get_db)):
    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    return record.as_dict()


@router.get("/{file_id}/download")
def download_file(file_id: int, db: Session = Depends(get_db)):
    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")

    path = get_file_path(record)
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File missing on disk.")
    return FileResponse(path, filename=record.original_name, media_type=record.content_type)


@router.post("/{file_id}/analyze")
async def analyze_file(file_id: int, db: Session = Depends(get_db)):
    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        return await run_text_analysis(record)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File missing on disk.")
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
