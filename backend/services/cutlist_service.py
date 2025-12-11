import asyncio
import math
from collections import defaultdict
from typing import Dict, List

import fitz  # PyMuPDF
from shapely.geometry import LineString

from utils.path_extractor import extract_lines_and_paths
from utils.angle_detector import angle_between, classify_angle
from utils.unit_conversion import points_to_mm
from utils.pdf_geometry import extract_text_blocks_with_coords

PROFILE_PATTERNS = ["2X2", "1.5X1.5", "HSS", "CHANNEL", "RAIL", "POST"]


def _vector(p1, p2):
    return [p2[0] - p1[0], p2[1] - p1[1]]


async def extract_cutlist(file_path: str) -> Dict:
    loop = asyncio.get_event_loop()
    doc = await loop.run_in_executor(None, fitz.open, file_path)
    lines = extract_lines_and_paths(doc)
    texts = extract_text_blocks_with_coords(doc)

    members = []
    for ln in lines:
        ls = LineString([ln["p1"], ln["p2"]])
        length_pts = ls.length
        length_mm = points_to_mm(length_pts)

        # angles: check continuation (simple: angle vs horizontal)
        v = _vector(ln["p1"], ln["p2"])
        base_angle = classify_angle(abs(math.degrees(math.atan2(v[1], v[0]))))
        angle_start = classify_angle(180 - base_angle)
        angle_end = classify_angle(base_angle)

        # profile detection nearby
        profile = "Frame Member"
        for t in [t for t in texts if t["page"] == ln["page"]]:
            if any(pat in t["text"].upper() for pat in PROFILE_PATTERNS):
                profile = t["text"].strip()
                break

        members.append({
            "profile": profile,
            "length_mm": round(length_mm, 1),
            "angle_start_deg": angle_start,
            "angle_end_deg": angle_end,
            "page": f"{ln['page']}",
            "polygon": [ln["p1"], ln["p2"]],
            "source": "geometry",
        })

    totals = defaultdict(lambda: {"count": 0, "total_length_mm": 0.0})
    for m in members:
        t = totals[m["profile"]]
        t["count"] += 1
        t["total_length_mm"] += m["length_mm"]

    totals_by_profile = {k: {"count": v["count"], "total_length_mm": round(v["total_length_mm"], 1)} for k, v in totals.items()}

    return {
        "members": members,
        "totals_by_profile": totals_by_profile,
        "stats": {
            "total_members": len(members),
            "total_length_m": round(sum(m["length_mm"] for m in members) / 1000, 2),
        },
    }
