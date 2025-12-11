import os
import uuid
from typing import Dict

from utils.detail_library import DETAIL_TEMPLATES
from utils.detail_geometry import extract_reference_geometry
from utils.detail_ai import enrich_detail_metadata
from utils.detail_svg import build_detail_svg
from utils.detail_pdf_export import export_detail_pdf

DETAIL_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "details")
os.makedirs(DETAIL_OUTPUT_DIR, exist_ok=True)


def generate_detail(payload: Dict) -> Dict:
    detail_type = payload.get("type", "custom")
    file_id = payload.get("file_id")
    reference = payload.get("reference_location", {})
    parameters = payload.get("parameters", {})

    defaults = DETAIL_TEMPLATES.get(detail_type, {}).get("defaults", {})
    merged_params = {**defaults, **parameters}

    _ = extract_reference_geometry(file_id, reference)
    svg = build_detail_svg(detail_type, merged_params)

    detail_id = f"DT-{uuid.uuid4().hex[:8].upper()}"
    svg_path = os.path.join(DETAIL_OUTPUT_DIR, f"{detail_id}.svg")
    pdf_path = os.path.join(DETAIL_OUTPUT_DIR, f"{detail_id}.pdf")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg)
    export_detail_pdf(svg, pdf_path)

    metadata = enrich_detail_metadata(detail_type, merged_params)
    metadata.update({"parameters": merged_params})

    return {
        "detail_id": detail_id,
        "type": detail_type,
        "svg_url": f"/files/details/{detail_id}.svg",
        "pdf_url": f"/files/details/{detail_id}.pdf",
        "metadata": metadata,
    }
