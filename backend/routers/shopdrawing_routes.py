from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

router = APIRouter()


@router.post("/shop-drawing/export-pdf")
async def export_pdf(payload: dict):
    data = payload.get("data", {})

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph("<b>Shop Drawing Checker Report</b>", styles["Title"]))
    elements.append(Spacer(1, 20))

    # Render all categories if exist
    def add_section(title, items):
        if not items:
            return
        elements.append(Paragraph(f"<b>{title}</b>", styles["Heading2"]))
        for item in items:
            elements.append(Paragraph(f"- {item}", styles["Normal"]))
        elements.append(Spacer(1, 12))

    elements.append(Paragraph("Summary", styles["Heading2"]))
    elements.append(Paragraph(data.get("summary", "No summary"), styles["Normal"]))
    elements.append(Spacer(1, 12))

    add_section("Critical Issues", data.get("critical_issues"))
    add_section("Missing Information", data.get("missing_information"))
    add_section("Code Violations", data.get("code_violations"))
    add_section("Detailing Errors", data.get("detailing_errors"))
    add_section("Structural Conflicts", data.get("structural_conflicts"))
    add_section("Dimension Conflicts", data.get("dimension_conflicts"))
    add_section("RFIs to Generate", data.get("rfi_to_generate"))
    add_section("AI Recommendations", data.get("recommendations"))

    doc.build(elements)

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=ShopDrawingReport.pdf"}
    )
