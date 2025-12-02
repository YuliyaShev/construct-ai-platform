from fastapi import APIRouter, UploadFile, File, HTTPException

from services.dimensions.dimension_extractor import extract_dimensions_from_pdf

router = APIRouter(tags=["Dimensions"])


@router.post("/extract-dimensions")
@router.post("/dimensions/extract")
async def extract_dimensions(file: UploadFile = File(...)):
    """Extract all dimensions from a PDF drawing."""
    if "pdf" not in file.content_type:
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")

    pdf_bytes = await file.read()

    results = await extract_dimensions_from_pdf(pdf_bytes)

    return {
        "total_found": len(results),
        "dimensions": results
    }
