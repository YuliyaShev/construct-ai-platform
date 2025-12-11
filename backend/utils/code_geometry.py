from typing import Dict, List


def identify_noncompliant_doors(doors: List[Dict], min_width_in: float) -> List[Dict]:
    issues = []
    for idx, d in enumerate(doors):
        width = d.get("width_in", 0)
        if width < min_width_in:
            issues.append(
                {
                    "id": f"CC-DOOR-{idx+1:03d}",
                    "title": "Exit Width Too Narrow",
                    "severity": "high",
                    "code_reference": "IBC 1005.3",
                    "expected": f"{min_width_in} in",
                    "actual": f"{width} in",
                    "location": d.get("location", {}),
                    "description": "Exit door clear width does not meet minimum.",
                    "recommendation": f"Increase door width to {min_width_in} in or reduce occupant load.",
                }
            )
    return issues
