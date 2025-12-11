from typing import List, Dict


def detect_defects_from_bim() -> List[Dict]:
    """
    Placeholder BIM/geometry-based defect detection.
    """
    return [
        {
            "description": "Missing firestopping at MEP penetration",
            "trade": "firestopping",
            "severity": "High",
            "priority": "High",
            "recommended_fix": "Install UL-listed firestop assembly per detail",
            "location": {"floor": 3, "grid": "C2", "coords": {"x": 50, "y": 40}},
            "drawing_reference": "FS-101",
        }
    ]
