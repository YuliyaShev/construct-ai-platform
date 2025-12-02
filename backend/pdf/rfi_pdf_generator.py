import os
from datetime import datetime
from typing import Dict, List, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)

from pdf.rfi_pdf_templates import build_styles, ERROR_COLOR, WARNING_COLOR, INFO_COLOR


class RFIPDFGenerator:
    """Generates polished RFI PDFs using reportlab platypus."""

    def __init__(self, logo_path: Optional[str] = None):
        self.logo_path = logo_path
        self.styles = build_styles()

    def add_header(self, story: List, rfi: Dict):
        row = []
        if self.logo_path and os.path.exists(self.logo_path):
            row.append(Image(self.logo_path, width=1.2 * inch, height=0.6 * inch))
        else:
            row.append(Paragraph("Construct AI", self.styles["HeaderStyle"]))

        title_text = f"Request for Information (RFI) — {rfi.get('rfi_number', 'AUTO')}"
        row.append(Paragraph(title_text, self.styles["TitleStyle"]))

        table = Table([row], colWidths=[1.6 * inch, 4.9 * inch])
        table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
        story.append(table)
        story.append(Spacer(1, 0.2 * inch))

    def add_project_info(self, story: List, rfi: Dict):
        data = [
            ["File", rfi.get("related_file") or rfi.get("filename") or "-"],
            ["Page", str(rfi.get("page", "-"))],
            ["Drawing Reference", rfi.get("drawing_reference") or "-"],
            ["Date", datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")],
        ]
        table = Table(data, colWidths=[1.5 * inch, 5.0 * inch])
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8fafc")),
                    ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#475569")),
                    ("TEXTCOLOR", (1, 0), (1, -1), colors.black),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (-1, -1), 9),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ]
            )
        )
        story.append(table)
        story.append(Spacer(1, 0.2 * inch))

    def add_issue_summary(self, story: List, rfi: Dict):
        sev = (rfi.get("issue_type") or "").lower()
        if "error" in sev:
            box_style = self.styles["ErrorBox"]
        elif "warn" in sev:
            box_style = self.styles["WarningBox"]
        else:
            box_style = self.styles["InfoBox"]

        story.append(Paragraph("Issue Summary", self.styles["SectionTitle"]))
        story.append(Paragraph(rfi.get("issue_summary") or rfi.get("description") or "No summary provided.", self.styles["BodyText"]))
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph(sev.title() or "Info", box_style))
        story.append(Spacer(1, 0.2 * inch))

    def add_issue_details(self, story: List, rfi: Dict):
        story.append(Paragraph("Detailed Description", self.styles["SectionTitle"]))
        story.append(Paragraph(rfi.get("description") or "No detailed description provided.", self.styles["BodyText"]))
        story.append(Spacer(1, 0.1 * inch))
        if rfi.get("bbox"):
            bbox_text = f"Bounding Box (page {rfi.get('page', '-')}) — {rfi.get('bbox')}"
            story.append(Paragraph(bbox_text, self.styles["SmallText"]))
        story.append(Spacer(1, 0.2 * inch))

    def add_recommended_actions(self, story: List, rfi: Dict):
        story.append(Paragraph("Question to Engineer / Required Information", self.styles["SectionTitle"]))
        story.append(Paragraph(rfi.get("question") or "No question provided.", self.styles["BodyText"]))
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph("Recommendation", self.styles["SectionTitle"]))
        story.append(Paragraph(rfi.get("recommendation") or "No recommendation provided.", self.styles["BodyText"]))
        if rfi.get("required_from_engineer"):
            story.append(Spacer(1, 0.05 * inch))
            story.append(Paragraph(f"Required from Engineer: {rfi.get('required_from_engineer')}", self.styles["BodyText"]))
        story.append(Spacer(1, 0.2 * inch))

    def add_heatmap_image(self, story: List, attachments: List[Dict]):
        if not attachments:
            return
        img_path = None
        for att in attachments:
            if att.get("image_path") and os.path.exists(att["image_path"]):
                img_path = att["image_path"]
                break
        if not img_path:
            return
        story.append(Paragraph("Highlighted Issue Area", self.styles["SectionTitle"]))
        story.append(Image(img_path, width=5.5 * inch, height=3.5 * inch))
        story.append(Spacer(1, 0.2 * inch))

    def add_footer(self, story: List):
        footer_text = f"Generated by Construct AI — {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph(footer_text, self.styles["SmallText"]))

    def generate_rfi_pdf(self, rfi_data: Dict, output_path: str):
        doc = SimpleDocTemplate(output_path, pagesize=LETTER, leftMargin=0.75 * inch, rightMargin=0.75 * inch, topMargin=0.75 * inch, bottomMargin=0.75 * inch)
        story: List = []

        self.add_header(story, rfi_data)
        self.add_project_info(story, rfi_data)
        self.add_issue_summary(story, rfi_data)
        self.add_issue_details(story, rfi_data)
        self.add_recommended_actions(story, rfi_data)
        self.add_heatmap_image(story, rfi_data.get("attachments", []))
        self.add_footer(story)

        doc.build(story)
        return output_path
