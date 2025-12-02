import os
import uuid
from typing import Optional, Tuple

from fastapi import UploadFile
from sqlalchemy.orm import Session

from models.file_record import FileRecord

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FILE_STORAGE_DIR = os.path.join(BASE_DIR, "project_data", "files")
os.makedirs(FILE_STORAGE_DIR, exist_ok=True)


async def save_file_to_disk(uploaded_file: UploadFile) -> Tuple[str, int]:
    """Persist uploaded file to storage directory."""
    os.makedirs(FILE_STORAGE_DIR, exist_ok=True)

    original_name = uploaded_file.filename or "upload"
    ext = os.path.splitext(original_name)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(FILE_STORAGE_DIR, filename)

    content = await uploaded_file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return filename, len(content)


def create_file_record(db: Session, *, original_name: str, filename: str, content_type: str, size: int) -> FileRecord:
    record = FileRecord(
        original_name=original_name,
        filename=filename,
        content_type=content_type,
        size=size,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_files(db: Session):
    return db.query(FileRecord).order_by(FileRecord.created_at.desc()).all()


def get_file_by_id(db: Session, file_id: int) -> Optional[FileRecord]:
    return db.query(FileRecord).filter(FileRecord.id == file_id).first()


def get_file_path(record: FileRecord) -> str:
    return os.path.join(FILE_STORAGE_DIR, record.filename)


def delete_file(record: FileRecord):
    """Scaffold for future delete logic."""
    pass
