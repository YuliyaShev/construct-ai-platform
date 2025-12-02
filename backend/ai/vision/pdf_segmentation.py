from typing import Dict, List


def segment_page(image_width: int, image_height: int) -> Dict:
    """Heuristic segmentation of a page into regions."""
    title_block = {"type": "title_block", "bbox": [0, int(image_height * 0.85), image_width, image_height]}
    revision_block = {"type": "revision_block", "bbox": [int(image_width * 0.7), int(image_height * 0.85), image_width, image_height]}
    notes = {"type": "notes", "bbox": [0, 0, image_width, int(image_height * 0.2)]}
    return {"segments": [title_block, revision_block, notes]}


def segment_pdf_pages(pages: List[Dict]) -> List[Dict]:
    segmented = []
    for page in pages:
        segments = segment_page(image_width=2000, image_height=2800)
        segmented.append({"page": page.get("page"), "segments": segments["segments"]})
    return segmented
