POINTS_PER_INCH = 72.0
MM_PER_INCH = 25.4


def points_to_inches(value: float) -> float:
    return value / POINTS_PER_INCH


def points_to_mm(value: float) -> float:
    return points_to_inches(value) * MM_PER_INCH


def inches_to_sqm(area_in_sqft: float) -> float:
    # 1 sq ft = 0.092903 sqm
    return area_in_sqft * 0.092903


def inches_to_mm(value: float) -> float:
    return value * MM_PER_INCH
