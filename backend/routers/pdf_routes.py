from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
from sqlalchemy.orm import Session

from services.pdf.pdf_utils import (
    extract_drawings,
    extract_text_from_path,
    generate_rfi_auto,
    generate_rfi_pdf,
    get_next_rfi_number,
    summarize_pdf
)
from services.files_service import create_file_record, get_file_path, save_file_to_disk
from utils.db import get_db

router = APIRouter(tags=["PDF Operations"])


@router.get("/")
def read_root():
    return {"status": "API is running"}


@router.post("/upload-pdf")
@router.post("/pdf/upload")
async def upload_pdf(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload PDF with no size limit."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    saved_filename, size = await save_file_to_disk(file)
    record = create_file_record(
        db,
        original_name=file.filename or saved_filename,
        filename=saved_filename,
        content_type=file.content_type or "application/pdf",
        size=size,
    )

    return {
        "id": record.id,
        "original_name": record.original_name,
        "filename": record.filename,
        "content_type": record.content_type,
        "size": record.size,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "path": get_file_path(record),
        "message": "PDF uploaded successfully (no size limit)"
    }


@router.post("/analyze-pdf")
@router.post("/pdf/analyze")
async def analyze_pdf(file_path: str):
    """Extract all text from a saved PDF."""
    try:
        return extract_text_from_path(file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="PDF not found.")


@router.post("/summarize-pdf")
async def summarize_pdf_endpoint(request: Request, file_path: str):
    """Summarize PDF using OpenAI."""
    try:
        return summarize_pdf(file_path, request.app.state.client)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="PDF file not found.")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-drawings")
async def extract_drawings_endpoint(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    try:
        return extract_drawings(pdf_bytes)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/generate-rfi")
async def generate_rfi(request: Request, rfi: dict):
    try:
        rfi_number = get_next_rfi_number(request.app.state.rfi_counter_file)
        pdf_path = generate_rfi_pdf(rfi, rfi_number, request.app.state.rfi_output_dir)

        return {
            "rfi_number": f"RFI-{rfi_number:03}",
            "pdf_path": pdf_path,
            "message": "RFI PDF generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-rfi-auto")
async def generate_rfi_auto_endpoint(request: Request, file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    return generate_rfi_auto(pdf_bytes, request.app.state.client)
