from typing import Dict, List, Tuple


def build_navmesh(geometry: Dict) -> Dict:
    """
    Placeholder navmesh builder. In production, triangulate rooms/corridors and build adjacency graph.
    """
    rooms = geometry.get("rooms", [])
    exits = geometry.get("exits", [])
    nodes = [{"id": f"room-{i}", "center": r.get("center", (0, 0))} for i, r in enumerate(rooms)]
    for i, ex in enumerate(exits):
        nodes.append({"id": f"exit-{i}", "center": ex.get("center", (0, 0)), "exit": True})
    # simplistic fully-connected graph between rooms and exits
    edges: List[Tuple[str, str, float]] = []
    for n in nodes:
        for m in nodes:
            if n is m:
                continue
            edges.append((n["id"], m["id"], 1.0))
    return {"nodes": nodes, "edges": edges, "exits": [n for n in nodes if n.get("exit")]}
