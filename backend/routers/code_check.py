from fastapi import APIRouter, File, UploadFile, HTTPException

from services.code_check_service import check_code_compliance

router = APIRouter(prefix="/code", tags=["Code Compliance"])


@router.post("/check")
async def code_check(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")
    import tempfile, os

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        result = check_code_compliance(tmp_path)
        os.remove(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
