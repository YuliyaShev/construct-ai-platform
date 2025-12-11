from typing import List, Dict
import random


def progressive_collapse_sim(elements: List[Dict]) -> Dict:
    if not elements:
        return {"removed": None, "failed": []}
    removed = random.choice(elements)["id"]
    failed = []
    for e in elements:
        if e["id"] == removed:
            continue
        dc_new = e.get("D_C_ratio", 0.7) + 0.2
        if dc_new > 1.0:
            failed.append(e["id"])
    return {"removed": removed, "failed": failed}
