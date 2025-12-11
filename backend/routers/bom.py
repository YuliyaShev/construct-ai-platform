from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from services.bom_service import extract_bom_for_file
from utils.db import get_db

router = APIRouter(prefix="/files", tags=["BOM"])


@router.get("/{file_id}/bom")
async def get_bom(file_id: int, db: Session = Depends(get_db)):
    try:
        bom = await extract_bom_for_file(db, file_id)
        return bom
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
