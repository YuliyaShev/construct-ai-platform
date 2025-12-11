import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from utils.db import Base


class RFI(Base):
    __tablename__ = "rfi"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("file_records.id"), nullable=False)
    rfi_number = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    question = Column(Text, nullable=True)
    suggested_fix = Column(Text, nullable=True)
    page = Column(Integer, nullable=True)
    x = Column(Float, nullable=True)
    y = Column(Float, nullable=True)
    severity = Column(String, nullable=True)
    status = Column(String, default="Open")
    preview_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {
            "id": self.id,
            "file_id": self.file_id,
            "rfi_number": self.rfi_number,
            "title": self.title,
            "description": self.description,
            "question": self.question,
            "suggested_fix": self.suggested_fix,
            "page": self.page,
            "x": self.x,
            "y": self.y,
            "severity": self.severity,
            "status": self.status,
            "preview_path": self.preview_path,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
