import re

import fitz

from utils.helpers import DIMENSION_PATTERNS, extract_context


async def extract_dimensions_from_pdf(pdf_bytes: bytes):
    """Extract dimension values and context from PDF bytes."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    results = []

    for page_num, page in enumerate(doc):
        text = page.get_text("text")

        for name, pattern in DIMENSION_PATTERNS.items():
            matches = re.findall(pattern, text)

            for match in matches:
                value = match[0] if isinstance(match, tuple) else match
                results.append({
                    "page": page_num + 1,
                    "type": name,
                    "value": value,
                    "context_excerpt": extract_context(text, value)
                })

    doc.close()
    return results
