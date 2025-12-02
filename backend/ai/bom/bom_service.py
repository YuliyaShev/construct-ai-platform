from typing import Dict, List

from ai.bom.bom_extractor import extract_bom_candidates
from ai.bom.bom_normalizer import normalize_bom_items
from ai.bom import bom_prompt
from ai.llm.llm_client import LLMClient


def classify_and_enrich_with_llm(candidates: List[Dict]) -> List[Dict]:
    client = LLMClient()
    enriched = []
    for cand in candidates:
        payload = {
            "text": cand.get("text"),
            "page": cand.get("page"),
            "bbox": cand.get("bbox"),
            "source": cand.get("source"),
        }
        classified = client.generate_json(
            bom_prompt.CLASSIFY_MATERIAL.format(candidate=payload),
            schema={"item": "", "material": "", "description": "", "dimensions": "", "unit": "", "quantity": None, "page": cand.get("page"), "bbox": cand.get("bbox")},
        )
        enriched.append(classified)
    return enriched


def normalize_and_combine(items: List[Dict]) -> Dict:
    norm = normalize_bom_items(items)
    materials = list({i.get("material") for i in norm if i.get("material")})
    return {
        "bom": norm,
        "stats": {
            "total_items": len(norm),
            "materials_detected": materials,
        }
    }


def extract_bom(text: str, ocr_pages: List[Dict], segments: List[Dict]) -> Dict:
    return extract_bom_candidates(text, ocr_pages, segments)


def build_bom_pipeline(text: str, ocr_pages: List[Dict], segments: List[Dict]) -> Dict:
    raw = extract_bom(text, ocr_pages, segments)
    enriched = classify_and_enrich_with_llm(raw.get("candidates", []))
    return normalize_and_combine(enriched)
