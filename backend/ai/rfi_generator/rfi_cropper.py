import os
import fitz  # PyMuPDF
from typing import Optional

PREVIEW_DIR = os.path.join("uploaded_files", "rfi_previews")
os.makedirs(PREVIEW_DIR, exist_ok=True)


def crop_issue_preview(pdf_path: str, page_number: int, x_norm: float, y_norm: float, box_size: float = 120) -> Optional[str]:
    """
    Crop a region around normalized coordinates (0-1) and save as PNG.
    box_size in PDF units (approx px at 72 dpi).
    """
    try:
        doc = fitz.open(pdf_path)
        page = doc[page_number - 1]
        rect = page.rect
        x = rect.x0 + x_norm * rect.width
        y = rect.y0 + y_norm * rect.height
        # FitZ origin bottom-left; invert y from normalized top?
        # Our normalized uses bottom-left, so y stays.
        crop_rect = fitz.Rect(x - box_size / 2, y - box_size / 2, x + box_size / 2, y + box_size / 2)
        pix = page.get_pixmap(clip=crop_rect, dpi=144)
        filename = f"rfi_preview_{page_number}_{int(x*1000)}_{int(y*1000)}.png"
        out_path = os.path.join(PREVIEW_DIR, filename)
        pix.save(out_path)
        return out_path
    except Exception:
        return None
