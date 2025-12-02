from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import uuid
from services.pdf.rfi_exporter import export_rfi_pdf

router = APIRouter(prefix="/rfi", tags=["RFI"])

RFI_EXPORT_DIR = "project_data/rfi_export"
os.makedirs(RFI_EXPORT_DIR, exist_ok=True)


@router.post("/export-pdf")
async def export_rfi_to_pdf(rfi_data: dict):
    """
    Generates a premium AI-style RFI PDF and returns it.
    """
    try:
        file_id = str(uuid.uuid4())
        output_path = os.path.join(RFI_EXPORT_DIR, f"rfi_{file_id}.pdf")

        export_rfi_pdf(rfi_data, output_path)

        return FileResponse(
            output_path,
            filename=f"RFI_{file_id}.pdf",
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
