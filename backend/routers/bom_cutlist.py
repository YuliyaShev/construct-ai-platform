from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from services.files_service import get_file_by_id, get_file_path
from services.cutlist_service import extract_cutlist
from utils.db import get_db

router = APIRouter(prefix="/files", tags=["BOM Cutlist"])


@router.get("/{file_id}/bom/cutlist")
async def get_cutlist(file_id: int, db: Session = Depends(get_db)):
    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        result = await extract_cutlist(get_file_path(record))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
