import fitz  # PyMuPDF
from utils.helpers import DIMENSION_PATTERNS, extract_context


def extract_pdf_text(pdf_bytes: bytes):
    """
    Extract text from PDF pages + auto-detected dimensions.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    pages = []
    all_dimensions = []

    for page_num, page in enumerate(doc):
        text = page.get_text("text")

        # Find dimensions on each page
        dims = []
        for dim_type, pattern in DIMENSION_PATTERNS.items():
            import re
            found = re.findall(pattern, text)
            for match in found:
                dims.append({
                    "page": page_num + 1,
                    "type": dim_type,
                    "value": match if isinstance(match, str) else match[0],
                    "context": extract_context(text, match if isinstance(match, str) else match[0])
                })

        all_dimensions.extend(dims)

        pages.append({
            "page": page_num + 1,
            "text": text,
            "dimensions": dims
        })

    doc.close()

    return {
        "pages": pages,
        "all_dimensions": all_dimensions
    }
