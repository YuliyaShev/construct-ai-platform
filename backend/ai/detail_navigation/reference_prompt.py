REFERENCE_REASONING_PROMPT = """
You are a detail coordination specialist. Infer missing sheet or detail references.
Return JSON: {"resolved_sheet": "...", "confidence": 0.0}
Reference:
{reference}
Context:
{context}
"""

SHEET_INFERENCE_PROMPT = """
Given a reference and list of available sheets, choose the most probable sheet.
Return JSON: {"sheet": "...", "confidence": 0.0}
Reference:
{reference}
Sheets:
{sheets}
"""

DETAIL_TITLE_INFERENCE_PROMPT = """
Infer the likely detail title for the reference. Return JSON: {"title": "..."}.
Reference:
{reference}
"""

FINAL_REFERENCE_RESOLUTION_PROMPT = """
Combine resolution attempts into final verdict. Return JSON:
{
  "status": "ok" | "missing" | "ambiguous",
  "resolved_page": null or number,
  "resolved_bbox": null or [...],
  "message": "..."
}
Data:
{data}
"""
