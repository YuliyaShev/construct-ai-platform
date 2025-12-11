from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session

from services.load_path_service import analyze_load_path, save_load_path_result
from utils.db import get_db

router = APIRouter(prefix="/structural", tags=["Load Path"])


@router.post("/load-path")
async def load_path(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")
    import tempfile, os

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        result = analyze_load_path(tmp_path)
        save_load_path_result(db, file_id=0, result=result)
        os.remove(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
