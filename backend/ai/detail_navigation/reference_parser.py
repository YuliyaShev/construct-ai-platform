import re
from typing import Dict, List

REF_PATTERNS = [
    r"SEE\s+DETAIL\s+([0-9A-Za-z]+)\s*/\s*([A-Za-z0-9\.-]+)",
    r"SEE\s+DETAIL\s+([0-9A-Za-z]+)",
    r"DETAIL\s+([0-9A-Za-z]+)\s*/\s*([A-Za-z0-9\.-]+)",
    r"SECTION\s+([A-Za-z])[-–]([A-Za-z])",
    r"SEE\s+(PLAN|ELEVATION)\s+([0-9A-Za-z/\.]+)",
]


def parse_text_for_references(text: str, page: int = None, bbox=None) -> List[Dict]:
    refs = []
    for pattern in REF_PATTERNS:
        for m in re.finditer(pattern, text, flags=re.IGNORECASE):
            groups = m.groups()
            detail_number = None
            sheet = None
            if len(groups) == 2:
                detail_number, sheet = groups
            elif len(groups) == 1:
                detail_number = groups[0]
            refs.append({
                "raw": m.group(0),
                "detail_number": detail_number,
                "sheet": sheet,
                "page": page,
                "context_bbox": bbox,
            })
    return refs


def extract_references(raw_text: str, ocr_pages: List[Dict]) -> Dict:
    references = []
    # Parse raw text
    references.extend(parse_text_for_references(raw_text, page=None, bbox=None))

    # Parse OCR blocks
    for page in ocr_pages or []:
        for block in page.get("ocr_blocks", []):
            refs = parse_text_for_references(block.get("text", ""), page=page.get("page"), bbox=block.get("bbox"))
            references.extend(refs)

    return {"references": references}
