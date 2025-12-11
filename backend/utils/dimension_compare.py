from typing import List, Dict


def compare_dimension_groups(group_a: List[Dict], group_b: List[Dict], tolerance_mm: float = 3.0) -> List[Dict]:
    """
    Compare two dimension groups and return mismatch events.
    Dimensions are expected to have fields: value_mm, source, page, x, y, label.
    """
    issues = []
    if not group_a or not group_b:
        return issues

    for a in group_a:
        for b in group_b:
            if a.get("label") and b.get("label") and a["label"] != b["label"]:
                continue
            diff = abs(a["value_mm"] - b["value_mm"])
            if diff > tolerance_mm:
                issues.append(
                    {
                        "id": f"DIM-{len(issues)+1:03d}",
                        "type": "MismatchBetweenViews",
                        "expected": f'{round(a["value_mm"],1)} mm ({a.get("source")})',
                        "actual": f'{round(b["value_mm"],1)} mm ({b.get("source")})',
                        "difference_mm": round(diff, 2),
                        "severity": "high" if diff > 10 else "medium",
                        "location": {
                            "page": a.get("page") or b.get("page"),
                            "x": a.get("x") or b.get("x"),
                            "y": a.get("y") or b.get("y"),
                        },
                        "description": "Dimension differs between views.",
                        "suggestion": "Align view dimensions or confirm correct value.",
                    }
                )
    return issues


def find_missing_dimensions(groups: Dict[str, List[Dict]], required_keys: List[str]) -> List[Dict]:
    missing = []
    for key in required_keys:
        if not groups.get(key):
            missing.append(
                {
                    "id": f"DIM-MISS-{len(missing)+1:03d}",
                    "type": "MissingDimension",
                    "severity": "medium",
                    "location": {},
                    "description": f"Missing critical dimension: {key.replace('_', ' ')}",
                    "suggestion": "Add overall and critical opening dimensions.",
                }
            )
    return missing
