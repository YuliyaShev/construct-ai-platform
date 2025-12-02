from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from pdf.export.export_service import generate_and_save_report

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/{file_id}/full-report")
async def get_full_report(file_id: int):
    try:
        pdf_path = generate_and_save_report(file_id)
        return FileResponse(pdf_path, filename=os.path.basename(pdf_path), media_type="application/pdf")
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
