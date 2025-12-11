from typing import Dict


def plan_crane(crane_type: str) -> Dict:
    radius = 60 if crane_type == "tower" else 40
    return {
        "type": crane_type,
        "location": {"x": 80, "y": 80},
        "max_radius_m": radius,
        "no_fly_zones": [{"x": 0, "y": 0, "width": 30, "height": 30}],
    }
