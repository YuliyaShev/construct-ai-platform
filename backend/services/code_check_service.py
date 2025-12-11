import json
import os
import tempfile
from typing import Dict, List

import fitz  # PyMuPDF

from utils.code_rules_ibc import IBC_RULES
from utils.code_rules_nbc import NBC_RULES
from utils.code_rules_nfpa import NFPA_RULES
from utils.code_geometry import identify_noncompliant_doors
from utils.code_ai import enrich_code_issues


def _extract_dummy_doors(doc: fitz.Document) -> List[Dict]:
    # Simplified placeholder: infer doors as small horizontal lines
    doors = []
    for page_index, page in enumerate(doc):
        drawings = page.get_drawings()
        for d in drawings:
            for item in d.get("items", []):
                op = item[0]
                pts = item[1]
                if op == "l" and len(pts) >= 4:
                    x1, y1, x2, y2 = pts[:4]
                    length = abs(x2 - x1)
                    if 25 < length < 44:  # inches in points ~ assume 1pt ~ 1in for placeholder
                        doors.append(
                            {
                                "width_in": length,
                                "location": {"page": page_index + 1, "x": x1, "y": y1},
                            }
                        )
    return doors


def check_code_compliance(pdf_path: str) -> Dict:
    doc = fitz.open(pdf_path)
    doors = _extract_dummy_doors(doc)
    ibc_min_width = next((r["min_width_in"] for r in IBC_RULES if r["id"] == "IBC-EXIT-WIDTH"), 32)

    issues: List[Dict] = []
    issues += identify_noncompliant_doors(doors, ibc_min_width)

    issues = enrich_code_issues(issues)

    summary = {"total": len(issues), "high": len([i for i in issues if i.get("severity") == "high"])}
    return {"issues": issues, "summary": summary, "pdf_report": None}
