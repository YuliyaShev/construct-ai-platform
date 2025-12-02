import os
import tempfile
from typing import List, Dict

try:
    from pdf2image import convert_from_path
except ImportError:
    convert_from_path = None

try:
    import pytesseract
    from pytesseract import Output
except ImportError:
    pytesseract = None


def _run_ocr(image) -> List[Dict]:
    """Run OCR with bounding boxes using pytesseract if available."""
    if pytesseract is None:
        return []
    data = pytesseract.image_to_data(image, output_type=Output.DICT)
    blocks = []
    for i in range(len(data["text"])):
        text = data["text"][i].strip()
        if not text:
            continue
        x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
        conf = float(data.get("conf", [0])[i]) if data.get("conf") else 0.0
        blocks.append({"text": text, "bbox": [x, y, x + w, y + h], "confidence": conf})
    return blocks


def extract_pdf_vision(pdf_path: str, output_dir: str | None = None) -> List[Dict]:
    """Convert PDF pages to images and run OCR; returns per-page vision payload."""
    if convert_from_path is None:
        return []

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="pdf_pages_")
    os.makedirs(output_dir, exist_ok=True)

    pages = convert_from_path(pdf_path, dpi=200)
    results = []
    for idx, page in enumerate(pages, start=1):
        image_path = os.path.join(output_dir, f"page_{idx}.png")
        page.save(image_path, "PNG")
        ocr_blocks = _run_ocr(page)
        results.append({
            "page": idx,
            "image_path": image_path,
            "ocr_blocks": ocr_blocks,
        })
    return results
