from typing import Dict, List

from utils.permit_rules import REQUIRED_SHEETS, REQUIRED_NOTES
from utils.plan_index_extractor import find_sheet_matches


def detect_missing_sheets(text: str) -> List[str]:
    missing = []
    upper = text.upper()
    for category, patterns in REQUIRED_SHEETS.items():
        for p in patterns:
            if p.upper() not in upper:
                missing.append(f"{category.upper()} - {p}")
    return missing


def detect_missing_notes(text: str) -> List[str]:
    missing = []
    upper = text.upper()
    for note in REQUIRED_NOTES:
        if note.upper() not in upper:
            missing.append(note.title())
    return missing
