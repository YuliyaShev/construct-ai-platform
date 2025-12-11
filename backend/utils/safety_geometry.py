from typing import List, Dict


def detect_hazards_from_ifc() -> List[Dict]:
    """
    Placeholder IFC hazard detection.
    """
    return [
        {
            "hazard_type": "fall_edge",
            "location": {"x": 55, "y": 120, "z": 14},
            "severity_score": 85,
            "probability_score": 70,
        },
        {
            "hazard_type": "crane_radius_intrusion",
            "location": {"x": 90, "y": 60, "z": 0},
            "severity_score": 75,
            "probability_score": 60,
        },
    ]
