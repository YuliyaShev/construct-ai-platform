from typing import List, Dict


def detect_hazards_from_images(images: List[str], hazard_types: List[str]) -> List[Dict]:
    """
    Placeholder image-based detection. In production, run CV/LLM vision.
    """
    hazards = []
    for idx, img in enumerate(images):
        hazards.append(
            {
                "hazard_type": "PPE" if "ppe" in hazard_types else "falls",
                "location": {"x": 10 * idx, "y": 15 * idx, "z": 0},
                "severity_score": 65,
                "probability_score": 55,
                "image": img,
            }
        )
    return hazards
