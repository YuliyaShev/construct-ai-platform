from sqlalchemy import Column, Integer
from utils.db import Base


class RFICounter(Base):
    __tablename__ = "rfi_counter"

    id = Column(Integer, primary_key=True, index=True)
    last_number = Column(Integer, default=0)
