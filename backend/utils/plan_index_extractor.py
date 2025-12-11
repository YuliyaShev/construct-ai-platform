import fitz  # PyMuPDF
from typing import List


def extract_plan_index_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    texts = []
    for page in doc:
        texts.append(page.get_text("text"))
    return "\n".join(texts)


def find_sheet_matches(text: str, patterns: List[str]) -> List[str]:
    upper = text.upper()
    matches = []
    for p in patterns:
        if p.upper() in upper:
            matches.append(p)
    return matches
