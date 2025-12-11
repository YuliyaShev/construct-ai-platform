from typing import List, Dict, Tuple


def aabb(mesh: Dict) -> Tuple[float, float, float, float, float, float]:
    verts = mesh.get("vertices", [])
    if not verts:
        return (0, 0, 0, 0, 0, 0)
    xs = [v[0] for v in verts]
    ys = [v[1] for v in verts]
    zs = [v[2] for v in verts]
    return (min(xs), min(ys), min(zs), max(xs), max(ys), max(zs))


def overlaps(box1, box2, clearance: float = 0.0) -> bool:
    return not (
        box1[3] + clearance < box2[0] or
        box1[0] - clearance > box2[3] or
        box1[4] + clearance < box2[1] or
        box1[1] - clearance > box2[4] or
        box1[5] + clearance < box2[2] or
        box1[2] - clearance > box2[5]
    )
