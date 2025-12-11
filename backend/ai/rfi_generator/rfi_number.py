import datetime


def generate_rfi_number(last_number: int | None = None) -> str:
    """Generate an RFI number in format RFI-YYYY-XXXX."""
    year = datetime.datetime.utcnow().year
    seq = (last_number or 0) + 1
    return f"RFI-{year}-{seq:04d}"
