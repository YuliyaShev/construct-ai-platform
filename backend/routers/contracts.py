import os
import tempfile
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel

from services.contract_analysis_service import analyze_contract


class ContractCompareRequest(BaseModel):
    file_path_a: str
    file_path_b: str


router = APIRouter(prefix="/contracts", tags=["Contracts"])


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename or '')[1] or ".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    try:
        result = analyze_contract({"file_path": tmp_path})
        return result
    finally:
        os.remove(tmp_path)


@router.post("/compare")
async def compare(req: ContractCompareRequest):
    # Simple diff placeholder: in production, compute semantic diff
    try:
        res_a = analyze_contract({"file_path": req.file_path_a})
        res_b = analyze_contract({"file_path": req.file_path_b})
        delta_score = res_b["summary"]["risk_score"] - res_a["summary"]["risk_score"]
        return {"version_a": res_a, "version_b": res_b, "delta_risk": delta_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
