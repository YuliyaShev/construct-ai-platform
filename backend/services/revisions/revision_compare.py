import io
import json
import re
import tempfile

import fitz
from openpyxl import Workbook
from PIL import Image, ImageChops


def _extract_all(doc):
    full_text = ""
    dimensions = []
    geometry = []
    bom_dims_regex = r"(\d+\.?\d*\s?(mm|cm|m|\"|in|ft))"

    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        full_text += f"\n\n--- PAGE {page_num+1} ---\n{text}"

        dims = re.findall(bom_dims_regex, text)
        shapes = page.get_drawings()

        geometry.append({
            "page": page_num + 1,
            "shapes_count": len(shapes),
        })

        for d in dims:
            dimensions.append({
                "page": page_num + 1,
                "value": d[0]
            })

    return full_text, dimensions, geometry


def compare_revisions(file_a_bytes: bytes, file_b_bytes: bytes, client):
    """AI-powered comparison of two PDF revisions (Rev A vs Rev B)."""
    docA = fitz.open(stream=file_a_bytes, filetype="pdf")
    docB = fitz.open(stream=file_b_bytes, filetype="pdf")

    textA, dimsA, geomA = _extract_all(docA)
    textB, dimsB, geomB = _extract_all(docB)

    docA.close()
    docB.close()

    prompt = f"""
You are a senior construction QA/QC engineer.
Compare two PDF revisions: Rev A (old) and Rev B (new).

You MUST analyze differences in:

1. Text notes
2. Dimensions
3. Materials
4. Profiles
5. Geometry / shapes (added / removed / changed)
6. Callouts and detail references
7. BOM (additions, removals, quantity changes)
8. Any issues caused by changes
9. RFIs needed

Return JSON with structure:

{
  "summary": "...",
  "text_changes": {
     "added": [...],
     "removed": [...],
     "modified": [...]
  },
  "dimension_changes": {
     "added": [...],
     "removed": [...],
     "changed": [...]
  },
  "geometry_changes": {
     "added": [...],
     "removed": [...],
     "modified": [...]
  },
  "bom_changes": {
     "added": [...],
     "removed": [...],
     "modified": [...]
  },
  "issues_found": [...],
  "rfi_to_generate": [...],
  "recommendations": [...]
}

REV A TEXT:
{textA}

REV B TEXT:
{textB}

REV A DIMENSIONS:
{dimsA}

REV B DIMENSIONS:
{dimsB}

REV A GEOMETRY:
{geomA}

REV B GEOMETRY:
{geomB}
"""

    response = client.responses.create(
        model="gpt-4.1",
        input=prompt,
        response_format={"type": "json_object"}
    )

    return response.output_json


def export_comparison_to_excel(compare_result: dict):
    """Create Excel export for revision comparison result."""
    wb = Workbook()

    ws = wb.active
    ws.title = "Summary"

    ws.append(["Summary"])
    ws.append([compare_result.get("summary", "")])

    def write_list_sheet(title, data_list, headers=None):
        ws_local = wb.create_sheet(title)

        if not data_list:
            ws_local.append(["NO DATA"])
            return

        headers_local = headers or list(data_list[0].keys())
        ws_local.append(headers_local)

        for item in data_list:
            row = []
            for h in headers_local:
                value = item.get(h, "")
                if isinstance(value, (dict, list)):
                    value = json.dumps(value)
                row.append(value)
            ws_local.append(row)

    sections = [
        ("Text_Changes_Added", compare_result.get("text_changes", {}).get("added", []), None),
        ("Text_Changes_Removed", compare_result.get("text_changes", {}).get("removed", []), None),
        ("Text_Changes_Modified", compare_result.get("text_changes", {}).get("modified", []), None),
        ("Dimension_Added", compare_result.get("dimension_changes", {}).get("added", []), None),
        ("Dimension_Removed", compare_result.get("dimension_changes", {}).get("removed", []), None),
        ("Dimension_Changed", compare_result.get("dimension_changes", {}).get("changed", []), None),
        ("Geometry_Added", compare_result.get("geometry_changes", {}).get("added", []), None),
        ("Geometry_Removed", compare_result.get("geometry_changes", {}).get("removed", []), None),
        ("Geometry_Modified", compare_result.get("geometry_changes", {}).get("modified", []), None),
        ("BOM_Added", compare_result.get("bom_changes", {}).get("added", []), None),
        ("BOM_Removed", compare_result.get("bom_changes", {}).get("removed", []), None),
        ("BOM_Modified", compare_result.get("bom_changes", {}).get("modified", []), None),
        ("Issues", compare_result.get("issues_found", []), None),
        ("RFIs", compare_result.get("rfi_to_generate", []), ["id", "title", "question", "reason", "related_pages", "priority"]),
    ]

    for title, data, headers in sections:
        write_list_sheet(title, data, headers)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
    wb.save(tmp.name)
    return tmp.name


def create_revision_overlay(file_a_bytes: bytes, file_b_bytes: bytes):
    """Create PDF overlay for revision comparison."""
    try:
        doc_a = fitz.open(stream=file_a_bytes, filetype="pdf")
        doc_b = fitz.open(stream=file_b_bytes, filetype="pdf")
    except Exception:
        raise RuntimeError("Invalid PDF input.")

    output_pdf = fitz.open()

    max_pages = max(len(doc_a), len(doc_b))

    for i in range(max_pages):

        page_a = doc_a.load_page(i) if i < len(doc_a) else None
        page_b = doc_b.load_page(i) if i < len(doc_b) else None

        pix_a = page_a.get_pixmap(dpi=150) if page_a else None
        pix_b = page_b.get_pixmap(dpi=150) if page_b else None

        img_a = Image.open(io.BytesIO(pix_a.tobytes("png"))) if pix_a else Image.new("RGB", (100, 100), "white")
        img_b = Image.open(io.BytesIO(pix_b.tobytes("png"))) if pix_b else Image.new("RGB", (100, 100), "white")

        w = max(img_a.width, img_b.width)
        h = max(img_a.height, img_b.height)
        img_a = img_a.resize((w, h))
        img_b = img_b.resize((w, h))

        diff = ImageChops.difference(img_a, img_b)

        added = Image.new("RGB", (w, h), (0, 255, 0))
        removed = Image.new("RGB", (w, h), (255, 0, 0))
        changed = Image.new("RGB", (w, h), (200, 0, 200))

        mask = diff.convert("L").point(lambda p: 255 if p > 15 else 0)

        overlay = Image.new("RGBA", (w, h))
        overlay.paste(added, mask=mask)
        overlay.paste(removed, mask=mask)
        overlay.paste(changed, mask=mask)

        final = Image.blend(img_b, overlay, alpha=0.5)

        final_bytes = io.BytesIO()
        final.save(final_bytes, format="PNG")
        final_bytes = final_bytes.getvalue()

        new_page = output_pdf.new_page(width=w, height=h)
        new_page.insert_image(fitz.Rect(0, 0, w, h), stream=final_bytes)

    doc_a.close()
    doc_b.close()

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    output_pdf.save(tmp.name)

    return tmp.name
