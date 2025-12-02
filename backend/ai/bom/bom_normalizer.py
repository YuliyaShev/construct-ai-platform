from typing import List, Dict

MATERIAL_NORMALIZE = {
    "ALU": "ALUMINUM",
    "ALUM": "ALUMINUM",
    "SS": "STAINLESS STEEL",
    "STEEL": "STEEL",
    "GLASS": "GLASS",
    "PIPE": "PIPE",
    "POST": "POST",
    "RAIL": "RAIL",
    "PLATE": "PLATE",
    "ANGLE": "ANGLE",
}


def _norm_material(mat: str) -> str:
    key = (mat or "").upper().strip()
    return MATERIAL_NORMALIZE.get(key, key or "UNKNOWN")


def normalize_bom_items(items: List[Dict]) -> List[Dict]:
    normalized = []
    seen = set()
    for item in items or []:
        mat = _norm_material(item.get("material", ""))
        qty = item.get("quantity")
        try:
            qty = float(qty) if qty is not None else None
        except Exception:
            qty = None
        norm_item = {
            **item,
            "material": mat,
            "quantity": qty,
        }
        key = (norm_item.get("item"), mat, norm_item.get("dimensions"), norm_item.get("description"))
        if key in seen:
            continue
        seen.add(key)
        normalized.append(norm_item)
    return normalized
