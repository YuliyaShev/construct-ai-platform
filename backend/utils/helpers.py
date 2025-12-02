import re

# -----------------------------
# Extract short text context around a matched value
# -----------------------------
def extract_context(text: str, match: str, window: int = 40) -> str:
    pos = text.find(match)
    if pos == -1:
        return ""
    start = max(0, pos - window)
    end = min(len(text), pos + len(match) + window)
    return text[start:end]


# -----------------------------
# Read UploadFile bytes and rewind pointer
# -----------------------------
async def read_upload_bytes(upload_file):
    data = await upload_file.read()
    upload_file.file.seek(0)
    return data


# -----------------------------
# Dimension regex patterns (shared by endpoints)
# -----------------------------
DIMENSION_PATTERNS = {
    "metric_mm": r"\b(\d+\.?\d*)\s*mm\b",
    "metric_m": r"\b(\d+\.?\d*)\s*m\b",
    "inch_fraction": r"\b(\d+\s+\d+/\d+\s*\")",
    "inch_simple": r"\b(\d+\.?\d*\s*\")",
    "feet_inches": r"\b(\d+'\s*\d+\"|\d+'\-\d+\"|\d+'\s*\d+\/\d+\")",
    "diameter": r"[Øø]\s*\d+\.?\d*",
    "angle_deg": r"\b(\d+°)\b",
    "slope_ratio": r"\b\d+\s*:\s*\d+\b",
    "percent_slope": r"\b\d+%\b"
}
