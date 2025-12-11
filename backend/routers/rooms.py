from fastapi import APIRouter, File, UploadFile, HTTPException

from services.rooms_service import detect_rooms_from_pdf

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.post("/detect")
async def detect_rooms(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file.")
        import tempfile, os

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        result = detect_rooms_from_pdf(tmp_path)
        os.remove(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
