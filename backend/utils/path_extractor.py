import fitz  # PyMuPDF
from typing import List, Dict


def extract_lines_and_paths(doc: fitz.Document) -> List[Dict]:
    paths = []
    for idx, page in enumerate(doc):
        drawings = page.get_drawings()
        for d in drawings:
            for item in d.get("items", []):
                op = item[0]
                pts = item[1]
                if op == "l" and len(pts) >= 4:
                    for i in range(0, len(pts) - 3, 2):
                        x1, y1, x2, y2 = pts[i], pts[i + 1], pts[i + 2], pts[i + 3]
                        paths.append({
                            "page": idx + 1,
                            "p1": [float(x1), float(y1)],
                            "p2": [float(x2), float(y2)],
                            "type": "line",
                            "bbox": [min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2)],
                        })
    return paths
