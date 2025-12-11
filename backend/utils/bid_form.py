from typing import Dict


def build_bid_form(trade: str) -> str:
    return (
        f"Bid Form – {trade}\n"
        "Base Bid: ____________\n"
        "Unit Prices:\n"
        "  - Item 1: ______ per unit\n"
        "Alternates:\n"
        "  - Alt 1 Add/Deduct: ______\n"
        "Allowances: ______\n"
        "Schedule duration: ______ days\n"
        "Addenda acknowledged: ____\n"
        "Signature / Date: ____________________"
    )
