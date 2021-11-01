import os

from sqlalchemy import Column, Integer, String

from .meta import Base


class Feedback(Base):
    __tablename__ = "feedback"
    __table_args__ = {"schema": os.environ.get("PGSCHEMA", "main")}
    id_feedback = Column(Integer, primary_key=True)
    ua = Column(String(250))
    permalink = Column(String(5000))
    text = Column(String(1000))
    email = Column(String(100))
