from typing import Dict


def build_structural_graph() -> Dict:
    """
    Placeholder structural graph builder. In production, ingest IFC + reconstruction.
    """
    elements = [
        {"id": "C1L1", "type": "column", "location": {"x": 0, "y": 0, "level": 1}, "area": 0.09, "material": "concrete"},
        {"id": "C2L1", "type": "column", "location": {"x": 6, "y": 0, "level": 1}, "area": 0.09, "material": "concrete"},
        {"id": "B1L1", "type": "beam", "location": {"x": 3, "y": 0, "level": 1}, "area": 0.045, "material": "steel"},
        {"id": "SLAB1", "type": "slab", "location": {"x": 0, "y": 0, "level": 1}, "thickness": 0.2, "material": "concrete"},
        {"id": "SW1", "type": "shear_wall", "location": {"x": 0, "y": 6, "level": 1}, "thickness": 0.25, "material": "concrete"},
    ]
    return {"elements": elements}
