from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


class ShopDrawingPDFExporter:
    """
    Generates a clean Procore-style PDF summary report.
    """

    def generate_pdf(self, output_path: str, data: dict):
        c = canvas.Canvas(output_path, pagesize=A4)

        c.setFont("Helvetica-Bold", 16)
        c.drawString(40, 800, "Shop Drawing Analysis Report")

        y = 770
        c.setFont("Helvetica", 11)

        # Missing Dimensions
        c.drawString(40, y, "Missing Dimensions:")
        y -= 20
        for item in data.get("missing_dimensions", []):
            c.drawString(60, y, f"- {item}")
            y -= 15

        # Issues
        y -= 10
        c.drawString(40, y, "Detected Issues:")
        y -= 20
        for item in data.get("issues", []):
            c.drawString(60, y, f"- {item}")
            y -= 15

        # Summary
        y -= 10
        c.drawString(40, y, "AI Summary:")
        y -= 20

        summary = data.get("summary", "")
        for line in summary.split("\n"):
            c.drawString(60, y, line)
            y -= 15

        c.save()
