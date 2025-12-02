import re
from typing import Dict, List


MATERIAL_PATTERNS = [
    r"\bALUMINUM\b",
    r"\bALUM\b",
    r"\bALU\b",
    r"\bSTEEL\b",
    r"\bSS\b",
    r"\bSTAINLESS\b",
    r"\bGLASS\b",
    r"\bPIPE\b",
    r"\bPOST\b",
    r"\bRAIL\b",
    r"\bBASEPLATE\b",
    r"\bPLATE\b",
    r"\bANGLE\b",
]

DIMENSION_PATTERN = r"\b\d+(?:\.\d+)?(?:\s?(?:mm|cm|m|in|\"|''|ft|GA))\b"
SCHEDULE_HEADERS = ["ITEM", "QTY", "QUANTITY", "DESCRIPTION", "SIZE", "MATERIAL"]


def _match_materials(text: str) -> bool:
    return any(re.search(p, text, flags=re.IGNORECASE) for p in MATERIAL_PATTERNS)


def _parse_lines(text: str) -> List[str]:
    return [ln.strip() for ln in text.splitlines() if ln.strip()]


def extract_from_text(raw_text: str) -> List[Dict]:
    candidates = []
    for ln in _parse_lines(raw_text):
        if _match_materials(ln) or re.search(DIMENSION_PATTERN, ln):
            candidates.append({"text": ln, "source": "text", "page": None, "bbox": None})
    return candidates


def extract_from_ocr(ocr_pages: List[Dict]) -> List[Dict]:
    candidates = []
    for page in ocr_pages or []:
        for block in page.get("ocr_blocks", []):
            t = block.get("text", "")
            if _match_materials(t) or re.search(DIMENSION_PATTERN, t):
                candidates.append({
                    "text": t,
                    "source": "ocr",
                    "page": page.get("page"),
                    "bbox": block.get("bbox"),
                })
    return candidates


def extract_from_segments(segments: List[Dict]) -> List[Dict]:
    candidates = []
    # Heuristic: segments likely to contain schedules or notes.
    for seg in segments or []:
        for s in seg.get("segments", []):
            if s.get("type") in {"notes", "detail", "schedule"}:
                candidates.append({
                    "text": f"Segment {s.get('type')} on page {seg.get('page')}",
                    "source": "segment",
                    "page": seg.get("page"),
                    "bbox": s.get("bbox"),
                })
    return candidates


def extract_bom_candidates(text: str, ocr_pages: List[Dict], segments: List[Dict]) -> Dict:
    candidates = []
    candidates.extend(extract_from_text(text))
    candidates.extend(extract_from_ocr(ocr_pages))
    candidates.extend(extract_from_segments(segments))
    return {"candidates": candidates}
