import fitz  # PyMuPDF
from typing import Dict, List

try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None


def extract_text_blocks(page: fitz.Page) -> List[Dict]:
    blocks = []
    for b in page.get_text("blocks"):
        x0, y0, x1, y1, text, block_no, block_type = b[:7]
        blocks.append(
            {
                "text": text.strip(),
                "bbox": [float(x0), float(y0), float(x1), float(y1)],
                "block_no": block_no,
                "type": block_type,
            }
        )
    return blocks


def run_ocr_on_page(page: fitz.Page) -> List[Dict]:
    if pytesseract is None or Image is None:
        return []
    pix = page.get_pixmap(dpi=200)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    ocr_blocks = []
    for i in range(len(data["text"])):
        txt = data["text"][i].strip()
        if not txt:
            continue
        x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
        ocr_blocks.append({"text": txt, "bbox": [x, y, x + w, y + h], "confidence": float(data.get("conf", [0])[i])})
    return ocr_blocks


def extract_text(doc: fitz.Document, page_index: int) -> Dict:
    page = doc[page_index]
    blocks = extract_text_blocks(page)
    ocr_blocks = run_ocr_on_page(page)
    return {
        "page": page_index + 1,
        "blocks": blocks,
        "ocr_blocks": ocr_blocks,
    }
