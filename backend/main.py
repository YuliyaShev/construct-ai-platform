import os

from fastapi import FastAPI
from dotenv import load_dotenv
from openai import OpenAI

from routers.bom_routes import router as bom_router
from routers.dimensions_routes import router as dimensions_router
from routers.image_routes import router as image_router
from routers.pdf_routes import router as pdf_router
from routers.files import router as files_router
from routers.revision_routes import router as revision_router
from routers.rfi_routes import router as rfi_router
from routers.rfi import router as rfi_pdf_router
from routers.shop_drawing_routes import router as shop_drawing_router
from routers.export_routes import router as export_router
from routers.shopdrawing_routes import router as shopdrawing_router
from routers.navigation_routes import router as navigation_router
from routers.export_report_routes import router as export_report_router
from routers.analyzer_v4 import router as analyzer_v4_router
from routers.heatmap import router as heatmap_router
from routers.rfi_report import router as rfi_report_router
from routers.bom import router as bom_router
from routers.bom_geometry import router as bom_geometry_router
from routers.bom_glass import router as bom_glass_router
from routers.bom_cutlist import router as bom_cutlist_router
from routers.bom_3d import router as bom_3d_router
from routers.bim_ifc import router as bim_ifc_router
from routers.clash_detection import router as clash_router
from routers.dimension_checker import router as dimension_checker_router
from routers.rooms import router as rooms_router
from routers.load_path import router as load_path_router
from routers.code_check import router as code_check_router
from routers.permit_check import router as permit_check_router
from routers.permit_validator import router as permit_validator_router
from routers.egress import router as egress_router
from routers.details import router as details_router
from routers.cost_estimator import router as cost_estimator_router
from routers.schedule import router as schedule_router
from routers.structural_risk import router as structural_risk_router
from routers.tender import router as tender_router
from routers.contracts import router as contracts_router
from routers.logistics import router as logistics_router
from routers.safety import router as safety_router
from routers.punchlist import router as punch_router
from routers.cost_estimator import router as cost_estimator_router
from utils.db import init_db

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Global paths
UPLOAD_DIR = "uploaded_files"
RFI_COUNTER_FILE = "project_data/rfi_counter.json"
RFI_OUTPUT_DIR = "project_data/rfi"
FILES_DIR = "project_data/files"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RFI_OUTPUT_DIR, exist_ok=True)
os.makedirs(FILES_DIR, exist_ok=True)

app = FastAPI()
init_db()

# Share globals via app state
app.state.client = client
app.state.upload_dir = UPLOAD_DIR
app.state.rfi_counter_file = RFI_COUNTER_FILE
app.state.rfi_output_dir = RFI_OUTPUT_DIR

# Routers
app.include_router(pdf_router)
app.include_router(dimensions_router)
app.include_router(bom_router)
app.include_router(revision_router)
app.include_router(image_router)
app.include_router(shop_drawing_router)
app.include_router(export_router)
app.include_router(shopdrawing_router)
app.include_router(rfi_router)
app.include_router(rfi_pdf_router)
app.include_router(navigation_router)
app.include_router(export_report_router)
app.include_router(analyzer_v4_router)
app.include_router(heatmap_router)
app.include_router(rfi_report_router)
app.include_router(bom_router)
app.include_router(bom_geometry_router)
app.include_router(bom_glass_router)
app.include_router(bom_cutlist_router)
app.include_router(bom_3d_router)
app.include_router(bim_ifc_router)
app.include_router(files_router)
app.include_router(clash_router)
app.include_router(dimension_checker_router)
app.include_router(rooms_router)
app.include_router(load_path_router)
app.include_router(code_check_router)
app.include_router(permit_check_router)
app.include_router(permit_validator_router)
app.include_router(egress_router)
app.include_router(details_router)
app.include_router(cost_estimator_router)
app.include_router(schedule_router)
app.include_router(structural_risk_router)
app.include_router(tender_router)
app.include_router(contracts_router)
app.include_router(logistics_router)
app.include_router(safety_router)
app.include_router(punch_router)
