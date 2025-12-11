def apply_escalation(base_cost: float, years: float, rate: float = 0.035) -> float:
    return base_cost * ((1 + rate) ** years)
