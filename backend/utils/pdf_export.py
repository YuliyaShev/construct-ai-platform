import os
import tempfile
from typing import Dict, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image


def _styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=12,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=6,
            spaceBefore=8,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=14,
            textColor=colors.black,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#475569"),
            spaceAfter=4,
        ),
        "chip_high": ParagraphStyle(
            "chip_high",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.white,
            backColor=colors.HexColor("#b71c1c"),
            leading=12,
        ),
        "chip_medium": ParagraphStyle(
            "chip_medium",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.black,
            backColor=colors.HexColor("#f57f17"),
            leading=12,
        ),
        "chip_low": ParagraphStyle(
            "chip_low",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.white,
            backColor=colors.HexColor("#1565c0"),
            leading=12,
        ),
    }


def _severity_chip(sev: str, st: Dict[str, ParagraphStyle]) -> Paragraph:
    s = (sev or "").lower()
    if "high" in s:
        return Paragraph("High", st["chip_high"])
    if "med" in s:
        return Paragraph("Medium", st["chip_medium"])
    return Paragraph("Low", st["chip_low"])


def build_rfi_report_pdf(rfi: Dict, file_meta: Dict, image_path: Optional[str] = None) -> str:
    """
    Create a PDF for a single RFI. Returns path to the generated PDF.
    """
    st = _styles()
    fd, tmp_path = tempfile.mkstemp(prefix="rfi_report_", suffix=".pdf")
    os.close(fd)

    doc = SimpleDocTemplate(
        tmp_path,
        pagesize=LETTER,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )
    story = []

    # Header
    story.append(Paragraph("Request for Information (RFI) Report", st["title"]))
    meta = f"RFI #: {rfi.get('rfi_number', rfi.get('id', 'N/A'))}<br/>Generated: {rfi.get('created_at', '')}"
    story.append(Paragraph(meta, st["small"]))
    story.append(Spacer(1, 0.2 * inch))

    # Project info
    story.append(Paragraph("Project / File", st["section"]))
    info = [
        ["File Name", file_meta.get("original_name") or file_meta.get("name") or "-"],
        ["Page", str(rfi.get("page") or rfi.get("page_number") or "-")],
        ["Coordinates", f"{rfi.get('x', '-')}, {rfi.get('y', '-')}, {rfi.get('width', '-')}, {rfi.get('height', '-')}"],
    ]
    table = Table(info, colWidths=[1.6 * inch, 4.6 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8fafc")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#475569")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.2 * inch))

    # Severity badge
    story.append(_severity_chip(rfi.get("severity", "low"), st))
    story.append(Spacer(1, 0.15 * inch))

    # Sections
    story.append(Paragraph("Title", st["section"]))
    story.append(Paragraph(rfi.get("title") or rfi.get("issue_summary") or "No title", st["body"]))

    story.append(Paragraph("Issue Summary", st["section"]))
    story.append(Paragraph(rfi.get("issue_summary") or rfi.get("description") or "No summary provided.", st["body"]))

    story.append(Paragraph("Recommended Action", st["section"]))
    story.append(Paragraph(rfi.get("recommendation") or rfi.get("suggested_fix") or "No recommendation provided.", st["body"]))

    if rfi.get("question"):
        story.append(Paragraph("Question to Engineer", st["section"]))
        story.append(Paragraph(rfi["question"], st["body"]))

    if rfi.get("ai_confidence"):
        story.append(Paragraph("AI Confidence", st["section"]))
        story.append(Paragraph(str(rfi["ai_confidence"]), st["body"]))

    # Image / crop
    if image_path and os.path.exists(image_path):
        story.append(Paragraph("Issue Area", st["section"]))
        story.append(Image(image_path, width=5.5 * inch, height=3.5 * inch))
        story.append(Spacer(1, 0.15 * inch))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Generated by Construct AI Systems", st["small"]))

    doc.build(story)
    return tmp_path
