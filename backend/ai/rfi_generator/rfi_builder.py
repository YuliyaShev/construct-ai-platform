from typing import Dict

from ai.rfi_generator.rfi_number import generate_rfi_number


def build_rfi(issue: Dict, ai_text: Dict, last_number: int | None = None) -> Dict:
    num = generate_rfi_number(last_number)
    return {
        "rfi_number": num,
        "title": ai_text.get("title") or f"RFI for {issue.get('category', 'issue')}",
        "description": ai_text.get("description") or issue.get("description"),
        "question": ai_text.get("question") or "",
        "suggested_fix": ai_text.get("suggested_fix") or "",
        "page": issue.get("page"),
        "x": issue.get("x"),
        "y": issue.get("y"),
        "severity": issue.get("severity") or "info",
        "status": "Open",
    }
