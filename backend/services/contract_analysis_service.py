import os
import uuid
from typing import Dict, List

from utils.contract_extractor import extract_contract_text
from utils.contract_rules import RISK_KEYWORDS
from utils.contract_ai import ai_enrich_contract
from utils.contract_pdf_report import export_contract_report

CONTRACT_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "contracts")
os.makedirs(CONTRACT_OUTPUT_DIR, exist_ok=True)


def analyze_contract(payload: Dict) -> Dict:
    # Expect a saved file path in payload["file_path"]
    file_path = payload.get("file_path")
    if not file_path or not os.path.exists(file_path):
        raise FileNotFoundError("Contract file not found")

    text, contract_type = extract_contract_text(file_path)
    upper = text.upper()

    risks: List[Dict] = []
    for section, keywords in RISK_KEYWORDS.items():
        for kw in keywords:
            if kw.upper() in upper:
                break
        else:
            # missing section
            risks.append({"section": section.title(), "severity": "medium", "reason": f"Missing explicit {section} language"})

    risk_score = min(100, 60 + 5 * len([r for r in risks if r["severity"] == "high"]))
    summary = {
        "risk_score": risk_score,
        "contract_type": contract_type,
        "high_risk_clauses": [r for r in risks if r["severity"] == "high"],
    }

    findings = {
        "summary": summary,
        "payment_terms": {},
        "insurance": {},
        "change_management": {},
        "termination": {},
        "warranties": {},
        "dispute_resolution": {},
        "missing_clauses": [r for r in risks if r["severity"] == "medium"],
        "ambiguous_language": [],
        "recommendations": [],
    }
    findings = ai_enrich_contract(findings)

    report_id = uuid.uuid4().hex[:8].upper()
    pdf_path = os.path.join(CONTRACT_OUTPUT_DIR, f"contract_{report_id}.pdf")
    export_contract_report(findings["summary"], findings.get("missing_clauses", []), pdf_path)

    findings["report_pdf"] = f"/files/contracts/{os.path.basename(pdf_path)}"
    findings["risk_map"] = risks
    return findings
