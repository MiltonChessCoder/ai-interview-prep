from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_answer = Column(String, nullable=False)
    score = Column(Integer)
    feedback = Column(String)
    strengths = Column(String)
    improvements = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    question = relationship("Question")

