from typing import List, Dict


def classify_priority(items: List[Dict]) -> List[Dict]:
    for i in items:
        severity = i.get("severity", "Medium")
        if severity == "Critical":
            i["priority"] = "High"
        elif severity == "High":
            i["priority"] = "High"
        elif severity == "Medium":
            i["priority"] = "Medium"
        else:
            i["priority"] = "Low"
        if "deadline_days" not in i:
            i["deadline_days"] = 3 if i["priority"] == "High" else 7
    return items


def enrich_punch_items(items: List[Dict]) -> List[Dict]:
    """
    Placeholder AI enrichment. In production, call /analysis/punch.
    """
    return items
