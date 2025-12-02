from typing import Dict, List

from ai.rfi.rfi_builder import RFIBuilder
from ai.rfi import rfi_prompt
from ai.llm.llm_client import LLMClient


def merge_related_issues(issues: List[Dict]) -> List[Dict]:
    """Placeholder grouping: currently returns as-is."""
    return issues


def generate_rfi_for_issue(issue: Dict, context: Dict, builder: RFIBuilder, client: LLMClient) -> Dict:
    """Generate one RFI entry from an issue and context."""
    context_str = str(context)[:4000]

    q_json = client.generate_json(
        rfi_prompt.GENERATE_RFI_QUESTION.format(issue=issue, context=context_str),
        schema={"question": "", "required_information": ""},
    )
    summary_json = client.generate_json(
        rfi_prompt.GENERATE_RFI_SUMMARY.format(issue=issue, context=context_str),
        schema={"title": "", "description": ""},
    )
    rec_json = client.generate_json(
        rfi_prompt.GENERATE_RFI_RECOMMENDED_ACTION.format(issue=issue, context=context_str),
        schema={"recommendation": ""},
    )

    merged = {
        **summary_json,
        **q_json,
        **rec_json,
    }

    references = context.get("references", [])
    return builder.build(issue, merged, rfi_number=context.get("rfi_number", "AUTO-000"), references=references)


def generate_rfi_batch(issues: List[Dict], context: Dict) -> List[Dict]:
    client = LLMClient()
    grouped = merge_related_issues(issues)
    builder = RFIBuilder(
        file_meta=context.get("file_meta", {}),
        issues=issues,
        heatmap=context.get("heatmap", []),
        ocr_pages=context.get("ocr_pages", []),
    )
    rfis = []
    for idx, issue in enumerate(grouped, start=1):
        ctx = {**context, "rfi_number": f"AUTO-{idx:03d}"}
        rfis.append(generate_rfi_for_issue(issue, ctx, builder, client))
    return rfis
