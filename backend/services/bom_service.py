import asyncio
from typing import Dict

from services.files_service import get_file_by_id, get_file_path
from utils.pdf_text import extract_all_text
from utils.bom_extractor import extract_tables, parse_candidates, normalize_candidates


async def extract_bom_for_file(db, file_id: int) -> Dict:
    record = get_file_by_id(db, file_id)
    if not record:
        raise ValueError("File not found")

    file_path = get_file_path(record)

    loop = asyncio.get_event_loop()
    text_pages = await loop.run_in_executor(None, extract_all_text, file_path)
    tables = await loop.run_in_executor(None, extract_tables, file_path)

    candidates = parse_candidates(text_pages, tables)
    bom = normalize_candidates(candidates)
    return bom
