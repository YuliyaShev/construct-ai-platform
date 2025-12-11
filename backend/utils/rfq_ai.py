from typing import Dict


def generate_rfq_letter(trade: str, project_location: str, contract_type: str, delivery_method: str) -> str:
    return (
        f"Invitation to Bid – {trade}\n"
        f"Project Location: {project_location}\n"
        f"Contract Type: {contract_type}, Delivery Method: {delivery_method}\n"
        "Please submit your proposal including pricing, schedule, exclusions, and clarifications.\n"
        "Questions/RFIs are due 10 days prior to bid; bids due per instructions. Mandatory site visit if applicable."
    )
