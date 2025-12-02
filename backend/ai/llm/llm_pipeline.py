from typing import Dict, List

from ai.llm.drawing_reasoner import (
    aggregate_chunks,
    check_cross_references,
    detect_dimension_conflicts,
    detect_missing_notes,
    reason_over_chunk,
)
from ai.llm.extraction_enhancer import enhance_extraction
from ai.llm.llm_client import LLMClient
from services.shop_drawing.shop_checker import ShopDrawingCheckerService


def merge_chunk_issues(results: List[Dict]) -> Dict:
    issues = []
    summaries = []
    actions = []
    for res in results:
        if res.get("issues"):
            issues.extend(res["issues"])
        if res.get("summary"):
            summaries.append(res["summary"])
        if res.get("actions"):
            actions.extend(res["actions"])
    return {
        "issues": issues,
        "summary": "\n".join(summaries),
        "actions": actions,
    }


def run_llm_pipeline(extracted_text: str) -> Dict:
    """Hybrid pipeline: extraction enhancements + multi-pass LLM reasoning."""
    enhancer_output = enhance_extraction(extracted_text)
    client = LLMClient()

    chunks = client.split_long_text(enhancer_output["normalized"])

    chunk_results = []
    for chunk in chunks:
        primary = reason_over_chunk(client, chunk)
        dim = detect_dimension_conflicts(client, chunk)
        notes = detect_missing_notes(client, chunk)
        refs = check_cross_references(client, chunk)
        combined_chunk = {
            "issues": (primary.get("issues") or []) + (dim.get("issues") or []) + (notes.get("issues") or []) + (refs.get("issues") or []),
            "summary": primary.get("summary", ""),
            "actions": primary.get("actions", []),
        }
        chunk_results.append(combined_chunk)

    merged = merge_chunk_issues(chunk_results)
    final = aggregate_chunks(client, chunk_results)

    # Merge rule-based v1 stub for now
    checker = ShopDrawingCheckerService()
    rule_based = checker.analyze_shop_drawing(extracted_text)

    combined_issues = (rule_based.get("issues") or []) + (merged.get("issues") or []) + (final.get("issues") or [])
    summary = final.get("summary") or merged.get("summary") or rule_based.get("summary") or ""
    actions = final.get("actions") or merged.get("actions") or []

    return {
        "issues": combined_issues,
        "summary": summary,
        "actions": actions,
        "stats": final.get("meta", {}),
    }
