from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import os
import datetime

REPORT_DIR = "project_data/reports"
os.makedirs(REPORT_DIR, exist_ok=True)


def generate_shop_drawing_report(data: dict):
    """Generate a PDF report for Shop Drawing Checker."""

    filename = f"shop_drawing_report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(REPORT_DIR, filename)

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    elements = []

    title = Paragraph("<b><font size=16>Construct AI — Shop Drawing Analysis Report</font></b>", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 12))

    summary = data.get("summary", "No summary available.")
    elements.append(Paragraph(f"<b>Summary</b><br/>{summary}", styles["BodyText"]))
    elements.append(Spacer(1, 12))

    # Add sections
    def add_section(header, items, color):
        if not items:
            return

        elements.append(Paragraph(f"<b><font color='{color}'>{header}</font></b>", styles["Heading3"]))
        elements.append(Spacer(1, 6))

        for item in items:
            elements.append(Paragraph(f"• {item}", styles["BodyText"]))

        elements.append(Spacer(1, 12))

    add_section("Critical Issues",             data.get("critical_issues"),     "red")
    add_section("Dimension Conflicts",         data.get("dimension_conflicts"), "orange")
    add_section("Missing Information",         data.get("missing_information"), "gold")
    add_section("Code Violations",             data.get("code_violations"),     "purple")
    add_section("Detailing Errors",            data.get("detailing_errors"),    "blue")
    add_section("Structural Conflicts",        data.get("structural_conflicts"), "gray")

    # RFI section
    rfi_list = data.get("rfi_to_generate", [])
    if rfi_list:
        elements.append(Paragraph("<b><font color='green'>RFI Suggestions</font></b>", styles["Heading3"]))
        elements.append(Spacer(1, 6))

        for rfi in rfi_list:
            elements.append(Paragraph(f"<b>{rfi.get('id')}</b>: {rfi.get('title')}", styles["BodyText"]))
            elements.append(Paragraph(f"<i>Question:</i> {rfi.get('question')}", styles["BodyText"]))
            elements.append(Paragraph(f"<i>Reason:</i> {rfi.get('reason')}", styles["BodyText"]))
            pages = ", ".join(map(str, rfi.get("related_pages", [])))
            elements.append(Paragraph(f"<i>Pages:</i> {pages}", styles["BodyText"]))
            elements.append(Spacer(1, 12))

    doc.build(elements)
    return filepath
