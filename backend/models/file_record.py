import datetime

from sqlalchemy import Column, DateTime, Integer, String

from utils.db import Base


class FileRecord(Base):
    __tablename__ = "file_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)  # stored name on disk
    original_name = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def as_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "original_name": self.original_name,
            "content_type": self.content_type,
            "size": self.size,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
