from typing import List, Dict
import datetime


def cpm(activities: List[Dict], project_start: datetime.date) -> List[Dict]:
    # Build map
    acts = {a["id"]: a for a in activities}
    # Forward pass
    for a in activities:
        preds = a.get("predecessors", [])
        if preds:
            es = max(acts[p]["EF"] for p in preds)
        else:
            es = 0
        a["ES"] = es
        a["EF"] = es + a["duration_days"]
    # Backward pass
    proj_duration = max(a["EF"] for a in activities) if activities else 0
    for a in reversed(activities):
        succ = [s for s in activities if a["id"] in s.get("predecessors", [])]
        if succ:
            lf = min(s["LS"] for s in succ)
        else:
            lf = proj_duration
        a["LF"] = lf
        a["LS"] = lf - a["duration_days"]
        a["TF"] = a["LS"] - a["ES"]
        a["critical"] = abs(a["TF"]) < 1e-6
        # dates
        a["start"] = (project_start + datetime.timedelta(days=a["ES"])).isoformat()
        a["finish"] = (project_start + datetime.timedelta(days=a["EF"])).isoformat()
    return activities
