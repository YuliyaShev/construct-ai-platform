from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.detail_generator import generate_detail


class DetailRequest(BaseModel):
    type: str
    file_id: str | int | None = None
    reference_location: dict | None = None
    parameters: dict | None = None


router = APIRouter(prefix="/details", tags=["Auto Details"])


@router.post("/generate")
async def generate(req: DetailRequest):
    try:
        return generate_detail(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
