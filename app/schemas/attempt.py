from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttemptCreate(BaseModel):
    question_id: int
    user_answer: str

class AttemptResponse(BaseModel):
    id: int
    question_id: int
    user_id: int
    user_answer: str
    score: Optional[int] = None
    feedback: Optional[str] = None
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True