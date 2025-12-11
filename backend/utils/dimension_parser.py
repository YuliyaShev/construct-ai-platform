import re

IN_PER_MM = 1 / 25.4


def parse_length(text: str) -> float | None:
    """
    Parse length strings:
    - 42 1/4"
    - 3'-6"
    - 1067 mm
    - 42.25
    Returns inches.
    """
    if not text:
        return None
    t = text.strip().lower()

    # feet-inches pattern 3'-6"
    ft_in = re.match(r"(\d+)\s*'\s*(\d+(?:\s*\d+/\d+)?)?\"?", t)
    if ft_in:
        feet = int(ft_in.group(1))
        inches = _fraction_to_in(ft_in.group(2) or "0")
        return feet * 12 + inches

    # fraction inches 42 1/4"
    inch_frac = re.match(r"(\d+)\s+(\d+/\d+)\s*\"", t)
    if inch_frac:
        base = float(inch_frac.group(1))
        frac = _fraction_to_in(inch_frac.group(2))
        return base + frac

    # plain inches 42" or 42.5"
    inch_plain = re.match(r"(\d+(?:\.\d+)?)\s*\"", t)
    if inch_plain:
        return float(inch_plain.group(1))

    # mm
    mm_pat = re.match(r"(\d+(?:\.\d+)?)\s*mm", t)
    if mm_pat:
        mm = float(mm_pat.group(1))
        return mm * IN_PER_MM

    # decimal only
    dec = re.match(r"(\d+(?:\.\d+)?)$", t)
    if dec:
        return float(dec.group(1))

    return None


def _fraction_to_in(frac: str) -> float:
    if not frac:
        return 0.0
    if "/" in frac:
        num, den = frac.split("/")
        return float(num) / float(den)
    return float(frac)
