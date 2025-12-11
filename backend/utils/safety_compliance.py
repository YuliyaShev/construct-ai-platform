OSHA_MAP = {
    "fall_edge": "29 CFR 1926.501(b)(1)",
    "crane_radius_intrusion": "29 CFR 1926.1411",
    "PPE": "29 CFR 1926.95",
}

CSA_MAP = {
    "fall_edge": "CSA Z259",
    "crane_radius_intrusion": "CSA Z150",
    "PPE": "CSA Z94.1",
}


def match_osha_csa(hazard_type: str, region: str):
    osha = OSHA_MAP.get(hazard_type, "29 CFR 1926")
    csa = CSA_MAP.get(hazard_type, "CSA")
    return osha if region == "USA" else csa
