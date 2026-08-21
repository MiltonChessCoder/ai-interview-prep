from pydantic import BaseModel
from typing import List, Optional

class TopicStat(BaseModel):
    topic_name: str
    average_score: float
    total_attempts: int

class RecentAttempt(BaseModel):
    id: int
    question_text: str
    score: int
    created_at: str

class DashboardResponse(BaseModel):
    total_attempts: int
    average_score: float
    highest_score: int
    lowest_score: int
    strongest_topics: List[TopicStat]
    weakest_topics: List[TopicStat]
    recent_attempts: List[RecentAttempt]
    current_streak: int


