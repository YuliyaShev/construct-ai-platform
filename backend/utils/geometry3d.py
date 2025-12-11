from typing import List, Dict


def normalize_vertices(vertices: List[List[float]]) -> List[List[float]]:
    """Translate vertices so min is at origin."""
    if not vertices:
        return vertices
    xs = [v[0] for v in vertices]
    ys = [v[1] for v in vertices]
    zs = [v[2] for v in vertices]
    minx, miny, minz = min(xs), min(ys), min(zs)
    return [[v[0] - minx, v[1] - miny, v[2] - minz] for v in vertices]
