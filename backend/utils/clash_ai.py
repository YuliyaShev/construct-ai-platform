from typing import List, Dict


def enrich_clashes(clashes: List[Dict]) -> List[Dict]:
    """
    Placeholder AI interpretation layer. In production this should call an LLM to classify severity and root cause.
    """
    enriched = []
    for clash in clashes:
        detail = clash.copy()
        detail.setdefault("llm_summary", "Potential constructibility conflict detected by automated geometry check.")
        if detail.get("severity") == "high":
            detail.setdefault("recommendation", "Escalate to engineering and adjust geometry immediately.")
        elif detail.get("severity") == "medium":
            detail.setdefault("recommendation", "Coordinate with adjacent trade and confirm clearances.")
        else:
            detail.setdefault("recommendation", "Verify in field; minor adjustment may resolve.")
        detail.setdefault("owner", "coordination")
        enriched.append(detail)
    return enriched
