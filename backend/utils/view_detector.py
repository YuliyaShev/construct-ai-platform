import re
from typing import List, Dict


def classify_pages(text_blocks: List[Dict]) -> Dict[int, str]:
    """
    Classify pages into plan / elevation / section based on text keywords.
    text_blocks: list of {"page": int, "text": str}
    """
    labels: Dict[int, str] = {}
    for block in text_blocks:
        p = block.get("page")
        txt = (block.get("text") or "").upper()
        label = labels.get(p)
        if label:
            continue
        if any(k in txt for k in ["PLAN", "TOP VIEW"]):
            labels[p] = "plan"
        elif any(k in txt for k in ["ELEVATION", "FRONT"]):
            labels[p] = "elevation"
        elif re.search(r"SECTION\s+[A-Z]-[A-Z]", txt) or "SECTION" in txt:
            labels[p] = "section"
    return labels
