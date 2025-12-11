import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_contract_report(summary: dict, risks: list, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "Contract Risk Report")
    c.setFont("Helvetica", 10)
    y = 730
    for k, v in summary.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 14
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y - 10, "High-Risk Clauses:")
    y -= 30
    c.setFont("Helvetica", 10)
    for r in risks[:30]:
        c.drawString(40, y, f"{r.get('section')}: {r.get('reason')}")
        y -= 12
        if y < 60:
            c.showPage()
            y = 760
    c.showPage()
    c.save()
