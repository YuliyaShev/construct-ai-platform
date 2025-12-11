DEFAULT_CREWS = {
    "excavation": {"crew_size": 6, "productivity": 150},  # m3 per day
    "concrete": {"crew_size": 8, "productivity": 80},  # m3 per day
    "steel": {"crew_size": 6, "productivity": 12},  # tonnes per day
    "cladding": {"crew_size": 6, "productivity": 120},  # m2 per day
    "drywall": {"crew_size": 6, "productivity": 300},  # m2 per day
}

SEQUENCE_ORDER = [
    "Excavation",
    "Foundation",
    "Level 1 Slab",
    "Level 2 Slab",
    "Roof",
    "Curtain Wall",
    "MEP Rough-In",
    "Drywall",
    "Finishing",
]
