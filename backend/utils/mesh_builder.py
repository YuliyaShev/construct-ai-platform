from typing import Dict, List, Tuple
import math


def extrude_line_to_mesh(p1: Tuple[float, float], p2: Tuple[float, float], depth: float, width: float) -> Dict:
    """
    Extrude a line segment into a rectangular prism (simple frame member).
    p1, p2 in world XY plane; depth extrudes along Z; width used as thickness around line.
    """
    # build perpendicular vector for thickness
    vx = p2[0] - p1[0]
    vy = p2[1] - p1[1]
    length = math.hypot(vx, vy)
    if length == 0:
        return {"vertices": [], "faces": []}
    nx, ny = -vy / length * width / 2, vx / length * width / 2

    pts = [
        (p1[0] + nx, p1[1] + ny, 0),
        (p1[0] - nx, p1[1] - ny, 0),
        (p2[0] - nx, p2[1] - ny, 0),
        (p2[0] + nx, p2[1] + ny, 0),
        (p1[0] + nx, p1[1] + ny, depth),
        (p1[0] - nx, p1[1] - ny, depth),
        (p2[0] - nx, p2[1] - ny, depth),
        (p2[0] + nx, p2[1] + ny, depth),
    ]

    faces = [
        (0, 1, 2), (0, 2, 3),  # bottom
        (4, 7, 6), (4, 6, 5),  # top
        (0, 3, 7), (0, 7, 4),  # side
        (1, 5, 6), (1, 6, 2),
        (0, 4, 5), (0, 5, 1),
        (3, 2, 6), (3, 6, 7),
    ]

    return {
        "vertices": pts,
        "faces": faces,
        "edges": [(0, 1), (1, 2), (2, 3), (3, 0)],
    }


def merge_meshes(meshes: List[Dict]) -> Dict:
    verts: List[Tuple[float, float, float]] = []
    faces: List[Tuple[int, int, int]] = []
    edges: List[Tuple[int, int]] = []
    offset = 0
    for m in meshes:
        v = m.get("vertices", [])
        f = m.get("faces", [])
        e = m.get("edges", [])
        verts.extend(v)
        faces.extend([(a + offset, b + offset, c + offset) for (a, b, c) in f])
        edges.extend([(a + offset, b + offset) for (a, b) in e])
        offset += len(v)
    return {"vertices": verts, "faces": faces, "edges": edges}
