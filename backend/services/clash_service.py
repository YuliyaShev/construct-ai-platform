import asyncio
from collections import defaultdict
from typing import Dict

import fitz  # PyMuPDF

from models.file_record import FileRecord
from services.files_service import get_file_path
from utils.path_extractor import extract_lines_and_paths
from utils.mesh_builder import extrude_line_to_mesh, merge_meshes
from utils.clash_geometry import detect_clashes
from utils.clash_ai import enrich_clashes
from utils.unit_conversion import points_to_mm


async def run_clash_detection(file_record: FileRecord) -> Dict:
    loop = asyncio.get_event_loop()
    doc = await loop.run_in_executor(None, fitz.open, get_file_path(file_record))

    lines = extract_lines_and_paths(doc)
    meshes = []
    metadata = []
    for idx, ln in enumerate(lines):
        mesh = extrude_line_to_mesh((ln["p1"][0], ln["p1"][1]), (ln["p2"][0], ln["p2"][1]), depth=50, width=25)
        meshes.append(mesh)
        length_mm = points_to_mm(((ln["p1"][0] - ln["p2"][0]) ** 2 + (ln["p1"][1] - ln["p2"][1]) ** 2) ** 0.5)
        metadata.append({
            "name": f"Member_{idx + 1}",
            "page": ln.get("page"),
            "length_mm": round(length_mm, 2),
        })

    clashes = detect_clashes(meshes, metadata, clearance=1.0)
    clashes = enrich_clashes(clashes)

    summary = defaultdict(int)
    for c in clashes:
        summary[c["severity"]] += 1
    result = {
        "file_id": file_record.id,
        "clashes": clashes,
        "summary": {
            "total": len(clashes),
            "high": summary.get("high", 0),
            "medium": summary.get("medium", 0),
            "low": summary.get("low", 0),
        },
        "model": merge_meshes(meshes),
    }
    return result
