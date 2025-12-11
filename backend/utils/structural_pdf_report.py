import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_structural_risk(summary, critical_elements, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "Structural Risk Report")
    c.setFont("Helvetica", 11)
    y = 730
    for k, v in summary.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 16
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y - 10, "Critical Elements:")
    c.setFont("Helvetica", 10)
    y -= 30
    for ce in critical_elements[:20]:
        c.drawString(40, y, f"{ce.get('id')} - {ce.get('failure_mode')} (D/C {ce.get('D_C_ratio')})")
        y -= 14
        if y < 50:
            c.showPage()
            y = 750
    c.showPage()
    c.save()
