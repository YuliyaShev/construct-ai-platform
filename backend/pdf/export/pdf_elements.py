import os
from datetime import datetime
from typing import Dict, List

from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, Image, PageBreak

from pdf.export.pdf_styles import build_export_styles, ERROR_COLOR, WARNING_COLOR, INFO_COLOR

styles = build_export_styles()


def draw_header(story: List, file_metadata: Dict):
    logo_path = file_metadata.get("logo_path")
    row = []
    if logo_path and os.path.exists(logo_path):
        row.append(Image(logo_path, width=1.2 * inch, height=0.6 * inch))
    else:
        row.append(Paragraph("Construct AI", styles["SubHeader"]))
    title = Paragraph("AI Engineering Report", styles["TitleStyle"])
    meta = Paragraph(f"File: {file_metadata.get('name', '-')}", styles["SmallGreyText"])
    row.append(Paragraph(f"{title}<br/>{meta}", styles["NormalText"]))
    table = Table([row], colWidths=[1.6 * inch, 4.9 * inch])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(table)
    story.append(Paragraph(datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"), styles["SmallGreyText"]))
    story.append(Spacer(1, 0.2 * inch))


def draw_bom_section(story: List, bom: List[Dict]):
    story.append(Paragraph("Bill of Materials", styles["SectionHeader"]))
    if not bom:
        story.append(Paragraph("No BOM items detected.", styles["NormalText"]))
        return

    header = [
        Paragraph("Item", styles["TableHeaderStyle"]),
        Paragraph("Description", styles["TableHeaderStyle"]),
        Paragraph("Material", styles["TableHeaderStyle"]),
        Paragraph("Dimensions", styles["TableHeaderStyle"]),
        Paragraph("Qty", styles["TableHeaderStyle"]),
    ]
    data = [header]
    for idx, item in enumerate(bom):
        shade = colors.HexColor("#f8fafc") if idx % 2 == 0 else colors.white
        row = [
            Paragraph(item.get("item") or "-", styles["NormalText"]),
            Paragraph(item.get("description") or "-", styles["NormalText"]),
            Paragraph(item.get("material") or "-", styles["NormalText"]),
            Paragraph(item.get("dimensions") or "-", styles["NormalText"]),
            Paragraph(str(item.get("quantity") or ""), styles["NormalText"]),
        ]
        data.append(row)
    col_widths = [1.2 * inch, 2.4 * inch, 1.0 * inch, 1.0 * inch, 0.6 * inch]
    table = Table(data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.2 * inch))


def _severity_box(severity: str) -> Paragraph:
    sev = (severity or "").lower()
    if "error" in sev:
        return Paragraph(sev.title() or "Error", styles["ErrorBoxStyle"])
    if "warn" in sev:
        return Paragraph(sev.title() or "Warning", styles["WarningBoxStyle"])
    return Paragraph(sev.title() or "Info", styles["InfoBoxStyle"])


def draw_issue_list(story: List, issues: List[Dict]):
    story.append(Paragraph("Issues & Findings", styles["SectionHeader"]))
    if not issues:
        story.append(Paragraph("No issues detected.", styles["NormalText"]))
        return

    for issue in issues:
        story.append(_severity_box(issue.get("severity") or issue.get("type")))
        story.append(Paragraph(issue.get("message") or issue.get("issue_summary") or "No message", styles["NormalText"]))
        meta = f"Page: {issue.get('page', '-')}, BBox: {issue.get('bbox') or issue.get('resolved_bbox') or '-'}"
        story.append(Paragraph(meta, styles["SmallGreyText"]))
        if issue.get("recommended_action"):
            story.append(Paragraph(f"Action: {issue['recommended_action']}", styles["NormalText"]))
        if issue.get("llm_reasoning"):
            story.append(Paragraph(f"Reasoning: {issue['llm_reasoning']}", styles["SmallGreyText"]))
        story.append(Spacer(1, 0.15 * inch))


def draw_heatmap_section(story: List, heatmap_images: List[Dict]):
    story.append(Paragraph("Heatmap Highlights", styles["SectionHeader"]))
    if not heatmap_images:
        story.append(Paragraph("No heatmap images available.", styles["NormalText"]))
        return
    for img in heatmap_images:
        path = img.get("image_path")
        if not path or not os.path.exists(path):
            continue
        story.append(Image(path, width=5.5 * inch, height=3.5 * inch))
        caption = f"Page {img.get('page', '-')}, BBox {img.get('bbox', '-')}"
        story.append(Paragraph(caption, styles["SmallGreyText"]))
        story.append(Spacer(1, 0.15 * inch))


def draw_navigation_links(story: List, navigation_map: Dict):
    story.append(Paragraph("Detail / Section Navigation", styles["SectionHeader"]))
    links = navigation_map.get("jump_links") if navigation_map else []
    if not links:
        story.append(Paragraph("No navigation links available.", styles["NormalText"]))
        return
    header = [
        Paragraph("Source Page", styles["TableHeaderStyle"]),
        Paragraph("Target Page", styles["TableHeaderStyle"]),
        Paragraph("Label", styles["TableHeaderStyle"]),
    ]
    data = [header]
    for idx, link in enumerate(links):
        data.append([
            Paragraph(str(link.get("source_page")), styles["NormalText"]),
            Paragraph(str(link.get("target_page")), styles["NormalText"]),
            Paragraph(link.get("label") or "-", styles["NormalText"]),
        ])
    table = Table(data, colWidths=[1.0 * inch, 1.0 * inch, 3.5 * inch], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.2 * inch))


def draw_summary_section(story: List, summary: str):
    story.append(Paragraph("Summary of Findings", styles["SectionHeader"]))
    story.append(Paragraph(summary or "No summary available.", styles["NormalText"]))
    story.append(Spacer(1, 0.1 * inch))
