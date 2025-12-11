import json
import datetime
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from ai.rfi_generator.rfi_prompt import RFI_PROMPT
from ai.rfi_generator.rfi_builder import build_rfi
from ai.rfi_generator.rfi_cropper import crop_issue_preview
from ai.llm.llm_client import LLMClient
from models.rfi import RFI
from models.rfi_counter import RFICounter
from services.files_service import get_file_path, get_file_by_id


def _next_rfi_number(db: Session) -> str:
    counter = db.query(RFICounter).first()
    if not counter:
        counter = RFICounter(last_number=0)
        db.add(counter)
        db.commit()
        db.refresh(counter)
    counter.last_number += 1
    db.commit()
    db.refresh(counter)
    return counter.last_number


def create_rfi(db: Session, file_id: int, issue: Dict) -> Dict:
    file_record = get_file_by_id(db, file_id)
    if not file_record:
        raise ValueError("File not found")

    client = LLMClient()
    prompt = RFI_PROMPT.format(issue=json.dumps(issue))
    ai_text = client.generate_json(prompt, schema={"title": "", "description": "", "question": "", "suggested_fix": ""})

    next_num = _next_rfi_number(db)
    rfi_obj = build_rfi(issue, ai_text, last_number=next_num)

    preview_path = None
    if issue.get("x") is not None and issue.get("y") is not None and issue.get("page"):
        preview_path = crop_issue_preview(get_file_path(file_record), issue["page"], issue["x"], issue["y"])

    db_rfi = RFI(
        file_id=file_id,
        rfi_number=rfi_obj["rfi_number"],
        title=rfi_obj["title"],
        description=rfi_obj["description"],
        question=rfi_obj["question"],
        suggested_fix=rfi_obj["suggested_fix"],
        page=rfi_obj["page"],
        x=rfi_obj["x"],
        y=rfi_obj["y"],
        severity=rfi_obj["severity"],
        status=rfi_obj["status"],
        preview_path=preview_path,
        created_at=datetime.datetime.utcnow(),
    )
    db.add(db_rfi)
    db.commit()
    db.refresh(db_rfi)
    return db_rfi.as_dict()


def list_rfis(db: Session, file_id: int) -> List[Dict]:
    rfis = db.query(RFI).filter(RFI.file_id == file_id).order_by(RFI.created_at.desc()).all()
    return [r.as_dict() for r in rfis]


def get_rfi(db: Session, rfi_id: int) -> Optional[Dict]:
    rfi = db.query(RFI).filter(RFI.id == rfi_id).first()
    return rfi.as_dict() if rfi else None


def update_rfi_status(db: Session, rfi_id: int, status: str) -> Optional[Dict]:
    rfi = db.query(RFI).filter(RFI.id == rfi_id).first()
    if not rfi:
        return None
    rfi.status = status
    db.commit()
    db.refresh(rfi)
    return rfi.as_dict()
