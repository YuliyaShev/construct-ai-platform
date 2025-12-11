import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_logistics_pdf(summary: dict, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "Site Logistics Plan")
    c.setFont("Helvetica", 10)
    y = 730
    for k, v in summary.items():
        if isinstance(v, (str, int, float)):
            c.drawString(40, y, f"{k}: {v}")
            y -= 14
    c.showPage()
    c.save()
