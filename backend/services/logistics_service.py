import os
from typing import Dict

from utils.logistics_geometry import detect_site_boundary, compute_laydown_areas
from utils.logistics_crane import plan_crane
from utils.logistics_routes import plan_truck_routes
from utils.logistics_ai import enrich_logistics
from utils.logistics_svg_export import export_logistics_svg
from utils.logistics_pdf_report import export_logistics_pdf
from utils.qto_model import collect_qto

LOGISTICS_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "logistics")
os.makedirs(LOGISTICS_DIR, exist_ok=True)


def generate_logistics(payload: Dict) -> Dict:
    crane_type = payload.get("crane_type", "tower")
    boundary_info = detect_site_boundary()
    qto = collect_qto()
    laydown = compute_laydown_areas(qto)
    crane = plan_crane(crane_type)
    routes = plan_truck_routes(boundary_info.get("access_points", []))

    logistics = {
        "boundary": boundary_info.get("boundary"),
        "crane": crane,
        "laydown_areas": laydown,
        "truck_routes": routes,
        "hoist": {"required": payload.get("hoist_required", True), "location": {"x": 40, "y": 100}},
        "safety_zones": crane.get("no_fly_zones", []),
        "timeline": [{"month": "M1", "crane_move": False}, {"month": "M4", "crane_move": True}],
    }

    logistics["summary"] = {
        "crane_type": crane_type,
        "crane_location": crane.get("location"),
        "max_radius_m": crane.get("max_radius_m"),
        "logistics_score": 85,
        "recommendations": ["Coordinate deliveries within " + payload.get("truck_delivery_hours", "07:00-15:00")],
    }
    logistics["summary"] = enrich_logistics(logistics["summary"])

    svg_path = os.path.join(LOGISTICS_DIR, "site_logistics.svg")
    pdf_path = os.path.join(LOGISTICS_DIR, "site_logistics.pdf")
    export_logistics_svg(logistics, svg_path)
    export_logistics_pdf(logistics["summary"], pdf_path)

    logistics["svg_map"] = "/files/logistics/site_logistics.svg"
    logistics["pdf_report"] = "/files/logistics/site_logistics.pdf"

    return logistics
