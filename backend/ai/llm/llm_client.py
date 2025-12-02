import json
import os
import time
from typing import Any, Dict, List, Optional

from openai import OpenAI


class LLMClient:
    """Thin wrapper around OpenAI (extensible for Anthropic/DeepSeek)."""

    def __init__(self, model: Optional[str] = None, temperature: float = 0.2, max_retries: int = 2):
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        api_key = os.getenv("OPENAI_API_KEY")
        self.enabled = bool(api_key)
        self.client = OpenAI(api_key=api_key) if api_key else None
        self.temperature = temperature
        self.max_retries = max_retries

    def generate(self, prompt: str, max_tokens: int = 2000) -> str:
        if not self.enabled or not self.client:
            return "[LLM disabled] " + prompt[:200]

        for attempt in range(self.max_retries + 1):
            try:
                resp = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=self.temperature,
                    max_tokens=max_tokens,
                )
                return resp.choices[0].message["content"]
            except Exception:
                if attempt >= self.max_retries:
                    raise
                time.sleep(0.5 * (attempt + 1))
        return ""

    def generate_json(self, prompt: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        raw = self.generate(prompt)
        try:
            return json.loads(raw)
        except Exception:
            try:
                # Attempt to extract JSON substring
                start = raw.find("{")
                end = raw.rfind("}")
                if start != -1 and end != -1:
                    return json.loads(raw[start : end + 1])
            except Exception:
                pass
        # Fallback to schema with message
        fallback = schema.copy()
        fallback["__raw__"] = raw
        return fallback

    @staticmethod
    def split_long_text(text: str, chunk_size: int = 12000) -> List[str]:
        if len(text) <= chunk_size:
            return [text]
        return [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]

    def batch_reason(self, chunks: List[str], prompt_builder) -> List[Dict[str, Any]]:
        results = []
        for chunk in chunks:
            prompt = prompt_builder(chunk)
            data = self.generate_json(prompt, schema={"issues": [], "summary": ""})
            results.append(data)
        return results
