from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet

ERROR_COLOR = colors.HexColor("#b71c1c")
WARNING_COLOR = colors.HexColor("#f57f17")
INFO_COLOR = colors.HexColor("#1565c0")
MUTED_TEXT = colors.HexColor("#455a64")
TITLE_COLOR = colors.HexColor("#0f172a")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "TitleStyle": ParagraphStyle(
            "TitleStyle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=TITLE_COLOR,
            spaceAfter=12,
        ),
        "HeaderStyle": ParagraphStyle(
            "HeaderStyle",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            textColor=MUTED_TEXT,
            spaceAfter=6,
        ),
        "SectionTitle": ParagraphStyle(
            "SectionTitle",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=TITLE_COLOR,
            spaceAfter=4,
            spaceBefore=8,
        ),
        "BodyText": ParagraphStyle(
            "BodyText",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.black,
            spaceAfter=6,
        ),
        "SmallText": ParagraphStyle(
            "SmallText",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=MUTED_TEXT,
            spaceAfter=4,
        ),
        "TableHeader": ParagraphStyle(
            "TableHeader",
            parent=base["Heading4"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.white,
        ),
        "WarningBox": ParagraphStyle(
            "WarningBox",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.black,
            backColor=WARNING_COLOR,
            leading=12,
        ),
        "ErrorBox": ParagraphStyle(
            "ErrorBox",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.white,
            backColor=ERROR_COLOR,
            leading=12,
        ),
        "InfoBox": ParagraphStyle(
            "InfoBox",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.white,
            backColor=INFO_COLOR,
            leading=12,
        ),
    }
