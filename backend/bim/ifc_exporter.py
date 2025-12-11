from typing import Dict, List
from bim.ifc_writer import write_ifc_from_mesh


def export_ifc(mesh: Dict, members: List[Dict], version: str = "IFC4") -> str:
    return write_ifc_from_mesh(version, mesh, members)
