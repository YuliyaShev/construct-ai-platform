from typing import Dict, List


def compute_capacities(elements: List[Dict]) -> List[Dict]:
    enriched = []
    for e in elements:
        cap = 0.0
        if e["type"] == "column":
            cap = 800.0  # kN axial placeholder
        elif e["type"] == "beam":
            cap = 150.0  # kNm placeholder
        elif e["type"] == "slab":
            cap = 25.0  # kN/m2
        elif e["type"] == "shear_wall":
            cap = 1200.0  # kN lateral
        e["capacity"] = cap
        enriched.append(e)
    return enriched
