from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.attempt import Attempt
from app.models.question import Question
from app.models.topic import Topic
from app.schemas.dashboard import DashboardResponse, TopicStat, RecentAttempt
from app.routes.auth import get_current_user
from app.models.user import User
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all user attempts
    attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id
    ).all()

    # Handle empty attempts
    if not attempts:
        return DashboardResponse(
            total_attempts=0,
            average_score=0.0,
            highest_score=0,
            lowest_score=0,
            strongest_topics=[],
            weakest_topics=[],
            recent_attempts=[],
            current_streak=0
        )

    # Basic stats
    scores = [a.score for a in attempts if a.score is not None]
    total_attempts = len(attempts)
    average_score = round(sum(scores) / len(scores), 2)
    highest_score = max(scores)
    lowest_score = min(scores)

    # Topic stats — average score per topic
    topic_stats = db.query(
        Topic.name,
        func.avg(Attempt.score).label("average_score"),
        func.count(Attempt.id).label("total_attempts")
    ).join(
        Question, Attempt.question_id == Question.id
    ).join(
        Topic, Question.topic_id == Topic.id
    ).filter(
        Attempt.user_id == current_user.id
    ).group_by(
        Topic.name
    ).all()

    topic_stat_list = [
        TopicStat(
            topic_name=stat.name,
            average_score=round(stat.average_score, 2),
            total_attempts=stat.total_attempts
        )
        for stat in topic_stats
    ]

    # Sort for strongest and weakest
    sorted_topics = sorted(topic_stat_list, key=lambda x: x.average_score, reverse=True)
    strongest_topics = sorted_topics[:3]
    weakest_topics = sorted_topics[-3:]

    # Recent attempts — last 5
    recent = db.query(Attempt, Question).join(
        Question, Attempt.question_id == Question.id
    ).filter(
        Attempt.user_id == current_user.id
    ).order_by(
        Attempt.created_at.desc()
    ).limit(5).all()

    recent_attempts = [
        RecentAttempt(
            id=attempt.id,
            question_text=question.question_text,
            score=attempt.score,
            created_at=attempt.created_at.strftime("%Y-%m-%d %H:%M")
        )
        for attempt, question in recent
    ]

    # Calculate streak — consecutive days with at least one attempt
    streak = 0
    check_date = datetime.utcnow().date()
    while True:
        day_attempts = [
            a for a in attempts
            if a.created_at.date() == check_date
        ]
        if day_attempts:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return DashboardResponse(
        total_attempts=total_attempts,
        average_score=average_score,
        highest_score=highest_score,
        lowest_score=lowest_score,
        strongest_topics=strongest_topics,
        weakest_topics=weakest_topics,
        recent_attempts=recent_attempts,
        current_streak=streak
    )