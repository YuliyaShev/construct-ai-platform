from typing import Dict, List


def normalize_coords(bbox: List[float], page_bbox: List[float]) -> List[float]:
    if not bbox or not page_bbox:
        return bbox or []
    x0, y0, x1, y1 = bbox
    px0, py0, px1, py1 = page_bbox
    w = px1 - px0
    h = py1 - py0
    return [
        (x0 - px0) / w,
        (y0 - py0) / h,
        (x1 - px0) / w,
        (y1 - py0) / h,
    ]


def map_issues_to_heatmap(issues: List[Dict], page_bbox: List[float]) -> List[Dict]:
    heatmap = []
    for issue in issues or []:
        bbox = issue.get("bbox")
        if not bbox:
            continue
        norm = normalize_coords(bbox, page_bbox)
        x = (norm[0] + norm[2]) / 2 if len(norm) == 4 else None
        y = (norm[1] + norm[3]) / 2 if len(norm) == 4 else None
        if x is not None and y is not None:
            heatmap.append({"x": x, "y": y, "severity": issue.get("severity", "info")})
    return heatmap
