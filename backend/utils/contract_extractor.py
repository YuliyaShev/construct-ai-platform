import os
from typing import Tuple

import fitz  # PyMuPDF


def extract_contract_text(file_path: str) -> Tuple[str, str]:
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    if ext in [".pdf"]:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text("text") + "\n"
    else:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
    contract_type = "AIA" if "AIA" in text.upper() else "CCDC" if "CCDC" in text.upper() else "Custom"
    return text, contract_type
