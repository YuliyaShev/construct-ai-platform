from typing import List, Dict


def enrich_structural_risk(summary: Dict, elements: List[Dict]) -> Dict:
    """
    Placeholder AI reasoning. In production call /analysis/structural-ai.
    """
    summary = summary.copy()
    summary.setdefault("recommendations", [])
    if summary.get("soft_story_detected"):
        summary["recommendations"].append("Add shear walls or braced frames at soft story.")
    if summary.get("torsional_irregularity"):
        summary["recommendations"].append("Balance stiffness or add lateral elements near CM.")
    return summary
