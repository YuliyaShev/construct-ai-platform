import os
from typing import Dict, List

from utils.structural_graph import build_structural_graph
from utils.structural_capacity import compute_capacities
from utils.structural_failure_modes import evaluate_failure_modes
from utils.structural_load_redistribution import progressive_collapse_sim
from utils.structural_ai import enrich_structural_risk
from utils.structural_pdf_report import export_structural_risk

RISK_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "structural_risk")
os.makedirs(RISK_OUTPUT_DIR, exist_ok=True)


def run_structural_risk_analysis(payload: Dict) -> Dict:
    graph = build_structural_graph()
    elements = compute_capacities(graph["elements"])
    elements = evaluate_failure_modes(elements)

    critical_elements = [e for e in elements if e["risk"] == "high"]
    soft_story = any("soft" in e.get("failure_mode", "") for e in elements)
    torsion = any(e.get("risk") == "high" and e["type"] == "shear_wall" for e in elements)
    collapse = progressive_collapse_sim(elements)

    risk_score = min(100, 50 + 5 * len(critical_elements))
    summary = {
        "risk_score": risk_score,
        "soft_story_detected": soft_story,
        "progressive_collapse_risk": "medium" if collapse["failed"] else "low",
        "torsional_irregularity": "present" if torsion else "none",
    }
    summary = enrich_structural_risk(summary, elements)

    pdf_path = os.path.join(RISK_OUTPUT_DIR, "structural_risk.pdf")
    export_structural_risk(summary, critical_elements, pdf_path)

    return {
        "summary": summary,
        "risk_map": elements,
        "critical_path_of_failure": [e["id"] for e in critical_elements],
        "risk_score": risk_score,
        "progressive_collapse": collapse,
        "report_pdf": "/files/structural_risk/structural_risk.pdf",
    }
