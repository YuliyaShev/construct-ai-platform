from typing import List, Dict


def enrich_permit_issues(issues: List[Dict]) -> List[Dict]:
    """
    Placeholder AI reasoning layer. In production, call /analysis/permit-ai with geometry, zoning, and plan data.
    """
    enriched = []
    for iss in issues:
        item = iss.copy()
        item.setdefault(
            "llm_note",
            "Flagged by automated intake rules. Please verify against local amendments and project occupancy.",
        )
        enriched.append(item)
    return enriched
