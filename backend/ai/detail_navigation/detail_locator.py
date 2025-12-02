from typing import Dict, List, Optional


def find_detail_on_pages(references: List[Dict], ocr_pages: List[Dict], segments: List[Dict]) -> List[Dict]:
    resolved = []
    for ref in references:
        detail_num = ref.get("detail_number")
        sheet = (ref.get("sheet") or "").upper() if ref.get("sheet") else None
        target_page = None
        target_bbox = None
        # Heuristic search in OCR text for title like "DETAIL {num}"
        for page in ocr_pages or []:
            for block in page.get("ocr_blocks", []):
                txt = (block.get("text") or "").upper()
                if detail_num and f"DETAIL {detail_num}".upper() in txt:
                    target_page = page.get("page")
                    target_bbox = block.get("bbox")
                    break
            if target_page:
                break
        resolved.append({
            **ref,
            "resolved_page": target_page,
            "resolved_bbox": target_bbox,
        })
    return resolved
