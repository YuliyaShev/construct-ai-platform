import os
import datetime
from typing import Dict, List

from utils.schedule_rules import DEFAULT_CREWS, SEQUENCE_ORDER
from utils.cpm import cpm
from utils.schedule_ai import enrich_schedule
from utils.schedule_export import export_gantt_pdf

SCHEDULE_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "schedule")
os.makedirs(SCHEDULE_OUTPUT_DIR, exist_ok=True)


def _duration_from_qty(name: str, qty: float) -> float:
    key = "excavation" if "Excavation" in name else "concrete" if "Slab" in name or "Foundation" in name else \
        "steel" if "Steel" in name else "cladding" if "Curtain" in name else "drywall" if "Drywall" in name else "concrete"
    crew = DEFAULT_CREWS.get(key, {"crew_size": 6, "productivity": 100})
    crew_size = crew["crew_size"]
    prod = crew["productivity"]
    if prod == 0:
        return 1.0
    return max(1.0, round(qty / (crew_size * prod), 1))


def generate_schedule(payload: Dict) -> Dict:
    start_date = datetime.date.fromisoformat(payload.get("start_date", datetime.date.today().isoformat()))
    parallelism = payload.get("parallelism", "medium")

    # Stub QTO-driven activities
    qto_map = [
        {"name": "Excavation", "qty": 1200, "unit": "m3"},
        {"name": "Foundation", "qty": 300, "unit": "m3"},
        {"name": "Level 1 Slab", "qty": 280, "unit": "m3"},
        {"name": "Level 2 Slab", "qty": 260, "unit": "m3"},
        {"name": "Roof", "qty": 180, "unit": "m3"},
        {"name": "Curtain Wall", "qty": 1200, "unit": "m2"},
        {"name": "MEP Rough-In", "qty": 1, "unit": "ls"},
        {"name": "Drywall", "qty": 3200, "unit": "m2"},
        {"name": "Finishing", "qty": 1, "unit": "ls"},
    ]

    activities: List[Dict] = []
    for idx, item in enumerate(qto_map, start=1):
        dur = _duration_from_qty(item["name"], item["qty"])
        predecessors = []
        if idx > 1:
            predecessors.append(f"A{idx-1:04d}")
        activities.append(
            {
                "id": f"A{idx:04d}",
                "name": item["name"],
                "quantity": item["qty"],
                "unit": item["unit"],
                "crew": "Std crew",
                "duration_days": dur,
                "predecessors": predecessors,
                "resources": {"labor_hours": round(dur * 8 * 6, 1), "equipment_hours": round(dur * 8 * 2, 1)},
            }
        )

    activities = enrich_schedule(activities)
    activities = cpm(activities, start_date)
    critical_path = [a["name"] for a in activities if a.get("critical")]

    pdf_path = os.path.join(SCHEDULE_OUTPUT_DIR, "gantt.pdf")
    export_gantt_pdf(activities, pdf_path)

    summary = {"total_duration_days": round(max(a["EF"] for a in activities), 1) if activities else 0, "critical_path": critical_path}

    return {
        "summary": summary,
        "activities": activities,
        "gantt_pdf": "/files/schedule/gantt.pdf",
        "gantt_svg": None,
    }
