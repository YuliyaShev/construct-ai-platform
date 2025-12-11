from typing import List, Dict


def enrich_code_issues(issues: List[Dict]) -> List[Dict]:
    """
    Placeholder AI layer. In production call an LLM to add explanations and code-specific reasoning.
    """
    enriched = []
    for iss in issues:
        item = iss.copy()
        item.setdefault("llm_note", "Identified via automated rule check. Review against project occupancy and egress strategy.")
        enriched.append(item)
    return enriched
