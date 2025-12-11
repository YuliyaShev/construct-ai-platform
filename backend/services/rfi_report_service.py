import os
import json
import fitz  # PyMuPDF
from typing import Dict

from utils.pdf_export import build_rfi_report_pdf
from models.rfi import RFI
from models.file_record import FileRecord
from utils.db import SessionLocal
from services.files_service import get_file_path, get_file_by_id


def _derive_crop(rfi: Dict, pdf_path: str) -> str | None:
    try:
        doc = fitz.open(pdf_path)
        page_num = int(rfi.get("page") or rfi.get("page_number") or 1) - 1
        page = doc[page_num]
        rect = page.rect
        x = float(rfi.get("x", 0)) * rect.width if (rfi.get("x", 0) <= 1) else float(rfi.get("x", 0))
        y = float(rfi.get("y", 0)) * rect.height if (rfi.get("y", 0) <= 1) else float(rfi.get("y", 0))
        w = float(rfi.get("width", 150) or 150)
        h = float(rfi.get("height", 150) or 150)
        # if normalized width/height provided (<=1), scale to rect
        if w <= 1:
            w = w * rect.width
        if h <= 1:
            h = h * rect.height
        crop_rect = fitz.Rect(x, y, x + w, y + h)
        pix = page.get_pixmap(clip=crop_rect, dpi=144)
        out_path = os.path.join("uploaded_files", "rfi_previews", f"rfi_report_{rfi.get('id')}.png")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        pix.save(out_path)
        return out_path
    except Exception:
        return None


def generate_rfi_report(rfi_id: int) -> str:
    db = SessionLocal()
    rfi_obj = db.query(RFI).filter(RFI.id == rfi_id).first()
    if not rfi_obj:
        db.close()
        raise ValueError("RFI not found")
    file_obj = get_file_by_id(db, rfi_obj.file_id)
    if not file_obj:
        db.close()
        raise ValueError("File not found for RFI")

    pdf_path = get_file_path(file_obj)
    crop_path = _derive_crop(rfi_obj.as_dict(), pdf_path)

    export_path = build_rfi_report_pdf(
        rfi_obj.as_dict(),
        file_obj.as_dict() if hasattr(file_obj, "as_dict") else {"original_name": getattr(file_obj, "original_name", None)},
        crop_path,
    )
    db.close()
    return export_path
