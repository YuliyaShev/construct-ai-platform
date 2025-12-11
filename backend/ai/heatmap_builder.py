from typing import Dict, List

SEVERITY_COLORS = {
    "high": "#ff4d4f",
    "medium": "#faad14",
    "low": "#52c41a",
}


def normalize_point(x: float, y: float, page_width: float, page_height: float) -> Dict:
    if not page_width or not page_height:
        return {"x": 0, "y": 0}
    return {
        "x": x / page_width,
        "y": y / page_height,
    }


def build_heatmap(issues: List[Dict], page_width: float, page_height: float) -> List[Dict]:
    """
    Convert raw issue coordinates into normalized heatmap points.
    Expects issues like {"x": int, "y": int, "severity": "high"} in PDF space (0,0 bottom-left).
    Returns points with normalized coordinates and severity color mapping.
    """
    heatmap = []
    for issue in issues or []:
        x = issue.get("x")
        y = issue.get("y")
        severity = (issue.get("severity") or "low").lower()
        if x is None or y is None:
            continue
        norm = normalize_point(float(x), float(y), float(page_width), float(page_height))
        heatmap.append({
            "x": norm["x"],
            "y": norm["y"],
            "severity": severity,
            "color": SEVERITY_COLORS.get(severity, SEVERITY_COLORS["low"]),
        })
    return heatmap
