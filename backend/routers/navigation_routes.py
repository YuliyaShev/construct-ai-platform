from fastapi import APIRouter, HTTPException
from utils.db import get_db
from sqlalchemy.orm import Session
from services.files_service import get_file_by_id
from ai.detail_navigation.navigation_service import resolve_all_references
from ai.text_extractor import extract_text_from_pdf
from services.files_service import get_file_path
from ai.vision.vision_llm_pipeline import run_vision_pipeline
import os

router = APIRouter(prefix="/navigate", tags=["Navigation"])


@router.get("/{file_id}")
async def navigate_file(file_id: int, db: Session = get_db()):
    record = get_file_by_id(db, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    file_path = get_file_path(record)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on disk.")

    text = extract_text_from_pdf(file_path)
    vision_results = run_vision_pipeline(file_path, text)
    ref_results = resolve_all_references(text, vision_results.get("pages", []), vision_results.get("geometry", []), vision_results.get("segments", []))
    return {
        "navigation_links": ref_results.get("navigation_map", {}).get("jump_links", []),
        "references": ref_results.get("resolved_references", []),
        "broken_references": ref_results.get("broken_references", []),
    }
