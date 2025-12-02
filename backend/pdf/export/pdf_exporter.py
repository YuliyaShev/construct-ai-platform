import os
from typing import Dict, List

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Spacer, PageBreak

from pdf.export import pdf_elements as el
from pdf.export.pdf_styles import build_export_styles


class PDFExporter:
    """Generates a full engineering report PDF."""

    def __init__(self):
        self.styles = build_export_styles()

    def generate_full_report(self, export_data: Dict, output_path: str):
        doc = SimpleDocTemplate(
            output_path,
            pagesize=LETTER,
            leftMargin=0.75 * inch,
            rightMargin=0.75 * inch,
            topMargin=0.75 * inch,
            bottomMargin=0.75 * inch,
        )
        story: List = []

        el.draw_header(story, export_data.get("file", {}))
        el.draw_summary_section(story, export_data.get("summary", ""))
        el.draw_bom_section(story, export_data.get("bom", []))
        story.append(Spacer(1, 0.2 * inch))
        el.draw_issue_list(story, export_data.get("issues", []))
        story.append(PageBreak())
        el.draw_heatmap_section(story, export_data.get("heatmap_images", []))
        el.draw_navigation_links(story, {"jump_links": export_data.get("navigation_links", [])})

        doc.build(story)
        return output_path
