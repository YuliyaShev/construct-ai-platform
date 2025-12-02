import re
from typing import Dict, List


def normalize_text(text: str) -> str:
    """Basic normalization to reduce noise."""
    return re.sub(r"\s+", " ", text).strip()


def extract_sections(text: str) -> Dict[str, List[str]]:
    sections = {"title_blocks": [], "notes": [], "dimensions": [], "callouts": []}
    for line in text.splitlines():
        lower = line.lower()
        if "sheet" in lower or "project" in lower:
            sections["title_blocks"].append(line.strip())
        if "note" in lower or line.strip().startswith("•"):
            sections["notes"].append(line.strip())
        if re.search(r"\d+['\"]|mm|cm|in", lower):
            sections["dimensions"].append(line.strip())
        if "see" in lower and "detail" in lower:
            sections["callouts"].append(line.strip())
    return sections


def extract_possible_details(text: str) -> List[str]:
    return re.findall(r"(detail\s+\w+/?\w*)", text, flags=re.IGNORECASE)


def extract_cross_references(text: str) -> List[str]:
    return re.findall(r"see\s+detail\s+[0-9A-Za-z/.-]+", text, flags=re.IGNORECASE)


def detect_missing_details(text: str) -> List[str]:
    missing = []
    if "revision" not in text.lower():
        missing.append("Revision block not found.")
    if "scale" not in text.lower():
        missing.append("Scale information missing.")
    return missing


def parse_dimension_lines(text: str) -> List[str]:
    return re.findall(r"\d+(?:\.\d+)?\s?(?:mm|cm|m|in|ft|')", text, flags=re.IGNORECASE)


def enhance_extraction(text: str) -> Dict[str, object]:
    normalized = normalize_text(text)
    sections = extract_sections(text)
    details = extract_possible_details(text)
    refs = extract_cross_references(text)
    missing = detect_missing_details(text)
    dimensions = parse_dimension_lines(text)

    return {
        "raw_text": text,
        "normalized": normalized,
        "notes": sections.get("notes", []),
        "dimensions": dimensions or sections.get("dimensions", []),
        "sections": sections,
        "references": refs,
        "missing": missing,
        "details": details,
    }
