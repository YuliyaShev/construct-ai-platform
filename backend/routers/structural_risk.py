from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.structural_risk_service import run_structural_risk_analysis


class StructuralRiskRequest(BaseModel):
    project_id: str | None = None
    scenario: str | None = "gravity"
    location: str | None = None


router = APIRouter(prefix="/structural", tags=["Structural Risk"])


@router.post("/risk")
async def structural_risk(req: StructuralRiskRequest):
    try:
        return run_structural_risk_analysis(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
