from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
import os
import datetime


def draw_header(c, rfi_number):
    """Draws the modern header block."""
    c.setFillColor(colors.HexColor("#0A2540"))
    c.rect(0, 10.5 * inch, 8.5 * inch, 0.8 * inch, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(40, 10.75 * inch, f"RFI – Request for Information")

    c.setFont("Helvetica", 12)
    c.drawString(40, 10.45 * inch, f"RFI Number: {rfi_number}")


def draw_section_title(c, title, y):
    """Section title with spacing."""
    c.setFillColor(colors.HexColor("#0A2540"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, title)
    return y - 20


def draw_section_text(c, text, y):
    """Multiline text rendering."""
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 11)

    for line in text.split("\n"):
        c.drawString(40, y, line)
        y -= 15
        if y < 100:
            c.showPage()
            y = 750

    return y - 10


def export_rfi_pdf(rfi_data: dict, output_path: str):
    """
    Creates a premium AI-style RFI PDF.
    """

    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    # Header
    draw_header(c, rfi_data.get("id", "RFI-UNKNOWN"))
    y = height - 140

    # --- Summary ---
    y = draw_section_title(c, "AI Summary", y)
    y = draw_section_text(c, rfi_data.get("summary", "No summary provided."), y)

    # --- Issues Found ---
    y = draw_section_title(c, "Critical Issues Identified", y)
    for issue in rfi_data.get("issues", []):
        y = draw_section_text(c, f"• {issue}", y)

    # --- Questions (Clarifications) ---
    y = draw_section_title(c, "Required Clarifications", y)
    for q in rfi_data.get("questions", []):
        y = draw_section_text(c, f"• {q}", y)

    # --- Recommendations ---
    y = draw_section_title(c, "AI Recommendations", y)
    for rec in rfi_data.get("recommendations", []):
        y = draw_section_text(c, f"• {rec}", y)

    # --- Footer ---
    c.setFillColor(colors.HexColor("#0A2540"))
    c.setFont("Helvetica", 10)
    c.drawString(40, 30, "Construct AI — Automated RFI Intelligence Suite © 2025")

    c.save()

    return output_path
