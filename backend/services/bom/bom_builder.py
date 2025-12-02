import re

import fitz


def build_bom_from_pdf(pdf_bytes: bytes, client):
    """Generate BOM JSON using OpenAI based on PDF text and geometry summary."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    combined_text = ""
    geometry_data = []

    dimension_patterns = r"(\d+\.?\d*\s?(mm|cm|m|\"|”|in|ft))"

    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        combined_text += f"\n\n--- PAGE {page_num+1} ---\n{text}"

        dims = re.findall(dimension_patterns, text, flags=re.IGNORECASE)

        shapes = page.get_drawings()
        geometry_data.append({
            "page": page_num + 1,
            "dimensions": [d[0] for d in dims],
            "shapes_count": len(shapes)
        })

    doc.close()

    prompt = f"""
You are a senior estimator and shop drawing analyst.
Your task: Produce a COMPLETE BUILD OF MATERIALS (BOM) from the PDF drawings.

Identify and list **all elements**, grouped by trade:

- Steel
- Aluminum
- Glass
- Wood Framing
- Drywall
- Mechanical (HVAC)
- Plumbing
- Electrical
- Hardware
- Fasteners
- Miscellaneous

For each item provide:
- name
- description
- quantity
- unit (pcs, m, ft, m2, ft2)
- dimensions (if available)
- notes (if relevant)

PDF TEXT:
{combined_text}

PDF GEOMETRY SUMMARY:
{geometry_data}

Return JSON with this structure:
{
  "Steel": [...],
  "Aluminum": [...],
  "Glass": [...],
  "Wood_Framing": [...],
  "Drywall": [...],
  "Mechanical": [...],
  "Plumbing": [...],
  "Electrical": [...],
  "Hardware": [...],
  "Fasteners": [...],
  "Misc": [...]
}
    """

    response = client.responses.create(
        model="gpt-4.1",
        input=prompt,
        response_format={"type": "json_object"}
    )

    return response.output_json
