RFI_PROMPT = """
Please write a professional construction RFI for a detected issue in shop drawings.

Include:
- short technical title
- clear description of discrepancy
- reference to expected vs found values
- location on drawing (page + coordinates)
- potential impact on fabrication/installation
- question to engineer requesting clarification
- recommended correction options

Return strictly in JSON:
{
  "title": "...",
  "description": "...",
  "question": "...",
  "suggested_fix": "..."
}

ISSUE:
{issue}
"""
