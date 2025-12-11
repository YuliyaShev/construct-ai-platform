from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.tender_service import generate_tender


class TenderRequest(BaseModel):
    trades: list[str]
    contract_type: str = "lump_sum"
    project_location: str = "Ontario"
    delivery_method: str = "DBB"
    include_safety_requirements: bool | None = True
    include_submittals: bool | None = True


router = APIRouter(prefix="/tender", tags=["Tender/RFQ"])


@router.post("/generate")
async def generate(req: TenderRequest):
    try:
        return generate_tender(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
