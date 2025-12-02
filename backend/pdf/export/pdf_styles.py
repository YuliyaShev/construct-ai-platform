from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet

ERROR_COLOR = colors.HexColor("#b71c1c")
WARNING_COLOR = colors.HexColor("#f57f17")
INFO_COLOR = colors.HexColor("#1565c0")
MUTED = colors.HexColor("#475569")


def build_export_styles():
    base = getSampleStyleSheet()
    return {
        "TitleStyle": ParagraphStyle(
            "TitleStyle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=12,
        ),
        "SectionHeader": ParagraphStyle(
            "SectionHeader",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=8,
            spaceBefore=12,
        ),
        "SubHeader": ParagraphStyle(
            "SubHeader",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#1e293b"),
            spaceAfter=6,
        ),
        "NormalText": ParagraphStyle(
            "NormalText",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=colors.black,
            spaceAfter=6,
        ),
        "SmallGreyText": ParagraphStyle(
            "SmallGreyText",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "TableHeaderStyle": ParagraphStyle(
            "TableHeaderStyle",
            parent=base["Heading4"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.white,
        ),
        "ErrorBoxStyle": ParagraphStyle(
            "ErrorBoxStyle",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            backColor=ERROR_COLOR,
            textColor=colors.white,
            leading=12,
        ),
        "WarningBoxStyle": ParagraphStyle(
            "WarningBoxStyle",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            backColor=WARNING_COLOR,
            textColor=colors.black,
            leading=12,
        ),
        "InfoBoxStyle": ParagraphStyle(
            "InfoBoxStyle",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            backColor=INFO_COLOR,
            textColor=colors.white,
            leading=12,
        ),
    }
