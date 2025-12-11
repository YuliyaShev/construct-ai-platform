from fastapi import APIRouter, File, UploadFile, HTTPException

from services.permit_validator_service import validate_permit_drawings

router = APIRouter(prefix="/permit", tags=["Permit Validator"])


@router.post("/check")
async def permit_check(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")
    import tempfile, os

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        result = validate_permit_drawings(tmp_path)
        os.remove(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
