from typing import Dict, List


def detect_rule_based_issues(geometry: Dict, text_blocks: Dict) -> List[Dict]:
    issues = []
    # Very simple heuristics; real logic should inspect dimensions/lines.
    if not geometry.get("lines"):
        issues.append({
            "category": "missing_geometry",
            "description": "No vector lines detected on page.",
            "page": geometry.get("page"),
            "severity": "low",
            "confidence": 0.4,
            "bbox": geometry.get("bbox"),
        })
    if text_blocks and not text_blocks.get("blocks"):
        issues.append({
            "category": "missing_annotations",
            "description": "No text annotations detected on page.",
            "page": text_blocks.get("page"),
            "severity": "warning",
            "confidence": 0.5,
            "bbox": None,
        })
    return issues


def merge_issues(*issue_lists: List[List[Dict]]) -> List[Dict]:
    merged = []
    for lst in issue_lists:
        merged.extend(lst or [])
    return merged
