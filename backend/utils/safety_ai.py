from typing import List, Dict


def compute_risk_scores(hazards: List[Dict]) -> List[Dict]:
    for h in hazards:
        sev = h.get("severity_score", 0)
        prob = h.get("probability_score", 0)
        score = 0.6 * sev + 0.4 * prob
        if score >= 80:
            rating = "Critical"
        elif score >= 60:
            rating = "High"
        elif score >= 40:
            rating = "Medium"
        else:
            rating = "Low"
        h["risk_rating"] = rating
        h["risk_score"] = round(score, 1)
    return hazards


def enrich_hazards(hazards: List[Dict]) -> List[Dict]:
    """
    Placeholder AI enrichment. In production, call /analysis/safety-detect with model context.
    """
    for h in hazards:
        if h["hazard_type"] == "fall_edge":
            h["recommended_action"] = "Install guardrail or fall arrest system"
        elif h["hazard_type"] == "crane_radius_intrusion":
            h["recommended_action"] = "Enforce exclusion zone and spotter during picks"
        else:
            h["recommended_action"] = "Correct per OSHA/CSA requirements"
        h["deadline_days"] = 1 if h.get("risk_rating") in ("Critical", "High") else 7
    return hazards
