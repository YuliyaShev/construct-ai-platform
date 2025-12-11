from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.safety_service import run_safety_detection


class SafetyRequest(BaseModel):
    region: str = "USA"
    hazard_types: list[str] = []
    confidence_threshold: float = 0.65
    images: list[str] | None = []


router = APIRouter(prefix="/analysis", tags=["Safety"])


@router.post("/safety-detect")
async def safety_detect(req: SafetyRequest):
    try:
        return run_safety_detection(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
