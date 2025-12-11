from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from services.files_service import get_file_by_id, get_file_path
from services.model3d_service import build_3d_model
from utils.db import get_db

router = APIRouter(prefix="/files", tags=["BOM 3D"])


@router.get("/{file_id}/bom/3d")
async def get_bom_3d(file_id: int, db: Session = Depends(get_db)):
    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        result = await build_3d_model(get_file_path(record))
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
