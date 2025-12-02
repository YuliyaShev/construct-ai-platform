CHUNK_REASONING_PROMPT = """
You are a senior structural engineer and project manager reviewing a shop drawing text chunk.
Identify issues, missing details, constructibility risks, and summarize design intent.
Return JSON with keys: issues (list), summary, actions. Issues entries: type, severity (error|warning|info), message, context, llm_reasoning.
Keep responses concise and specific to this chunk.

TEXT:
{chunk}
"""

DIMENSION_CONFLICT_PROMPT = """
You are checking for dimension conflicts across the provided text. Identify contradictions or missing dimensions.
Return JSON: {{ "issues": [{{"type":"dimension_conflict","severity":"error","message":"","context":"","llm_reasoning":""}}] }}
TEXT:
{chunk}
"""

MISSING_NOTE_PROMPT = """
You are verifying missing engineering notes in this shop drawing text. Detect absent critical notes (welds, finishes, tolerances, anchors).
Return JSON: {{ "issues": [{{"type":"missing_note","severity":"warning","message":"","context":"","llm_reasoning":""}}] }}
TEXT:
{chunk}
"""

CROSS_REFERENCE_CHECK = """
You are verifying callouts and references such as "SEE DETAIL 4/A5.03". Flag any references that look missing or inconsistent.
Return JSON: {{ "issues": [{{"type":"missing_reference","severity":"warning","message":"","context":"","llm_reasoning":""}}] }}
TEXT:
{chunk}
"""

FINAL_SUMMARY_PROMPT = """
You are a senior structural engineer and PM. Combine all chunk analyses into a single structured result.
Input JSON:
{combined_json}

Merge and deduplicate issues, craft a clear high-level summary, and propose 3-5 actionable next steps for the PM.
Return JSON with keys: issues (list), summary (string), actions (list of strings), meta (tokens_used, model).
"""
