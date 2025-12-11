from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.cost_service import run_cost_estimate


class CostRequest(BaseModel):
    project_id: str | None = None
    location: str = "Ontario"
    labor_type: str = "union"
    complexity: str = "medium"
    escalation_years: float = 0
    contingency: float = 0.1


router = APIRouter(prefix="/cost", tags=["Cost Estimator"])


@router.post("/estimate")
async def estimate(req: CostRequest):
    try:
        return run_cost_estimate(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
