from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import json
import os

from ai.analyzer_v4.analyzer_v4 import analyze
from services.files_service import get_file_by_id, get_file_path
from models.analysis_result import AnalysisResult
from utils.db import get_db

router = APIRouter(prefix="/analyze", tags=["Analyzer v4"])


@router.post("/v4")
async def analyze_v4(payload: dict, db: Session = Depends(get_db)):
    file_id = payload.get("file_id")
    if file_id is None:
        raise HTTPException(status_code=400, detail="file_id is required")

    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = get_file_path(record)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on disk")

    result = analyze(file_path)

    for page_data in result.get("pages", []):
        db_obj = AnalysisResult(
            file_id=file_id,
            page=page_data.get("page"),
            result_json=json.dumps(page_data),
        )
        db.add(db_obj)
    db.commit()

    return result
