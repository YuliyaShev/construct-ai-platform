import datetime
import json

from sqlalchemy import Column, DateTime, Integer, String, Text

from utils.db import Base


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String, nullable=False)
    saved_as = Column(String, nullable=False)
    saved_to = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    missing_dimensions = Column(Text, nullable=True)
    issues = Column(Text, nullable=True)
    analysis_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {
            "id": self.id,
            "original_filename": self.original_filename,
            "saved_as": self.saved_as,
            "saved_to": self.saved_to,
            "summary": self.summary,
            "missing_dimensions": json.loads(self.missing_dimensions) if self.missing_dimensions else [],
            "issues": json.loads(self.issues) if self.issues else [],
            "analysis": json.loads(self.analysis_json) if self.analysis_json else {},
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
