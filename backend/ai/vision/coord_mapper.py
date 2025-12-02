from typing import Dict, List


def normalize_coordinates(image_width: int, image_height: int):
    def _norm(bbox):
        x1, y1, x2, y2 = bbox
        return [x1 / image_width, y1 / image_height, x2 / image_width, y2 / image_height]
    return _norm


def map_text_to_geometry(ocr_blocks: List[Dict], shapes: Dict) -> List[Dict]:
    mapped = []
    for block in ocr_blocks:
        mapped.append({
            "type": "text",
            "text": block.get("text"),
            "bbox": block.get("bbox"),
            "linked_shape": None,
        })
    for line in shapes.get("lines", []):
        mapped.append({"type": "line", "bbox": line.get("p1") + line.get("p2"), "text": None, "linked_shape": line})
    return mapped


def detect_dimension_zones(mapped_items: List[Dict]) -> List[Dict]:
    return [item for item in mapped_items if item.get("text") and any(char.isdigit() for char in item["text"] or "")]


def associate_notes_with_geometry(mapped_items: List[Dict]) -> List[Dict]:
    return mapped_items


def find_referenced_details(text_blocks: List[Dict]) -> List[str]:
    refs = []
    for block in text_blocks:
        txt = (block.get("text") or "").upper()
        if "SEE DETAIL" in txt:
            refs.append(txt)
    return refs


def map_coordinates(page_data: Dict, shapes: Dict) -> Dict:
    """Map OCR blocks and shapes into unified structure."""
    mapped_items = map_text_to_geometry(page_data.get("ocr_blocks", []), shapes)
    dimension_zones = detect_dimension_zones(mapped_items)
    references = find_referenced_details(page_data.get("ocr_blocks", []))

    return {
        "page": page_data.get("page"),
        "mapped_items": mapped_items,
        "dimension_zones": dimension_zones,
        "references": references,
    }
