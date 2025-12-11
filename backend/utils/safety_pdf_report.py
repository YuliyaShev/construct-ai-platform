import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_safety_pdf(summary: dict, hazards: list, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "Safety Hazard Report")
    c.setFont("Helvetica", 10)
    y = 730
    for k, v in summary.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 14
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y - 10, "Hazards:")
    y -= 30
    c.setFont("Helvetica", 10)
    for h in hazards[:40]:
        c.drawString(40, y, f"{h.get('hazard_type')} – {h.get('risk_rating')} ({h.get('risk_score')})")
        y -= 12
        if y < 60:
            c.showPage()
            y = 760
    c.showPage()
    c.save()
