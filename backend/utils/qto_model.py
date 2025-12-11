from typing import List, Dict


def collect_qto() -> List[Dict]:
    """
    Placeholder QTO collection. Replace with integration from BOM/IFC/PDF.
    """
    return [
        {
            "item": "Curtain Wall System",
            "unit": "m2",
            "quantity": 300.0,
            "source": "ifc",
            "geometry_id": "CW-001",
        },
        {
            "item": "Concrete Slab",
            "unit": "m3",
            "quantity": 120.0,
            "source": "reconstruction",
            "geometry_id": "SL-002",
        },
    ]
