import json
import os
import uuid

import fitz
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

from utils.helpers import DIMENSION_PATTERNS, extract_context


def save_uploaded_pdf(file_bytes: bytes, upload_dir: str, original_filename: str):
    """Persist uploaded PDF bytes to disk."""
    os.makedirs(upload_dir, exist_ok=True)
    unique_name = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(upload_dir, unique_name)
    file_size = len(file_bytes)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    return {
        "original_filename": original_filename,
        "saved_as": unique_name,
        "saved_to": file_path,
        "size": file_size,
        "message": "PDF uploaded successfully (no size limit)"
    }


def extract_text_from_path(file_path: str):
    """Extract text from all pages of a stored PDF file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError("PDF file does not exist")

    extracted = []
    doc = fitz.open(file_path)

    for page_num, page in enumerate(doc):
        extracted.append({
            "page": page_num + 1,
            "text": page.get_text()
        })

    doc.close()

    return {
        "file": file_path,
        "total_pages": len(extracted),
        "content": extracted
    }


def summarize_pdf(file_path: str, client):
    """Summarize PDF text using OpenAI."""
    if not os.path.exists(file_path):
        raise FileNotFoundError("PDF file not found.")

    try:
        pdf = fitz.open(file_path)
        all_text = ""
        for page in pdf:
            all_text += page.get_text() + "\n"
        pdf.close()
    except Exception as e:
        raise RuntimeError(f"Failed to extract text: {str(e)}")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an assistant that summarizes PDF documents."},
                {"role": "user", "content": f"Summarize this PDF:\n{all_text}"}
            ]
        )
        summary = response.choices[0].message["content"]
    except Exception as e:
        raise RuntimeError(f"OpenAI request failed: {str(e)}")

    return {
        "file": file_path,
        "summary": summary
    }


def analyze_shop_drawing(pdf_bytes: bytes, client):
    """Analyze shop drawing text and dimensions with OpenAI."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    extracted_text = ""
    all_dimensions = []

    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        extracted_text += f"\n\n--- PAGE {page_num + 1} ---\n{text}"

        for dim_type, pattern in DIMENSION_PATTERNS.items():
            import re
            found = re.findall(pattern, text)
            for match in found:
                all_dimensions.append({
                    "page": page_num + 1,
                    "type": dim_type,
                    "value": match
                })

    prompt = f"""
You are a senior shop drawing checker with 20+ years of experience in:
- aluminum & steel fabrication
- glass railings and guards
- stairs and ramps
- canopies & structural supports
- architectural metals QA/QC
- North American codes (IBC, NBC, BCBC, OSHA, ADA)

You receive extracted shop drawing text AND auto-detected dimensions.

You must:

1. Detect **critical issues** affecting fabrication, assembly, safety or installation.
2. Detect **dimension conflicts between pages** using the extracted numeric data.
3. Identify **missing information**, such as:
   - material specs
   - wall thickness
   - fasteners
   - weld symbols
   - glass type
   - bracket spacing
   - anchor loads
4. Identify **code violations** (IBC/ADA/OSHA).
5. Catch **detailing errors** (missing callouts, wrong detail numbers).
6. Catch **structural conflicts** (interference with slab edges, walls, mullions, glazing).
7. Generate **professional RFIs** with reason, question, priority.
8. Provide **clear recommendations** for next actions.

RETURN JSON in this exact structure:

{
  "summary": "...",
  "critical_issues": [...],
  "dimension_conflicts": [...],
  "missing_information": [...],
  "code_violations": [...],
  "detailing_errors": [...],
  "structural_conflicts": [...],
  "rfi_to_generate": [
    {
      "id": "RFI-001",
      "title": "...",
      "question": "...",
      "reason": "...",
      "related_pages": [...],
      "priority": "low | medium | high"
    }
  ],
  "recommendations": [...]
}

EXTRACTED TEXT:
{extracted_text}

AUTO-DETECTED DIMENSIONS (USE THESE FOR CROSS-PAGE COMPARISON):
{all_dimensions}
    """

    doc.close()

    response = client.responses.create(
        model="gpt-4.1",
        input=prompt,
        response_format={"type": "json_object"}
    )

    return response.output_json


