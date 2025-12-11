from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.file_record import FileRecord
from services.files_service import get_file_by_id
from services.clash_service import run_clash_detection
from utils.db import get_db

router = APIRouter(prefix="/files", tags=["Clash Detection"])


@router.get("/{file_id}/bim/clashes")
async def get_clashes(file_id: int, db: Session = Depends(get_db)):
    record: FileRecord = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        result = await run_clash_detection(record)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
