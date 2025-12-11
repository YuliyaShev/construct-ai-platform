import os
from typing import Dict, List

from utils.safety_geometry import detect_hazards_from_ifc
from utils.safety_image_detector import detect_hazards_from_images
from utils.safety_ai import compute_risk_scores, enrich_hazards
from utils.safety_compliance import match_osha_csa
from utils.safety_pdf_report import export_safety_pdf

SAFETY_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "safety")
os.makedirs(SAFETY_DIR, exist_ok=True)


def run_safety_detection(payload: Dict) -> Dict:
    region = payload.get("region", "USA")
    hazard_types = payload.get("hazard_types", [])
    images = payload.get("images", [])
    threshold = float(payload.get("confidence_threshold", 0.65))

    hazards: List[Dict] = []
    hazards.extend(detect_hazards_from_ifc())
    hazards.extend(detect_hazards_from_images(images, hazard_types))

    hazards = compute_risk_scores(hazards)
    hazards = [h for h in hazards if h.get("risk_score", 0) / 100 >= threshold]

    for h in hazards:
        ref = match_osha_csa(h["hazard_type"], region)
        if region == "USA":
            h["osha_reference"] = ref
        else:
            h["csa_reference"] = ref

    hazards = enrich_hazards(hazards)

    summary = {
        "total": len(hazards),
        "critical": len([h for h in hazards if h["risk_rating"] == "Critical"]),
        "high": len([h for h in hazards if h["risk_rating"] == "High"]),
        "medium": len([h for h in hazards if h["risk_rating"] == "Medium"]),
        "low": len([h for h in hazards if h["risk_rating"] == "Low"]),
        "osha_refs": list({h.get("osha_reference") for h in hazards if h.get("osha_reference")}),
        "csa_refs": list({h.get("csa_reference") for h in hazards if h.get("csa_reference")}),
    }

    pdf_path = os.path.join(SAFETY_DIR, "safety_report.pdf")
    export_safety_pdf(summary, hazards, pdf_path)

    return {
        "hazards": hazards,
        "summary": summary,
        "pdf_report": "/files/safety/safety_report.pdf",
        "markups_dir": "/files/safety/markups/",
    }
