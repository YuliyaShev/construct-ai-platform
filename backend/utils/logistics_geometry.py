from typing import Dict, List


def detect_site_boundary() -> Dict:
    """Placeholder boundary detection. Returns simple rectangular boundary."""
    return {"boundary": {"x": 0, "y": 0, "width": 200, "height": 150}, "access_points": [{"x": 0, "y": 60}]}


def compute_laydown_areas(qto: List[Dict]) -> List[Dict]:
    areas = []
    for item in qto:
        if item.get("unit") in ("m2", "m3") or "quantity" in item:
            size = max(50, item.get("quantity", 0) * 0.1)
            areas.append({"label": item["item"], "x": 20 + len(areas) * 40, "y": 20, "width": size * 0.1, "height": 15})
    return areas[:4]
