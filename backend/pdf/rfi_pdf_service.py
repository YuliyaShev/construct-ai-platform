import os
import zipfile
import tempfile
import json
from typing import Dict, List, Optional

from pdf.rfi_pdf_generator import RFIPDFGenerator

RFI_REPORT_DIR = os.path.join("project_data", "rfi_reports")
os.makedirs(RFI_REPORT_DIR, exist_ok=True)


def _json_path(rfi_number: str) -> str:
    return os.path.join(RFI_REPORT_DIR, f"{rfi_number}.json")


def save_rfi_json(rfi_data: Dict):
    if not rfi_data.get("rfi_number"):
        return
    with open(_json_path(rfi_data["rfi_number"]), "w") as f:
        json.dump(rfi_data, f, indent=2)


def load_rfi_json(rfi_number: str) -> Optional[Dict]:
    path = _json_path(rfi_number)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None


def generate_single_rfi_pdf(rfi_data: Dict) -> str:
    filename = f"{rfi_data.get('rfi_number', 'RFI')}.pdf"
    output_path = os.path.join(RFI_REPORT_DIR, filename)
    generator = RFIPDFGenerator()
    generator.generate_rfi_pdf(rfi_data, output_path)
    save_rfi_json(rfi_data)
    return output_path


def generate_rfi_zip(rfi_list: List[Dict]) -> str:
    tmp_fd, tmp_zip = tempfile.mkstemp(prefix="rfi_batch_", suffix=".zip")
    os.close(tmp_fd)
    with zipfile.ZipFile(tmp_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for rfi in rfi_list:
            pdf_path = generate_single_rfi_pdf(rfi)
            zipf.write(pdf_path, arcname=os.path.basename(pdf_path))
    return tmp_zip
