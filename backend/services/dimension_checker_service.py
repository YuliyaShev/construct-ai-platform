import asyncio
from collections import defaultdict
from typing import Dict, List

import fitz  # PyMuPDF

from models.file_record import FileRecord
from services.files_service import get_file_path
from utils.pdf_dimension_extract import extract_dimensions
from utils.dimension_compare import compare_dimension_groups, find_missing_dimensions
from utils.dim_ai import enrich_dimension_errors
from utils.unit_conversion import inches_to_mm


def _group_dimensions(dims: List[Dict]) -> Dict[str, List[Dict]]:
    groups: Dict[str, List[Dict]] = defaultdict(list)
    for d in dims:
        orientation = d.get("orientation")
        if orientation == "horizontal":
            groups["plan_horizontal"].append(d)
        elif orientation == "vertical":
            groups["elevation_height"].append(d)
        else:
            groups["misc"].append(d)
    return groups


async def run_dimension_check(file_record: FileRecord) -> Dict:
    loop = asyncio.get_event_loop()
    doc = await loop.run_in_executor(None, fitz.open, get_file_path(file_record))

    dims = extract_dimensions(doc)
    groups = _group_dimensions(dims)

    issues = []
    issues += compare_dimension_groups(groups.get("plan_horizontal", []), groups.get("elevation_height", []), tolerance_mm=3.0)

    missing = find_missing_dimensions(groups, ["plan_horizontal", "elevation_height"])
    issues += missing

    issues = enrich_dimension_errors(issues)

    summary = defaultdict(int)
    for i in issues:
        summary[i.get("severity", "medium")] += 1
    result = {
        "file_id": file_record.id,
        "errors": issues,
        "summary": {
            "total": len(issues),
            "critical": summary.get("critical", 0),
            "high": summary.get("high", 0),
            "medium": summary.get("medium", 0),
            "low": summary.get("low", 0),
            "missing_dims": len([e for e in issues if e.get("type") == "MissingDimension"]),
        },
        "annotated_pdf": None,
    }
    return result
