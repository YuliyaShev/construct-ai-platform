import fitz  # PyMuPDF
from typing import Dict, List


def extract_geometry(doc: fitz.Document, page_index: int) -> Dict:
    """
    Extract vector geometry from a PDF page.
    Returns coordinates in PDF space (0,0 bottom-left).
    """
    page = doc[page_index]
    drawings = page.get_drawings()
    lines = []
    curves = []
    polygons = []

    for drawing in drawings:
        paths = drawing.get("items", [])
        for path in paths:
            op = path[0]
            pts = path[1]
            if op == "l" and len(pts) >= 2:
                # lines
                for i in range(0, len(pts) - 1, 2):
                    lines.append(
                        {
                            "p1": [float(pts[i]), float(pts[i + 1])],
                            "p2": [float(pts[i + 2]), float(pts[i + 3])] if i + 3 < len(pts) else None,
                        }
                    )
            elif op == "c":
                curves.append({"points": [float(p) for p in pts]})
            elif op == "l" and len(pts) > 4:
                polygons.append({"points": [float(p) for p in pts]})

    # Hatch detection placeholder: real hatch parsing would inspect patterns
    hatches = []

    return {
        "page": page_index + 1,
        "lines": lines,
        "curves": curves,
        "polygons": polygons,
        "hatches": hatches,
        "bbox": list(page.bound()) if hasattr(page, "bound") else None,
    }
