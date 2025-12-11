import os
import tempfile
from typing import Dict

from services.model3d_service import build_3d_model
from bim.ifc_exporter import export_ifc
from services.files_service import get_file_path, get_file_by_id
from utils.db import SessionLocal


async def generate_ifc_for_file(file_id: int, version: str = "IFC4") -> str:
    db = SessionLocal()
    file_obj = get_file_by_id(db, file_id)
    if not file_obj:
        db.close()
        raise ValueError("File not found")
    file_path = get_file_path(file_obj)
    model_data = await build_3d_model(file_path)

    ifc_str = export_ifc(model_data.get("model", {}), model_data.get("members", []), version=version)
    fd, tmp_path = tempfile.mkstemp(prefix="construct_ifc_", suffix=".ifc")
    os.close(fd)
    with open(tmp_path, "w") as f:
        f.write(ifc_str)
    db.close()
    return tmp_path
