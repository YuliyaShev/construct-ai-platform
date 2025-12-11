from typing import List, Dict


def plan_truck_routes(access_points: List[Dict]) -> List[Dict]:
    routes = []
    for ap in access_points:
        routes.append({"entry": ap, "path": [{"x": ap["x"], "y": ap["y"]}, {"x": ap["x"] + 30, "y": ap["y"] + 10}]})
    return routes
