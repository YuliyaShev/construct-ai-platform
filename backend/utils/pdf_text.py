import pdfplumber
from typing import List


def extract_all_text(file_path: str) -> List[str]:
    pages = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return pages
