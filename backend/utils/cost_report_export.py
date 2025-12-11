import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_cost_report(summary, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "AI Cost Estimate Summary")
    c.setFont("Helvetica", 11)
    y = 730
    for k, v in summary.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 18
    c.showPage()
    c.save()
