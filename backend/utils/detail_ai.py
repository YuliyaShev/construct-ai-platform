from typing import Dict


def enrich_detail_metadata(detail_type: str, parameters: Dict) -> Dict:
    """
    Placeholder for LLM reasoning. In production call /analysis/detail-ai.
    """
    notes = [
        f"Detail type: {detail_type}",
        "Verify flashing overlaps meet minimum 50 mm.",
        "Confirm sealant continuity at transitions.",
    ]
    return {"notes": notes}
