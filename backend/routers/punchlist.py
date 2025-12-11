from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.punch_service import generate_punch_list


class PunchRequest(BaseModel):
    photos: list[str] | None = []


router = APIRouter(prefix="/analysis", tags=["Punch List"])


@router.post("/punch")
async def punch(req: PunchRequest):
    try:
        return generate_punch_list(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
