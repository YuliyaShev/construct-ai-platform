from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import json

from models.analysis_result import AnalysisResult
from ai.heatmap_builder import build_heatmap
from utils.db import get_db

router = APIRouter(tags=["Heatmap"])


@router.get("/analysis/{analysis_id}/heatmap")
async def get_heatmap(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    try:
        page_result = json.loads(record.result_json)
    except Exception:
        raise HTTPException(status_code=500, detail="Invalid analysis data.")

    issues = page_result.get("issues", [])
    page_bbox = page_result.get("geometry", {}).get("bbox") or [0, 0, 1, 1]
    page_width = page_bbox[2] - page_bbox[0] if len(page_bbox) == 4 else 1
    page_height = page_bbox[3] - page_bbox[1] if len(page_bbox) == 4 else 1
    heatmap = build_heatmap(issues, page_width, page_height)

    return {
        "page": page_result.get("page"),
        "heatmap": heatmap
    }
