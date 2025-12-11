import re
from typing import Dict, List, Tuple

import pdfplumber

KEYWORDS = [
    "ALUMINUM",
    "GLASS",
    "STAINLESS",
    "STEEL",
    "POST",
    "PICKET",
    "FASTENER",
    "HSS",
    "TUBE",
    "ANCHOR",
    "BASEPLATE",
    "RAIL",
    "CHANNEL",
]


def _clean(text: str) -> str:
    return " ".join(text.split()).strip()


def extract_tables(file_path: str) -> List[Dict]:
    rows = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for tbl in tables or []:
                for row in tbl:
                    cleaned = [_clean(c or "") for c in row]
                    if any(cleaned):
                        rows.append({"page": page.page_number, "row": cleaned})
    return rows


def parse_candidates(text_pages: List[str], table_rows: List[Dict]) -> List[Dict]:
    candidates: List[Dict] = []

    # From tables
    for row in table_rows:
        r = row["row"]
        row_text = " ".join(r)
        if any(k in row_text.upper() for k in KEYWORDS):
            name = r[0] if r else row_text
            qty = _extract_qty(row_text)
            unit = _extract_unit(row_text)
            candidates.append(
                {
                    "name": name,
                    "qty": qty,
                    "unit": unit,
                    "location": f"Sheet page {row['page']}",
                    "notes": row_text,
                    "source": "table",
                }
            )

    # From text callouts
    for idx, page_text in enumerate(text_pages, start=1):
        lines = [l for l in page_text.splitlines() if l.strip()]
        for line in lines:
            if any(k in line.upper() for k in KEYWORDS):
                candidates.append(
                    {
                        "name": line.strip()[:60],
                        "qty": _extract_qty(line),
                        "unit": _extract_unit(line),
                        "location": f"Sheet page {idx}",
                        "notes": line.strip(),
                        "source": "callout",
                    }
                )

    return candidates


def _extract_qty(text: str):
    m = re.search(r"\b(\d{1,4})\b", text)
    return int(m.group(1)) if m else None


def _extract_unit(text: str):
    for u in ["pcs", "ea", "each", "lf", "sf", "m", "mm", "in", "\""]:
        if u.lower() in text.lower():
            return u
    return None


def normalize_candidates(candidates: List[Dict]) -> Dict:
    materials = []
    for c in candidates:
        entry = {
            "name": c.get("name"),
            "qty": c.get("qty"),
            "unit": c.get("unit") or "pcs",
            "location": c.get("location"),
            "notes": c.get("notes"),
            "source": c.get("source"),
        }
        # crude bucketing
        upper = (entry["name"] or "").upper()
        if "GLASS" in upper:
            entry["group"] = "glass"
        elif any(k in upper for k in ["POST", "HSS", "ALUMINUM", "STEEL", "CHANNEL", "ANGLE"]):
            entry["group"] = "materials"
        elif any(k in upper for k in ["FASTENER", "ANCHOR"]):
            entry["group"] = "hardware"
        else:
            entry["group"] = "misc"
        materials.append(entry)
    return {
        "materials": materials,
        "hardware": [m for m in materials if m["group"] == "hardware"],
        "glass": [m for m in materials if m["group"] == "glass"],
        "misc": [m for m in materials if m["group"] == "misc"],
    }
