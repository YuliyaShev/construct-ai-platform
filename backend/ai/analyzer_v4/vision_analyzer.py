from typing import Dict, List

from ai.llm.llm_client import LLMClient


def analyze_regions_with_vision(regions: List[Dict], context_text: str) -> List[Dict]:
    """
    Placeholder LLM vision classification. Expects regions with image_path or crop metadata.
    """
    client = LLMClient()
    results = []
    for region in regions:
        prompt = f"""
You are a structural/detailing vision assistant. Classify this detail based on the context.
Return JSON: {{"type":"", "confidence":0.0, "notes":""}}
Context text:
{context_text[:1000]}
Region meta: {region}
"""
        res = client.generate_json(prompt, schema={"type": "unknown", "confidence": 0.0, "notes": ""})
        results.append({**region, **res})
    return results
