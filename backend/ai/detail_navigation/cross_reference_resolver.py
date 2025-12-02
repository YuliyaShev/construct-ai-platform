from typing import Dict, List

from ai.detail_navigation.reference_parser import extract_references
from ai.detail_navigation.detail_locator import find_detail_on_pages
from ai.detail_navigation import reference_prompt
from ai.llm.llm_client import LLMClient


def resolve_references(raw_text: str, ocr_pages: List[Dict], segments: List[Dict]) -> Dict:
    parsed = extract_references(raw_text, ocr_pages)
    refs = parsed.get("references", [])
    located = find_detail_on_pages(refs, ocr_pages, segments)

    client = LLMClient()
    resolved_refs = []
    broken_refs = []
    for ref in located:
        status = "ok" if ref.get("resolved_page") else "missing"
        if status == "missing":
            broken_refs.append({
                "type": "missing_detail_reference",
                "severity": "error",
                "message": f"Reference {ref.get('raw')} not found",
                "source_page": ref.get("page"),
                "source_bbox": ref.get("context_bbox"),
            })
        resolved_refs.append({**ref, "status": status})

    return {
        "resolved_references": resolved_refs,
        "broken_references": broken_refs,
    }
