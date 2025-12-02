import json
from typing import Dict, List

from ai.llm.llm_client import LLMClient
from ai.llm import prompts


def reason_over_chunk(client: LLMClient, chunk: str) -> Dict:
    return client.generate_json(
        prompts.CHUNK_REASONING_PROMPT.format(chunk=chunk),
        schema={"issues": [], "summary": "", "actions": []},
    )


def detect_dimension_conflicts(client: LLMClient, chunk: str) -> Dict:
    return client.generate_json(
        prompts.DIMENSION_CONFLICT_PROMPT.format(chunk=chunk),
        schema={"issues": []},
    )


def detect_missing_notes(client: LLMClient, chunk: str) -> Dict:
    return client.generate_json(
        prompts.MISSING_NOTE_PROMPT.format(chunk=chunk),
        schema={"issues": []},
    )


def check_cross_references(client: LLMClient, chunk: str) -> Dict:
    return client.generate_json(
        prompts.CROSS_REFERENCE_CHECK.format(chunk=chunk),
        schema={"issues": []},
    )


def aggregate_chunks(client: LLMClient, analyses: List[Dict]) -> Dict:
    combined_json = json.dumps(analyses)
    return client.generate_json(
        prompts.FINAL_SUMMARY_PROMPT.format(combined_json=combined_json),
        schema={"issues": [], "summary": "", "actions": [], "meta": {}},
    )
