from typing import List, Dict


def interpret_egress_results(summary: Dict) -> List[Dict]:
    """
    Placeholder AI interpretation. In production, call /analysis/egress-ai.
    """
    issues = []
    if summary.get("total_time", 0) > 300:
        issues.append(
            {
                "issue": "Total evacuation time exceeds target",
                "code": "IBC 1008",
                "recommendation": "Increase exit width or reduce occupant load.",
            }
        )
    if summary.get("exit_capacity_insufficient"):
        issues.append(
            {
                "issue": "Exit capacity insufficient",
                "code": "IBC 1005.3",
                "recommendation": "Add exits or widen existing doors.",
            }
        )
    return issues
