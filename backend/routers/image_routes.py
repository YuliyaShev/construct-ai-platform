from fastapi import APIRouter, UploadFile, File, HTTPException, Request

from services.images.image_analyzer import analyze_image

router = APIRouter(tags=["Images"])


@router.post("/analyze-image")
async def analyze_image_endpoint(request: Request, file: UploadFile = File(...)):
    file_bytes = await file.read()
    try:
        return analyze_image(file_bytes, file.content_type, request.app.state.client)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
