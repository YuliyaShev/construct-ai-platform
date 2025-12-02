from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from services.pdf.report_generator import generate_shop_drawing_report
import json
import tempfile

router = APIRouter(prefix="/shop-drawing", tags=["Shop Drawing Export"])


@router.post("/export")
async def export_shop_drawing_report(data: dict):
    """Generate and return a Shop Drawing analysis PDF report."""
    pdf_path = generate_shop_drawing_report(data)
    return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_path.split("/")[-1])
