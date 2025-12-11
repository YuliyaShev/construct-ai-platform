import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_tender_pdf(trade: str, rfq_letter: str, scope: str, bid_form: str, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, f"Tender Package – {trade}")
    c.setFont("Helvetica", 10)
    y = 740
    for section_title, body in [("RFQ Letter", rfq_letter), ("Scope of Work", scope), ("Bid Form", bid_form)]:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(40, y, section_title)
        y -= 16
        c.setFont("Helvetica", 10)
        for line in body.split("\n"):
            c.drawString(50, y, line[:110])
            y -= 12
            if y < 60:
                c.showPage()
                y = 760
    c.showPage()
    c.save()
