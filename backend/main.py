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
app.include_router(files_router)
