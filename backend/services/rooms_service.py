import json
import math
import os
import tempfile
from typing import Dict, List

import cv2
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from shapely.geometry import Polygon


def _polygon_area_perimeter(points: List[List[float]], dpi: int) -> Dict[str, float]:
    if len(points) < 3:
        return {"area_sqft": 0.0, "area_sqm": 0.0, "perimeter_ft": 0.0}
    poly = Polygon(points)
    area_px = poly.area
    perimeter_px = poly.length
    # convert using dpi -> inches
    area_sq_in = area_px / (dpi * dpi)
    area_sq_ft = area_sq_in / 144.0
    area_sq_m = area_sq_ft * 0.092903
    perimeter_in = perimeter_px / dpi
    perimeter_ft = perimeter_in / 12.0
    return {
        "area_sqft": round(area_sq_ft, 2),
        "area_sqm": round(area_sq_m, 2),
        "perimeter_ft": round(perimeter_ft, 2),
    }


def _label_inside_polygon(mask: np.ndarray, polygon: List[List[float]]) -> str:
    # create small mask to crop text
    if len(polygon) < 3:
        return ""
    pts = np.array(polygon, dtype=np.int32)
    x, y, w, h = cv2.boundingRect(pts)
    crop = mask[y : y + h, x : x + w]
    if crop.size == 0:
        return ""
    text = pytesseract.image_to_string(crop)
    return text.strip()


def _infer_room_name(text: str) -> str:
    t = text.lower()
    common = {
        "bed": "Bedroom",
        "bedroom": "Bedroom",
        "bath": "Bathroom",
        "toilet": "Bathroom",
        "wc": "Bathroom",
        "kit": "Kitchen",
        "kitchen": "Kitchen",
        "living": "Living Room",
        "dining": "Dining",
        "hall": "Hall",
        "office": "Office",
    }
    for key, val in common.items():
        if key in t:
            return val
    return text.strip() or "Room"


def detect_rooms_from_pdf(pdf_path: str, dpi: int = 200) -> Dict:
    with tempfile.TemporaryDirectory() as tmpdir:
        images = convert_from_path(pdf_path, dpi=dpi, output_folder=tmpdir, fmt="png")
        if not images:
            return {"rooms": []}
        img_path = os.path.join(tmpdir, "page.png")
        images[0].save(img_path, "PNG")
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        _, binary = cv2.threshold(img, 200, 255, cv2.THRESH_BINARY_INV)

        # detect lines/contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        rooms = []
        color_mask = cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR)

        for idx, cnt in enumerate(contours):
            epsilon = 0.01 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            pts = approx.reshape(-1, 2).tolist()
            if len(pts) < 4:
                continue
            props = _polygon_area_perimeter(pts, dpi)
            gap_detected = not cv2.isContourConvex(approx) or cv2.arcLength(cnt, True) == 0
            label_text = _label_inside_polygon(img, pts)
            name = _infer_room_name(label_text)
            rooms.append(
                {
                    "id": f"ROOM-{idx+1:03d}",
                    "name": name,
                    "raw_label": label_text,
                    "vertices": pts,
                    "area_sqft": props["area_sqft"],
                    "area_sqm": props["area_sqm"],
                    "perimeter_ft": props["perimeter_ft"],
                    "gap_detected": bool(gap_detected),
                    "issues": ["Possible missing wall" if gap_detected else ""],
                }
            )

        return {"rooms": rooms}
