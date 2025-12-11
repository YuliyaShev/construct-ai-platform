from typing import Dict


def extract_reference_geometry(file_id: str | int, reference_location: Dict) -> Dict:
    """
    Placeholder geometry extractor. Would read PDF/IFC and return contextual dimensions.
    """
    return {
        "reference": reference_location,
        "materials": [],
        "dimensions": [],
    }
