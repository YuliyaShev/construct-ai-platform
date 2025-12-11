from typing import Dict


def classify_csi(item_name: str) -> Dict:
    name = item_name.lower()
    if "curtain" in name or "glaz" in name:
        return {"csi": "08 44 13", "description": "Glazed Aluminum Curtain Walls"}
    if "rail" in name:
        return {"csi": "05 52 00", "description": "Metal Railings"}
    if "concrete" in name or "slab" in name or "footing" in name:
        return {"csi": "03 30 00", "description": "Cast-in-Place Concrete"}
    if "gypsum" in name or "gwb" in name or "drywall" in name:
        return {"csi": "09 29 00", "description": "Gypsum Board"}
    return {"csi": "01 00 00", "description": "General Requirements"}
