import math
from typing import List


def angle_between(v1, v2) -> float:
    dot = v1[0] * v2[0] + v1[1] * v2[1]
    mag1 = math.hypot(v1[0], v1[1])
    mag2 = math.hypot(v2[0], v2[1])
    if mag1 == 0 or mag2 == 0:
        return 0.0
    cos = max(min(dot / (mag1 * mag2), 1.0), -1.0)
    return math.degrees(math.acos(cos))


def classify_angle(deg: float) -> float:
    # Snap to common angles
    for target in [180, 90, 45, 22.5]:
        if abs(deg - target) < 5:
            return target
    return round(deg, 1)
