import asyncio
import re
from collections import defaultdict
from typing import Dict, List

import fitz  # PyMuPDF

from utils.pdf_geometry import extract_paths, extract_text_blocks_with_coords
from utils.dimension_parser import parse_length
from ai.llm.llm_client import LLMClient

PROFILE_PATTERNS = [
    r"\b\d+\.?\d*x\d+\.?\d*\b",  # 2x2, 1.5x1.5
    r"\bHSS\s*\d+\.?\d*x\d+\.?\d*\b",
    r"\bGLASS\b",
    r"\bPICKET\b",
    r"\bRAIL\b",
]


def _distance(p1, p2):
    return ((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2) ** 0.5


def _line_length(line: Dict) -> float:
    p1, p2 = line["p1"], line["p2"]
    return _distance(p1, p2)


async def extract_geometry_bom(file_path: str) -> Dict:
    loop = asyncio.get_event_loop()
    doc = await loop.run_in_executor(None, fitz.open, file_path)
    paths = extract_paths(doc)
    texts = extract_text_blocks_with_coords(doc)

    length_map: Dict[int, List[float]] = defaultdict(list)
    profile_map: Dict[int, List[str]] = defaultdict(list)

    # Detect dimensions near lines
    for line in [p for p in paths if p["type"] == "line"]:
        line_len = _line_length(line)
        if line_len <= 0:
            continue
        # find nearby dimension text
        page_texts = [t for t in texts if t["page"] == line["page"]]
        dim_value = None
        for t in page_texts:
            lcx = (line["p1"][0] + line["p2"][0]) / 2
            lcy = (line["p1"][1] + line["p2"][1]) / 2
            tx = (t["bbox"][0] + t["bbox"][2]) / 2
            ty = (t["bbox"][1] + t["bbox"][3]) / 2
            if _distance([lcx, lcy], [tx, ty]) < 20:  # proximity heuristic
                dim = parse_length(t["text"])
                if dim:
                    dim_value = dim
                    break
        # fallback: use geometric length (PDF units ~= points), treat as inches approximation
        if not dim_value:
            dim_value = line_len / 72.0  # rough conversion
        length_map[line["page"]].append(dim_value)

    # detect profile names from text
    for t in texts:
        up = t["text"].upper()
        if any(re.search(pat, up) for pat in PROFILE_PATTERNS):
            profile_map[t["page"]].append(t["text"].strip())

    # LLM normalization (optional) to map profiles; for simplicity, pick first profile per page
    client = LLMClient()
    profiles_output = []
    for page, lengths in length_map.items():
        profile_name = profile_map.get(page, ["Linear Member"])[0]
        total = sum(lengths)
        profiles_output.append({
            "profile": profile_name,
            "count": len(lengths),
            "lengths": [round(l, 2) for l in lengths],
            "total_length": round(total, 2),
            "unit": "in",
            "source_pages": [str(page)],
        })

    return {"profiles": profiles_output}
