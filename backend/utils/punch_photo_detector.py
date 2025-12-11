from typing import List, Dict


def detect_defects_from_photo(images: List[str]) -> List[Dict]:
    """
    Placeholder CV detection. In production, run vision models on images.
    """
    defects = []
    for idx, img in enumerate(images):
        defects.append(
            {
                "description": f"Scratch observed in photo {idx+1}",
                "trade": "glazing",
                "severity": "Medium",
                "priority": "High",
                "recommended_fix": "Polish or replace damaged panel",
                "location": {"floor": 2, "grid": "B3", "coords": {"x": 100 + 5 * idx, "y": 80 + 5 * idx}},
                "drawing_reference": "A503 Detail 3",
                "photo_markup": img,
            }
        )
    return defects
