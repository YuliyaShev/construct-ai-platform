from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.schedule_service import generate_schedule


class ScheduleRequest(BaseModel):
    project_id: str | None = None
    start_date: str = "2025-04-01"
    calendar: dict | None = None
    parallelism: str = "medium"
    weather_risk: str = "medium"


router = APIRouter(prefix="/schedule", tags=["Schedule Generator"])


@router.post("/generate")
async def generate(req: ScheduleRequest):
    try:
        return generate_schedule(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
