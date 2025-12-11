import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_punch_report(summary: dict, items: list, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "QA/QC Punch List Report")
    c.setFont("Helvetica", 10)
    y = 730
    for k, v in summary.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 14
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y - 10, "Items:")
    y -= 30
    c.setFont("Helvetica", 10)
    for p in items[:40]:
        c.drawString(40, y, f"{p.get('trade')} - {p.get('description')} ({p.get('severity')})")
        y -= 12
        if y < 60:
            c.showPage()
            y = 760
    c.showPage()
    c.save()
