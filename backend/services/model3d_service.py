import asyncio
from collections import defaultdict
from typing import Dict

import fitz  # PyMuPDF

from utils.path_extractor import extract_lines_and_paths
from utils.pdf_geometry import extract_text_blocks_with_coords
from utils.view_detector import classify_pages
from utils.mesh_builder import extrude_line_to_mesh, merge_meshes
from utils.export_gltf import export_gltf
from utils.export_obj import export_obj
from utils.unit_conversion import points_to_mm


async def build_3d_model(file_path: str) -> Dict:
    loop = asyncio.get_event_loop()
    doc = await loop.run_in_executor(None, fitz.open, file_path)
    lines = extract_lines_and_paths(doc)
    texts = extract_text_blocks_with_coords(doc)
    page_labels = classify_pages(texts)

    meshes = []
    members = []
    for ln in lines:
        length_mm = points_to_mm(((ln["p1"][0] - ln["p2"][0]) ** 2 + (ln["p1"][1] - ln["p2"][1]) ** 2) ** 0.5)
        mesh = extrude_line_to_mesh((ln["p1"][0], ln["p1"][1]), (ln["p2"][0], ln["p2"][1]), depth=50, width=25)
        meshes.append(mesh)
        members.append({
            "profile": "Frame Member",
            "length_mm": round(length_mm, 1),
            "page": f"{ln['page']}",
            "polygon": [ln["p1"], ln["p2"]],
            "source": "geometry",
            "view": page_labels.get(ln["page"], "unknown"),
        })

    merged = merge_meshes(meshes)
    gltf_str = export_gltf(merged)
    obj_str = export_obj(merged)

    totals = defaultdict(lambda: {"count": 0, "total_length_mm": 0.0})
    for m in members:
        totals[m["profile"]]["count"] += 1
        totals[m["profile"]]["total_length_mm"] += m["length_mm"]

    return {
        "model": merged,
        "members": members,
        "totals": {k: {"count": v["count"], "total_length_mm": round(v["total_length_mm"], 1)} for k, v in totals.items()},
        "export": {
            "gltf": gltf_str,
            "obj": obj_str,
        },
        "stats": {
            "total_members": len(members),
            "total_mesh_faces": len(merged.get("faces", [])),
        }
    }