def extract_drawings(pdf_bytes: bytes):
    """Extract vector drawing data from PDF bytes."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        raise RuntimeError(f"Invalid PDF: {str(e)}")

    results = []

    for page_num, page in enumerate(doc):
        shapes = page.get_drawings()

        parsed_shapes = []

        for shape in shapes:
            s_type = shape.get("type")

            parsed_shapes.append({
                "type": s_type,
                "points": shape.get("points"),
                "width": shape.get("width"),
                "fill": shape.get("fill"),
                "color": shape.get("color"),
                "closePath": shape.get("closePath"),
                "even_odd": shape.get("even_odd"),
            })

        results.append({
            "page": page_num + 1,
            "shape_count": len(parsed_shapes),
            "shapes": parsed_shapes
        })

    doc.close()

    return {
        "pages": len(results),
        "geometry": results
    }


def get_next_rfi_number(counter_file: str):
    """Increment and return next RFI number."""
    if not os.path.exists(counter_file):
        data = {"last_rfi_number": 0}
        os.makedirs(os.path.dirname(counter_file), exist_ok=True)
        with open(counter_file, "w") as f:
            json.dump(data, f)

    with open(counter_file, "r") as f:
        data = json.load(f)

    data["last_rfi_number"] += 1

    with open(counter_file, "w") as f:
        json.dump(data, f, indent=4)

    return data["last_rfi_number"]


def generate_rfi_pdf(rfi_data, rfi_number, output_dir: str):
    """Create RFI PDF using ReportLab."""
    os.makedirs(output_dir, exist_ok=True)
    filename = f"RFI-{rfi_number:03}.pdf"
    file_path = os.path.join(output_dir, filename)

    c = canvas.Canvas(file_path, pagesize=letter)

    width, height = letter
    x = 40
    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(x, y, f"REQUEST FOR INFORMATION – RFI-{rfi_number:03}")
    y -= 30

    c.setFont("Helvetica", 11)

    fields = [
        ("Subject", rfi_data.get("title", "")),
        ("Drawing Reference", ", ".join(rfi_data.get("related_pages", []))),
        ("Question", rfi_data.get("question", "")),
        ("Reason", rfi_data.get("reason", "")),
        ("Priority", rfi_data.get("priority", "")),
        ("Recommended Resolution", rfi_data.get("recommendation", "")),
    ]

    for label, value in fields:
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x, y, f"{label}:")
        y -= 15

        c.setFont("Helvetica", 10)

        text_object = c.beginText(x, y)
        text_object.textLines(value)
        c.drawText(text_object)

        y -= (15 * (value.count("\n") + 2))

        if y < 80:
            c.showPage()
            y = height - 60

    c.save()
    return file_path


def generate_rfi_auto(pdf_bytes: bytes, client):
    """Analyze PDF and generate RFIs automatically."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    extracted_text = ""
    pages = []

    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        extracted_text += f"\n\n--- PAGE {page_num+1} ---\n{text}"
        pages.append({"page": page_num+1, "text": text})

    prompt = f"""
You are a senior construction project coordinator and shop drawing reviewer
with 20+ years of experience.

Your task:
Generate a full list of RFIs based on issues found in this drawing set.

Use your expertise to detect:
- dimension conflicts
- missing notes
- unclear callouts
- ambiguous details
- mismatched information between sheets
- missing structural info
- elevation conflicts
- code violations
- impossibilities in fabrication or installation

For EACH RFI generate:

{
  "id": "RFI-001",
  "title": "",
  "description": "",
  "sheet_reference": "",
  "reason": "",
  "question": "",
  "proposed_solution": "",
  "priority": "low | medium | high"
}

TEXT FROM PDF:
{extracted_text}
    """

    doc.close()

    response = client.responses.create(
        model="gpt-4.1",
        input=prompt,
        response_format={"type": "json_object"}
    )

    return response.output_json
