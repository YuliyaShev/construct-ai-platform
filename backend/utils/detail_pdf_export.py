import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_detail_pdf(svg_str: str, output_path: str):
    # Simple placeholder PDF; does not rasterize SVG.
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, 760, "Auto-Generated Detail")
    c.setFont("Helvetica", 10)
    c.drawString(40, 740, "Preview not rendered; see SVG for vector detail.")
    c.drawString(40, 720, "Embed SVG rendering in production.")
    c.showPage()
    c.save()
