from typing import Dict, List

from ai.detail_navigation.cross_reference_resolver import resolve_references


def create_navigation_map(resolved_refs: List[Dict]) -> Dict:
    jump_links = []
    for ref in resolved_refs or []:
        if ref.get("resolved_page") and ref.get("resolved_bbox"):
            jump_links.append({
                "source_page": ref.get("page"),
                "source_bbox": ref.get("context_bbox"),
                "target_page": ref.get("resolved_page"),
                "target_bbox": ref.get("resolved_bbox"),
                "label": ref.get("raw"),
            })
    return {"jump_links": jump_links}


def resolve_all_references(text: str, ocr_pages: List[Dict], geometry: List[Dict], segments: List[Dict]) -> Dict:
    ref_result = resolve_references(text, ocr_pages, segments)
    nav_map = create_navigation_map(ref_result.get("resolved_references", []))
    return {
        "resolved_references": ref_result.get("resolved_references", []),
        "broken_references": ref_result.get("broken_references", []),
        "navigation_map": nav_map,
    }
