REGIONAL_FACTORS = {
    "BC": 1.08,
    "Ontario": 1.05,
    "California": 1.20,
    "Texas": 0.95,
    "Florida": 1.12,
}


def get_region_factor(location: str) -> float:
    return REGIONAL_FACTORS.get(location, 1.0)
