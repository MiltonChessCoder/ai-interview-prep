from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    difficulty = Column(String, nullable=False)
    question_text = Column(String, nullable=False)
    ideal_answer_points = Column(String)
    generated_by = Column(String, default="ai")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    topic = relationship("Topic")

    