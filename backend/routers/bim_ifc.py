from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import os

from services.bim_ifc_service import generate_ifc_for_file

router = APIRouter(prefix="/files", tags=["BIM IFC"])


@router.get("/{file_id}/bom/ifc")
async def get_ifc(file_id: int, version: str = "IFC4"):
    try:
        path = await generate_ifc_for_file(file_id, version=version)
        if not os.path.exists(path):
            raise HTTPException(status_code=500, detail="IFC generation failed")
        return StreamingResponse(open(path, "rb"), media_type="application/octet-stream", headers={"Content-Disposition": "attachment; filename=model.ifc"})
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
