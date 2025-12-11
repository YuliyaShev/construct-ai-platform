import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_gantt_pdf(activities, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "Construction Schedule (Gantt)")
    c.setFont("Helvetica", 9)
    y = 730
    for a in activities[:40]:
        c.drawString(40, y, f"{a['id']} {a['name']}")
        c.drawString(300, y, f"{a['start']} -> {a['finish']}")
        y -= 12
        if y < 60:
            c.showPage()
            y = 750
    c.showPage()
    c.save()
