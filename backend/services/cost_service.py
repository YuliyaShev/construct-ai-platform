import os
from typing import Dict, List

from utils.cost_rules import DEFAULT_COST_RULES, UNIT_RATES
from utils.csi_classifier import classify_csi
from utils.cost_ai import refine_cost_items
from utils.qto_model import collect_qto
from utils.regional_cost_factors import get_region_factor
from utils.escalation import apply_escalation
from utils.cost_report_export import export_cost_report

COST_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "cost")
os.makedirs(COST_OUTPUT_DIR, exist_ok=True)


def _cost_item(qto_item: Dict, location: str, labor_type: str, complexity: str, escalation_years: float, contingency: float):
    classification = classify_csi(qto_item["item"])
    rates = UNIT_RATES.get(classification["csi"], {"unit": qto_item["unit"], "material": 20.0, "labor": 15.0, "equipment": 3.0})
    qty = qto_item["quantity"]
    region_factor = get_region_factor(location)

    labor_adj = 1.1 if labor_type == "union" else 1.0
    complexity_adj = {"low": 0.95, "medium": 1.0, "high": 1.15}.get(complexity, 1.0)

    material_cost = qty * rates["material"] * region_factor
    labor_cost = qty * rates["labor"] * region_factor * labor_adj * complexity_adj
    equipment_cost = qty * rates["equipment"] * region_factor

    base = material_cost + labor_cost + equipment_cost
    base = apply_escalation(base, escalation_years)
    overhead = base * DEFAULT_COST_RULES["overhead_pct"]
    markup = base * DEFAULT_COST_RULES["contractor_markup"]
    total = base + overhead + markup
    contingency_cost = total * contingency
    total_with_contingency = total + contingency_cost

    return {
        "csi": classification["csi"],
        "description": classification["description"],
        "quantity": round(qty, 3),
        "unit": rates["unit"],
        "unit_cost": round(total_with_contingency / qty, 2) if qty else 0,
        "total_cost": round(total_with_contingency, 2),
        "breakdown": {
            "material": round(material_cost, 2),
            "labor": round(labor_cost, 2),
            "equipment": round(equipment_cost, 2),
            "overhead": round(overhead, 2),
            "markup": round(markup, 2),
            "contingency": round(contingency_cost, 2),
        },
        "source": qto_item.get("source"),
    }


def run_cost_estimate(payload: Dict) -> Dict:
    location = payload.get("location", "Ontario")
    labor_type = payload.get("labor_type", "union")
    complexity = payload.get("complexity", "medium")
    escalation_years = payload.get("escalation_years", 0)
    contingency = float(payload.get("contingency", 0.1))

    qto = collect_qto()
    cost_items = [_cost_item(q, location, labor_type, complexity, escalation_years, contingency) for q in qto]
    cost_items = refine_cost_items(cost_items)

    summary = {
        "total_cost": round(sum(i["total_cost"] for i in cost_items), 2),
        "material": round(sum(i["breakdown"]["material"] for i in cost_items), 2),
        "labor": round(sum(i["breakdown"]["labor"] for i in cost_items), 2),
        "equipment": round(sum(i["breakdown"]["equipment"] for i in cost_items), 2),
        "overhead": round(sum(i["breakdown"]["overhead"] for i in cost_items), 2),
        "markup": round(sum(i["breakdown"]["markup"] for i in cost_items), 2),
        "contingency": round(sum(i["breakdown"]["contingency"] for i in cost_items), 2),
    }

    pdf_path = os.path.join(COST_OUTPUT_DIR, "cost_report.pdf")
    export_cost_report(summary, pdf_path)

    return {
        "summary": summary,
        "cost_items": cost_items,
        "qto": qto,
        "report_pdf": "/files/cost/cost_report.pdf",
        "excel_report": None,
    }
