import pdfplumber


def extract_text_from_pdf(file_path: str) -> str:
    """Extract plain text from a PDF using pdfplumber."""
    try:
        with pdfplumber.open(file_path) as pdf:
            pages_text = [page.extract_text() or "" for page in pdf.pages]
    except Exception as exc:
        raise RuntimeError(f"Failed to extract text: {exc}") from exc

    # Join pages with spacing to keep readability
    return "\n\n".join(pages_text).strip()
