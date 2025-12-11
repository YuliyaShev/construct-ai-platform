import json
import os
import tempfile
from typing import Dict, List

from utils.permit_rules import REQUIRED_SHEETS
from utils.sheet_detector import detect_missing_sheets, detect_missing_notes
from utils.plan_index_extractor import extract_plan_index_text
from utils.permit_ai import enrich_permit_issues
from utils.zoning_rules import ZONING_CHECKS


def validate_permit(pdf_path: str) -> Dict:
    text = extract_plan_index_text(pdf_path)

    missing_sheets = detect_missing_sheets(text)
    missing_notes = detect_missing_notes(text)

    issues: List[Dict] = []
    for idx, s in enumerate(missing_sheets):
        issues.append(
            {
                "id": f"PERMIT-SHEET-{idx+1:03d}",
                "title": f"Missing sheet: {s}",
                "severity": "high",
                "code_reference": "Permit Intake",
                "description": "Required sheet not found.",
                "recommendation": f"Include sheet {s} in the set.",
                "category": "Sheets",
            }
        )
    for idx, n in enumerate(missing_notes):
        issues.append(
            {
                "id": f"PERMIT-NOTE-{idx+1:03d}",
                "title": f"Missing required note: {n}",
                "severity": "medium",
                "code_reference": "Permit Intake",
                "description": "Mandatory note missing.",
                "recommendation": f"Add note: {n}.",
                "category": "Notes",
            }
        )

    zoning_issues = []
    # Placeholder zoning check
    for z in ZONING_CHECKS:
        # no actual geometry; stub as compliant
        pass

    issues = enrich_permit_issues(issues)

    total = len(issues)
    high = len([i for i in issues if i.get("severity") == "high" or i.get("severity") == "critical"])
    medium = len([i for i in issues if i.get("severity") == "medium"])
    low = len([i for i in issues if i.get("severity") == "low"])
    permit_score = max(0, 100 - (high * 10 + medium * 5 + low * 2))

    summary = {"total": total, "high": high, "medium": medium, "low": low, "permit_score": permit_score}

    return {
        "summary": summary,
        "issues": issues,
        "missing_sheets": missing_sheets,
        "zoning": zoning_issues,
        "pdf_report": None,
    }
