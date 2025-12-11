import fitz  # PyMuPDF
from typing import Dict, List


def extract_paths(doc: fitz.Document) -> List[Dict]:
    results = []
    for idx, page in enumerate(doc):
        drawings = page.get_drawings()
        for d in drawings:
            items = d.get("items", [])
            for path in items:
                op = path[0]
                pts = path[1]
                if op == "l" and len(pts) >= 4:
                    for i in range(0, len(pts) - 3, 2):
                        x1, y1, x2, y2 = pts[i], pts[i + 1], pts[i + 2], pts[i + 3]
                        results.append({
                            "page": idx + 1,
                            "type": "line",
                            "p1": [float(x1), float(y1)],
                            "p2": [float(x2), float(y2)],
                            "bbox": [min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2)],
                        })
                elif op == "c":
                    results.append({"page": idx + 1, "type": "curve", "points": [float(p) for p in pts]})
    return results


def extract_text_blocks_with_coords(doc: fitz.Document) -> List[Dict]:
    blocks = []
    for idx, page in enumerate(doc):
        for b in page.get_text("blocks"):
            x0, y0, x1, y1, text, *_ = b
            blocks.append({
                "page": idx + 1,
                "text": text.strip(),
                "bbox": [float(x0), float(y0), float(x1), float(y1)],
            })
    return blocks
