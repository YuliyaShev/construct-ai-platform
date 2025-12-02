from fastapi import APIRouter, UploadFile, File, HTTPException, Request

from services.bom.bom_builder import build_bom_from_pdf

router = APIRouter(tags=["BOM"])


@router.post("/extract-bom")
async def extract_bom(request: Request, file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    try:
        return build_bom_from_pdf(pdf_bytes, request.app.state.client)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
