from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.file_record import FileRecord
from services.dimension_checker_service import run_dimension_check
from services.files_service import get_file_by_id
from utils.db import get_db

router = APIRouter(prefix="/files", tags=["Dimension Checker"])


@router.get("/{file_id}/bim/dim-check")
async def dim_check(file_id: int, db: Session = Depends(get_db)):
    record: FileRecord = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        return await run_dimension_check(record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
