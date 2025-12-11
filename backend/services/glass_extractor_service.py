import re
import asyncio
from typing import Dict, List

import fitz  # PyMuPDF
import pdfplumber
from shapely.geometry import Polygon

from utils.dimension_parser import parse_length
from utils.unit_conversion import points_to_inches, inches_to_sqm


DIMENSION_PATTERNS = [
    r"\d+\s?\d?/?\d+\"\s?[x×]\s?\d+\s?\d?/?\d+\"",
    r"\d+\s?(mm|m)\s?[x×]\s?\d+\s?(mm|m)",
]


def _parse_dim_pair(text: str) -> List[float]:
    parts = re.split(r"[x×]", text.lower())
    if len(parts) >= 2:
        w = parse_length(parts[0].strip().replace("mm", "").replace("m", ""))
        h = parse_length(parts[1].strip().replace("mm", "").replace("m", ""))
        return [w, h]
    return []


def _extract_polygons(doc: fitz.Document) -> List[Dict]:
    polys = []
    for idx, page in enumerate(doc):
        drawings = page.get_drawings()
        for d in drawings:
            for item in d.get("items", []):
                op = item[0]
                pts = item[1]
                if op == "l" and len(pts) >= 6:
                    # closed poly if first == last
                    coords = []
                    for i in range(0, len(pts), 2):
                        coords.append((pts[i], pts[i + 1]))
                    if len(coords) >= 3:
                        if coords[0] != coords[-1]:
                            coords.append(coords[0])
                        polys.append({"page": idx + 1, "polygon": coords})
    return polys


def _extract_text_blocks(doc: fitz.Document) -> List[Dict]:
    blocks = []
    for idx, page in enumerate(doc):
        for b in page.get_text("blocks"):
            x0, y0, x1, y1, text, *_ = b
            t = (text or "").strip()
            if t:
                blocks.append({"page": idx + 1, "text": t, "bbox": [x0, y0, x1, y1]})
    return blocks


def _extract_schedule_rows(file_path: str) -> List[Dict]:
    rows = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for tbl in tables or []:
                if not tbl:
                    continue
                header = [c.lower() if c else "" for c in tbl[0]]
                if any("glass" in h for h in header) or any("width" in h for h in header):
                    for row in tbl[1:]:
                        rows.append({"page": page.page_number, "row": row, "header": header})
    return rows


async def extract_glass_bom(file_path: str) -> Dict:
    loop = asyncio.get_event_loop()
    doc = await loop.run_in_executor(None, fitz.open, file_path)
    polys = _extract_polygons(doc)
    texts = _extract_text_blocks(doc)
    schedules = await loop.run_in_executor(None, _extract_schedule_rows, file_path)

    panels = []
    total_sqft = 0.0

    # From polygons
    for poly in polys:
        pg = doc[poly["page"] - 1]
        polygon = Polygon(poly["polygon"])
        area_pts = polygon.area  # in PDF points squared
        area_in_sqft = (points_to_inches(1) ** 2) * area_pts / 144.0  # convert to sqft
        area_in_sqft = abs(area_in_sqft)
        area_in_sqm = inches_to_sqm(area_in_sqft * 144) / 144  # simplify: already sqft -> sqm
        total_sqft += area_in_sqft
        panels.append({
            "type": None,
            "width_mm": None,
            "height_mm": None,
            "area_sqft": round(area_in_sqft, 2),
            "area_sqm": round(area_in_sqm, 2),
            "page": f"{poly['page']}",
            "source": "geometry",
            "polygon": [[float(p[0]), float(p[1])] for p in poly["polygon"]],
        })

    # Dimension text override
    for t in texts:
        if any(re.search(p, t["text"]) for p in DIMENSION_PATTERNS):
            dims = _parse_dim_pair(t["text"])
            if len(dims) == 2:
                w_in, h_in = dims
                area_sqft = (w_in * h_in) / 144 if w_in and h_in else None
                area_sqm = inches_to_sqm(area_sqft * 144) / 144 if area_sqft else None
                panels.append({
                    "type": None,
                    "width_mm": w_in * 25.4 if w_in else None,
                    "height_mm": h_in * 25.4 if h_in else None,
                    "area_sqft": round(area_sqft, 2) if area_sqft else None,
                    "area_sqm": round(area_sqm, 2) if area_sqm else None,
                    "page": f"{t['page']}",
                    "source": "callout",
                    "polygon": None,
                })
                if area_sqft:
                    total_sqft += area_sqft

    # Schedule rows
    for s in schedules:
        row = s["row"]
        header = s["header"]
        row_map = {header[i]: (row[i] if i < len(row) else "") for i in range(len(header))}
        w = parse_length(row_map.get("width", "") or row_map.get("width ", "") or "")
        h = parse_length(row_map.get("height", "") or "")
        area_sqft = None
        if w and h:
            area_sqft = (w * h) / 144
            total_sqft += area_sqft
        panels.append({
            "type": row_map.get("glass type") or row_map.get("type") or None,
            "width_mm": w * 25.4 if w else None,
            "height_mm": h * 25.4 if h else None,
            "area_sqft": round(area_sqft, 2) if area_sqft else None,
            "area_sqm": round(inches_to_sqm(area_sqft * 144) / 144, 2) if area_sqft else None,
            "page": f"{s['page']}",
            "source": "schedule",
            "polygon": None,
        })

    return {
        "glass_panels": panels,
        "total_area_sqft": round(total_sqft, 2),
        "total_area_sqm": round(inches_to_sqm(total_sqft * 144) / 144, 2),
    }
