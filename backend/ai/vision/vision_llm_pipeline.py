from typing import Dict, List

from ai.llm.llm_client import LLMClient
from ai.llm.prompts import FINAL_SUMMARY_PROMPT
from ai.vision.pdf_vision_extractor import extract_pdf_vision
from ai.vision.geometry_detector import detect_geometry
from ai.vision.coord_mapper import map_coordinates
from ai.vision.pdf_segmentation import segment_pdf_pages


def _vision_reasoning(client: LLMClient, context: Dict) -> Dict:
    prompt = f"""
You are a structural/detailing reviewer. Use spatial context to spot geometry/text conflicts.
Data:
{context}
Return JSON with keys: geometry_issues, ocr_issues, combined_llm_inferences.
"""
    return client.generate_json(prompt, schema={"geometry_issues": [], "ocr_issues": [], "combined_llm_inferences": []})


def run_vision_pipeline(pdf_path: str, extracted_text: str) -> Dict:
    """Run vision+geometry OCR and LLM reasoning."""
    vision_pages = extract_pdf_vision(pdf_path)
    geometries = [detect_geometry(page["image_path"], page["page"]) for page in vision_pages]
    mapped = [map_coordinates(page, geom) for page, geom in zip(vision_pages, geometries)]
    segments = segment_pdf_pages(vision_pages)

    client = LLMClient()
    context = {
        "pages": vision_pages,
        "geometry": geometries,
        "mapped": mapped,
        "segments": segments,
        "extracted_text": extracted_text[:4000],
    }

    llm_out = _vision_reasoning(client, context)
    issues = (llm_out.get("geometry_issues") or []) + (llm_out.get("ocr_issues") or []) + (llm_out.get("combined_llm_inferences") or [])
    heatmap = []
    for issue in issues:
        if issue.get("bbox"):
            heatmap.append({"page": issue.get("page", 1), "bbox": issue["bbox"], "severity": issue.get("severity", "info")})

    return {
        "geometry_issues": llm_out.get("geometry_issues") or [],
        "ocr_issues": llm_out.get("ocr_issues") or [],
        "combined_llm_inferences": llm_out.get("combined_llm_inferences") or [],
        "heatmap_targets": heatmap,
        "pages": vision_pages,
        "geometry": geometries,
        "mapped": mapped,
        "segments": segments,
    }
