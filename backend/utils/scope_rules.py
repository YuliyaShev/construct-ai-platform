from typing import Dict, List

TRADE_TEMPLATES = {
    "Concrete": [
        "Provide all formwork, reinforcing, and cast-in-place concrete per structural drawings.",
        "Include frost protection if ambient <5°C during pour.",
        "Coordinate embed placement for steel and curtain wall anchors.",
    ],
    "Steel": [
        "Supply and erect structural steel per AISC/AWS standards.",
        "Provide shop drawings, bolted/welded connections, and fireproofing where indicated.",
    ],
    "Glazing": [
        "Provide curtain wall, window frames, glass, anchors, and waterproofing per elevations/details.",
        "Validate anchor loads against slab edge capacity; provide shop drawings and structural calculations.",
    ],
    "Roofing": [
        "Install roofing system with insulation, vapor barrier, flashing, and roof drains per manufacturer.",
        "Ensure tie-ins at parapets and penetrations are watertight; provide warranty certificates.",
    ],
}


def build_scope(trade: str, qto: List[Dict]) -> str:
    lines = [f"Scope of Work – {trade}"]
    for item in qto:
        if trade.lower() in item.get("item", "").lower() or trade.lower() in item.get("csi_desc", "").lower():
            lines.append(f"- {item['item']}: {item['quantity']} {item['unit']} (source: {item.get('source','')})")
    for rule in TRADE_TEMPLATES.get(trade, []):
        lines.append(f"- {rule}")
    lines.append("- Coordinate with other trades for penetrations, sequencing, and access.")
    return "\n".join(lines)
