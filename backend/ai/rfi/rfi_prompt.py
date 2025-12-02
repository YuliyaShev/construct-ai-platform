GENERATE_RFI_QUESTION = """
You are a structural engineer and RFI specialist. Given an issue, propose a concise RFI question to the design team.
Return JSON:
{
  "question": "...",
  "required_information": "...",
  "possible_causes": []
}
Issue:
{issue}
Context:
{context}
"""

GENERATE_RFI_SUMMARY = """
You are summarizing a shop drawing conflict for an RFI. Use precise engineering language.
Return JSON:
{
  "title": "...",
  "description": "...",
  "issue_summary": "...",
  "drawing_reference": "... (if any)"
}
Issue:
{issue}
Context:
{context}
"""

GENERATE_RFI_RECOMMENDED_ACTION = """
You are recommending an actionable resolution for a shop drawing conflict.
Return JSON:
{
  "recommendation": "...",
  "required_from_engineer": "...",
  "possible_causes": []
}
Issue:
{issue}
Context:
{context}
"""

ENGINEERING_REASONING = """
You are a structural engineer and PM. Given the issue and context, produce a structured RFI draft in JSON only.
Include fields: issue_type, page, bbox, description, question, required_information, recommendation, drawing_reference, possible_causes.
Issue:
{issue}
Context:
{context}
"""
