from typing import List, Dict
import random


def evaluate_failure_modes(elements: List[Dict]) -> List[Dict]:
    results = []
    for e in elements:
        demand = e.get("demand", e.get("capacity", 1) * random.uniform(0.6, 1.2))
        dc = demand / max(e.get("capacity", 1), 1e-3)
        if dc > 1.0:
            risk = "high"
            failure = "overstressed"
        elif dc > 0.8:
            risk = "medium"
            failure = "warning"
        else:
            risk = "low"
            failure = "safe"
        e.update(
            {
                "D_C_ratio": round(dc, 2),
                "risk": risk,
                "failure_mode": failure,
                "recommendation": "Increase member size or add redundancy" if risk != "low" else "OK",
            }
        )
        results.append(e)
    return results
