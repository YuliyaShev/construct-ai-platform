from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import uuid
import json

from services.shop_drawing.shop_checker import ShopDrawingCheckerService
from models.uploaded_file import UploadedFile
from utils.db import get_db

router = APIRouter(prefix="/shop-drawing", tags=["Shop Drawing"])

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

checker = ShopDrawingCheckerService()


@router.post("/check")
async def check_shop_drawing(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload PDF and run shop drawing analysis."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")

    unique_name = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = checker.extract_text(file_path)
    result = checker.analyze_shop_drawing(text)

    record = UploadedFile(
        original_filename=file.filename,
        saved_as=unique_name,
        saved_to=file_path,
        summary=result.get("summary"),
        missing_dimensions=json.dumps(result.get("missing_dimensions", [])),
        issues=json.dumps(result.get("issues", [])),
        analysis_json=json.dumps(result)
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "file": unique_name,
        **result
    }


@router.get("/files")
def list_shop_drawings(db: Session = Depends(get_db)):
    files = db.query(UploadedFile).order_by(UploadedFile.created_at.desc()).all()
    return [f.as_dict() for f in files]


@router.get("/file/{file_id}")
def get_shop_drawing(file_id: int, db: Session = Depends(get_db)):
    record = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    if not os.path.exists(record.saved_to):
        raise HTTPException(status_code=404, detail="File missing on disk.")
    return FileResponse(record.saved_to, media_type="application/pdf", filename=record.original_filename)
