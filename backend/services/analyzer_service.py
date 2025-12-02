import os
from typing import Dict

from ai.text_extractor import extract_text_from_pdf
from ai.llm.llm_pipeline import run_llm_pipeline
from ai.vision.vision_llm_pipeline import run_vision_pipeline
from ai.rfi.rfi_service import generate_rfi_batch
from ai.bom.bom_service import build_bom_pipeline
from ai.detail_navigation.navigation_service import resolve_all_references
from services.shop_drawing.shop_checker import ShopDrawingCheckerService
from models.file_record import FileRecord
from services.files_service import get_file_path


def merge_issues(rule_based: Dict, llm_results: Dict) -> Dict:
    issues = []
    if rule_based.get("issues"):
        issues.extend(rule_based["issues"])
    if llm_results.get("issues"):
        issues.extend(llm_results["issues"])
    return issues


async def run_text_analysis(file_record: FileRecord) -> Dict[str, str]:
    """AI Shop Drawing Analyzer v3 pipeline."""
    file_path = get_file_path(file_record)
    if not os.path.exists(file_path):
        raise FileNotFoundError("File missing on disk.")

    text = extract_text_from_pdf(file_path)

    checker = ShopDrawingCheckerService()
    v1_results = checker.analyze_shop_drawing(text)
    llm_results = run_llm_pipeline(text)
    vision_results = run_vision_pipeline(file_path, text)
    bom_results = build_bom_pipeline(text, vision_results.get("pages", []), vision_results.get("segments", []))
    ref_results = resolve_all_references(text, vision_results.get("pages", []), vision_results.get("geometry", []), vision_results.get("segments", []))

    combined = {
        "id": file_record.id,
        "filename": file_record.original_name,
        "text": text,
        "issues": merge_issues(v1_results, llm_results) + (vision_results.get("geometry_issues") or []) + (vision_results.get("ocr_issues") or []),
        "summary": llm_results.get("summary") or v1_results.get("summary"),
        "actions": llm_results.get("actions", []),
        "geometry": vision_results.get("geometry", []),
        "heatmap": vision_results.get("heatmap_targets", []),
        "stats": llm_results.get("stats", {}),
        "bom": bom_results.get("bom", []),
        "references": ref_results.get("resolved_references", []),
        "broken_references": ref_results.get("broken_references", []),
        "navigation_links": ref_results.get("navigation_map", {}).get("jump_links", []),
    }
    analysis_context = {
        "file_meta": {"id": file_record.id, "name": file_record.original_name},
        "heatmap": combined.get("heatmap", []),
        "ocr_pages": vision_results.get("pages", []),
        "geometry": vision_results.get("geometry", []),
        "mapped": vision_results.get("mapped", []),
        "segments": vision_results.get("segments", []),
        "text": text,
        "references": [ref for page in vision_results.get("mapped", []) for ref in page.get("references", [])],
    }
    rfi_list = generate_rfi_batch(
        issues=combined.get("issues", []),
        context=analysis_context,
    )
    combined["rfi"] = rfi_list
    return combined
