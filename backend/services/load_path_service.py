import json
import os
import tempfile
from typing import Dict, List

import cv2
import fitz  # PyMuPDF
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from shapely.geometry import LineString, Point

from models.analysis_result import AnalysisResult
from utils.unit_conversion import points_to_mm


def _detect_lines(gray: np.ndarray) -> List[LineString]:
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=60, minLineLength=40, maxLineGap=10)
    result = []
    if lines is not None:
        for l in lines[:, 0]:
            x1, y1, x2, y2 = l
            result.append(LineString([(x1, y1), (x2, y2)]))
    return result


def _classify_elements(lines: List[LineString]) -> Dict[str, List[Dict]]:
    beams = []
    columns = []
    for idx, ln in enumerate(lines):
        length = ln.length
        if length > 120:  # long lines → beams
            beams.append({"id": f"B{idx+1}", "geom": ln})
        else:
            columns.append({"id": f"C{idx+1}", "geom": ln})
    return {"beams": beams, "columns": columns}


def _detect_tags(image: np.ndarray) -> List[Dict]:
    text = pytesseract.image_to_string(image)
    tags = []
    for token in text.split():
        token = token.strip().upper()
        if token.startswith("B"):
            tags.append({"id": token, "type": "beam"})
        if token.startswith("C"):
            tags.append({"id": token, "type": "column"})
    return tags


def _build_load_graph(beams: List[Dict], columns: List[Dict]) -> Dict:
    nodes = []
    edges = []
    issues = []

    for b in beams:
        nodes.append(
            {
                "id": b["id"],
                "type": "beam",
                "tributary_area_sqft": 120.0,
                "load_estimate_kN": 200.0,
                "load_path": [f"{b['id']} -> column"],
                "issues": [],
            }
        )
    for c in columns:
        nodes.append(
            {
                "id": c["id"],
                "type": "column",
                "tributary_area_sqft": 250.0,
                "load_estimate_kN": 400.0,
                "load_path": [f"{c['id']} -> footing"],
                "issues": [],
            }
        )

    for b in beams:
        # connect beam ends to nearest column
        start = Point(b["geom"].coords[0])
        end = Point(b["geom"].coords[-1])
        for c in columns:
            col_pt = c["geom"].centroid
            if start.distance(col_pt) < 30 or end.distance(col_pt) < 30:
                edges.append({"from": b["id"], "to": c["id"]})
        if not any(e for e in edges if e["from"] == b["id"]):
            issues.append(
                {
                    "severity": "high",
                    "message": f"Beam {b['id']} appears unsupported at one or both ends.",
                }
            )

    return {"nodes": nodes, "edges": edges, "issues": issues}


def analyze_load_path(pdf_path: str) -> Dict:
    with tempfile.TemporaryDirectory() as tmpdir:
        images = convert_from_path(pdf_path, dpi=200, output_folder=tmpdir, fmt="png")
        if not images:
            return {"nodes": [], "edges": [], "issues": []}
        img_path = os.path.join(tmpdir, "page.png")
        images[0].save(img_path, "PNG")
        img = cv2.imread(img_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        lines = _detect_lines(gray)
        elements = _classify_elements(lines)
        tags = _detect_tags(gray)
        graph = _build_load_graph(elements["beams"], elements["columns"])
        graph["tags"] = tags
        return graph


def save_load_path_result(db, file_id: int, result: Dict) -> int:
    entry = AnalysisResult(file_id=file_id, page=None, result_json=json.dumps(result))
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry.id
