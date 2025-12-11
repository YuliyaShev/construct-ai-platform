from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.logistics_service import generate_logistics


class LogisticsRequest(BaseModel):
    crane_type: str = "tower"
    parking_spaces: int = 20
    site_constraints: list[str] | None = []
    truck_delivery_hours: str | None = "7:00–15:00"
    hoist_required: bool = True


router = APIRouter(prefix="/logistics", tags=["Site Logistics"])


@router.post("/generate")
async def generate(req: LogisticsRequest):
    try:
        return generate_logistics(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
