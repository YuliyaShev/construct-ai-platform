import datetime
from sqlalchemy import Column, DateTime, Integer, Text, ForeignKey
from utils.db import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("file_records.id"), nullable=False)
    page = Column(Integer, nullable=True)
    result_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
