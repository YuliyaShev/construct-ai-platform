import os
import uuid
from typing import Dict, List

from utils.scope_rules import build_scope
from utils.rfq_ai import generate_rfq_letter
from utils.bid_form import build_bid_form
from utils.tender_export import export_tender_pdf
from utils.qto_model import collect_qto

TENDER_DIR = os.path.join(os.path.dirname(__file__), "..", "project_data", "tender")
os.makedirs(TENDER_DIR, exist_ok=True)


def generate_tender(payload: Dict) -> Dict:
    trades: List[str] = payload.get("trades", [])
    contract_type = payload.get("contract_type", "lump_sum")
    project_location = payload.get("project_location", "Ontario")
    delivery_method = payload.get("delivery_method", "DBB")

    qto = collect_qto()
    packages = []

    tender_id = f"TD-{uuid.uuid4().hex[:4].upper()}"

    for trade in trades:
        scope = build_scope(trade, qto)
        rfq_letter = generate_rfq_letter(trade, project_location, contract_type, delivery_method)
        bid_form = build_bid_form(trade)
        pdf_path = os.path.join(TENDER_DIR, f"{tender_id}-{trade[:2].upper()}.pdf")
        export_tender_pdf(trade, rfq_letter, scope, bid_form, pdf_path)
        packages.append(
            {
                "name": trade,
                "rfq_letter": rfq_letter,
                "scope_of_work": scope,
                "bid_form": bid_form,
                "pdf": f"/files/tender/{os.path.basename(pdf_path)}",
            }
        )

    return {
        "tender_id": tender_id,
        "trades": packages,
        "full_package_pdf": None,
    }
