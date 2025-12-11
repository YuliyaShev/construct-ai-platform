from typing import Dict, List, Tuple

from utils.spatial_tree import aabb, overlaps


def compute_penetration_depth(box1: Tuple[float, float, float, float, float, float],
                              box2: Tuple[float, float, float, float, float, float]) -> float:
    dx = min(box1[3], box2[3]) - max(box1[0], box2[0])
    dy = min(box1[4], box2[4]) - max(box1[1], box2[1])
    dz = min(box1[5], box2[5]) - max(box1[2], box2[2])
    return max(0.0, min(dx, dy, dz))


def compute_center(box1: Tuple[float, float, float, float, float, float],
                   box2: Tuple[float, float, float, float, float, float]) -> Tuple[float, float, float]:
    cx = (max(box1[0], box2[0]) + min(box1[3], box2[3])) / 2
    cy = (max(box1[1], box2[1]) + min(box1[4], box2[4])) / 2
    cz = (max(box1[2], box2[2]) + min(box1[5], box2[5])) / 2
    return (cx, cy, cz)


def detect_clashes(meshes: List[Dict], metadata: List[Dict], clearance: float = 0.0) -> List[Dict]:
    """
    Lightweight AABB-based clash detection. Designed to be fast and tolerant of sparse geometry.
    """
    boxes = [aabb(m) for m in meshes]
    clashes: List[Dict] = []
    for i in range(len(meshes)):
        for j in range(i + 1, len(meshes)):
            if overlaps(boxes[i], boxes[j], clearance):
                penetration = compute_penetration_depth(boxes[i], boxes[j])
                center = compute_center(boxes[i], boxes[j])
                severity = "high" if penetration > 10 else "medium" if penetration > 3 else "low"
                clashes.append({
                    "id": f"CLASH-{i:03d}-{j:03d}",
                    "type": "GeometryOverlap",
                    "severity": severity,
                    "location": {"x": round(center[0], 2), "y": round(center[1], 2), "z": round(center[2], 2)},
                    "penetration_mm": round(penetration, 2),
                    "elements": [
                        metadata[i].get("name") or f"member_{i}",
                        metadata[j].get("name") or f"member_{j}"
                    ],
                    "source": "geometry",
                    "description": f"Overlap detected between {metadata[i].get('name', f'member_{i}')}"
                                   f" and {metadata[j].get('name', f'member_{j}')}.",
                    "suggestion": "Review alignment or adjust clearance.",
                })
    return clashes
