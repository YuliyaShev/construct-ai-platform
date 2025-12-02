CLASSIFY_MATERIAL = """
You are a structural engineer and estimator. Given a text candidate, classify it into a BOM row.
Return JSON: {"item": "...", "material": "...", "description": "...", "dimensions": "...", "unit": "...", "quantity": null, "page": <int|null>, "bbox": [...]}
Candidate:
{candidate}
"""

EXTRACT_QUANTITY = """
Extract quantity from the candidate text. Return JSON: {"quantity": <number|null>}.
Text:
{text}
"""

EXTRACT_DESCRIPTION = """
Summarize the item into a clear description. Return JSON: {"description": "..."}.
Text:
{text}
"""

EXTRACT_DIMENSIONS = """
Extract dimensions and unit. Return JSON: {"dimensions": "...", "unit": "..."}.
Text:
{text}
"""

EXTRACT_MATERIAL_SPEC = """
Classify the material. Return JSON: {"material": "..."} using standardized names (ALUMINUM, STEEL, GLASS, STAINLESS STEEL, PIPE, POST, RAIL, PLATE, ANGLE, OTHER).
Text:
{text}
"""

BUILD_FINAL_BOM_TABLE = """
You are a fabrication detailer. Combine the given items into a structured BOM table. Deduplicate similar entries.
Return JSON list of items with keys: item, material, description, dimensions, unit, quantity, page, bbox.
Items:
{items}
"""
