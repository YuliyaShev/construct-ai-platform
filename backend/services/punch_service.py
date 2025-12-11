import os
from typing import Dict, List

from utils.punch_photo_detector import detect_defects_from_photo
from utils.punch_geometry import detect_defects_from_bim
from utils.punch_pdf import detect_defects_from_pdf
from utils.punch_ai import classify_priority, enrich_punch_items
from utils.punch_pdf_report import export_punch_report

PUNCH_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "punch")
os.makedirs(PUNCH_DIR, exist_ok=True)


def generate_punch_list(payload: Dict) -> Dict:
    photos = payload.get("photos", [])
    items: List[Dict] = []
    items.extend(detect_defects_from_photo(photos))
    items.extend(detect_defects_from_bim())
    items.extend(detect_defects_from_pdf())

    items = classify_priority(items)
    items = enrich_punch_items(items)

    summary = {
        "total": len(items),
        "critical": len([i for i in items if i.get("severity") == "Critical"]),
        "high": len([i for i in items if i.get("severity") == "High"]),
        "medium": len([i for i in items if i.get("severity") == "Medium"]),
        "low": len([i for i in items if i.get("severity") == "Low"]),
        "trades": list({i.get("trade") for i in items if i.get("trade")}),
    }

    pdf_path = os.path.join(PUNCH_DIR, "punch_report.pdf")
    export_punch_report(summary, items, pdf_path)

    return {
        "punch_list": items,
        "summary": summary,
        "pdf_report": "/files/punch/punch_report.pdf",
    }
