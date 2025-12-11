from typing import List, Dict


def detect_defects_from_pdf() -> List[Dict]:
    """
    Placeholder PDF drawing analysis.
    """
    return [
        {
            "description": "Door hardware not per spec at level 1 core",
            "trade": "doors",
            "severity": "Medium",
            "priority": "Medium",
            "recommended_fix": "Install specified lever set and closers per A701 schedule.",
            "location": {"floor": 1, "grid": "A1", "coords": {"x": 20, "y": 20}},
            "drawing_reference": "A701 Door Schedule",
        }
    ]
