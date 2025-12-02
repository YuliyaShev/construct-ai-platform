import os
from typing import Dict

from pdf.export.pdf_exporter import PDFExporter
from pdf.rfi_pdf_service import RFI_REPORT_DIR
from services.files_service import get_file_by_id, get_file_path
from utils.db import SessionLocal
from ai.text_extractor import extract_text_from_pdf
from ai.vision.vision_llm_pipeline import run_vision_pipeline
from ai.llm.llm_pipeline import run_llm_pipeline
from ai.bom.bom_service import build_bom_pipeline
from ai.detail_navigation.navigation_service import resolve_all_references

EXPORT_DIR = os.path.join("project_data", "exports")
os.makedirs(EXPORT_DIR, exist_ok=True)


def build_export_data(file_id: int) -> Dict:
    db = SessionLocal()
    record = get_file_by_id(db, file_id)
    if not record:
        raise FileNotFoundError("File not found")
    file_path = get_file_path(record)
    if not os.path.exists(file_path):
        raise FileNotFoundError("File missing on disk.")

    text = extract_text_from_pdf(file_path)
    llm = run_llm_pipeline(text)
    vision = run_vision_pipeline(file_path, text)
    bom = build_bom_pipeline(text, vision.get("pages", []), vision.get("segments", []))
    refs = resolve_all_references(text, vision.get("pages", []), vision.get("geometry", []), vision.get("segments", []))

    heatmap_imgs = []
    for hm in vision.get("heatmap_targets", []):
        if hm.get("image_path"):
            heatmap_imgs.append({"page": hm.get("page"), "bbox": hm.get("bbox"), "image_path": hm.get("image_path")})

    export_data = {
        "file": {"id": record.id, "name": record.original_name},
        "bom": bom.get("bom", []),
        "issues": llm.get("issues", []) + (vision.get("geometry_issues") or []) + (vision.get("ocr_issues") or []),
        "heatmap_images": heatmap_imgs,
        "navigation_links": refs.get("navigation_map", {}).get("jump_links", []),
        "summary": llm.get("summary", ""),
        "stats": llm.get("stats", {}),
    }
    db.close()
    return export_data


def generate_and_save_report(file_id: int) -> str:
    export_data = build_export_data(file_id)
    output_path = os.path.join(EXPORT_DIR, f"{file_id}_report.pdf")
    PDFExporter().generate_full_report(export_data, output_path)
    return output_path
