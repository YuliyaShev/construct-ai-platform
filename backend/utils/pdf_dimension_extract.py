import re
from typing import List, Dict

import fitz  # PyMuPDF

from utils.dimension_parser import parse_length
from utils.unit_conversion import inches_to_mm


DIMENSION_PATTERNS = [
    r"\d+\s?\d?/?\d+\s*\"",
    r"\d+'\s*\d+\"",
    r"\d+(?:\.\d+)?\s*mm",
    r"\d+(?:\.\d+)?",
]
DIMENSION_REGEX = re.compile("|".join(DIMENSION_PATTERNS))


def extract_dimensions(doc: fitz.Document) -> List[Dict]:
    dims: List[Dict] = []
    for page_index, page in enumerate(doc):
        for block in page.get_text("blocks"):
            if len(block) < 5:
                continue
            _, _, _, _, text, _, bbox = block
            if not text:
                continue
            for match in DIMENSION_REGEX.finditer(text):
                raw = match.group(0)
                val_in = parse_length(raw)
                if val_in is None:
                    continue
                dims.append(
                    {
                        "raw": raw,
                        "value_mm": inches_to_mm(val_in),
                        "page": page_index + 1,
                        "x": bbox[0],
                        "y": bbox[1],
                        "orientation": _infer_orientation(bbox),
                        "source": "pdf",
                        "label": None,
                    }
                )
    return dims


def _infer_orientation(bbox):
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    if width >= height * 1.2:
        return "horizontal"
    if height >= width * 1.2:
        return "vertical"
    return "unknown"
