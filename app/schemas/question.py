from pydantic import BaseModel
from typing import Optional

class QuestionGenerate(BaseModel):
    topic_id: int
    difficulty: str  # easy / medium / hard

class QuestionResponse(BaseModel):
    id: int
    topic_id: int
    difficulty: str
    question_text: str
    hints: Optional[str] = None
    generated_by: str

    class Config:
        from_attributes = True


        