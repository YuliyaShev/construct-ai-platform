from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import os

from services.rfi_report_service import generate_rfi_report

router = APIRouter(prefix="/rfi", tags=["RFI Reports"])


@router.get("/{rfi_id}/report")
async def get_rfi_report(rfi_id: int):
    try:
        pdf_path = generate_rfi_report(rfi_id)
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Failed to generate report")
        return StreamingResponse(open(pdf_path, "rb"), media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="RFI_{rfi_id}_report.pdf"'})
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
