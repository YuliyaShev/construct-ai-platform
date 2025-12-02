# services/shop_drawing/shop_checker.py

import fitz  # PyMuPDF


class ShopDrawingCheckerService:
    """
    Extracts text and runs AI-based checks on shop drawings.
    """

    def extract_text(self, file_path: str) -> str:
        """Extract all text from PDF."""
        doc = fitz.open(file_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
        return full_text

    def analyze_shop_drawing(self, text: str) -> dict:
        """
        Simulates an AI analysis (placeholder).
        Replace with actual OpenAI API when ready.
        """

        # Fake detection rules for now
        missing_dimensions = []
        issues = []

        if "mm" not in text and "in" not in text:
            missing_dimensions.append("No dimensions detected")

        if "REV" not in text:
            issues.append("Revision number not found")

        summary = (
            "The drawing was analyzed. Missing dimensions or issues were detected. "
            "Upgrade to the full AI mode to enable deep engineering analysis."
        )

        return {
            "missing_dimensions": missing_dimensions,
            "issues": issues,
            "summary": summary,
        }
