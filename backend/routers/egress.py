from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.egress_simulation import run_simulation


class EgressRequest(BaseModel):
    file_id: str | int | None = None
    fire_start: dict | None = None
    agent_density: str | None = "normal"
    scenario: str | None = "default"
    geometry: dict | None = None


router = APIRouter(prefix="/egress", tags=["Egress Simulation"])


@router.post("/simulate")
async def simulate(req: EgressRequest):
    if not req.geometry:
        raise HTTPException(status_code=400, detail="Geometry required for simulation.")
    result = run_simulation(req.geometry, req.fire_start or {}, req.agent_density or "normal")
    return result
