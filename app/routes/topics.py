from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicResponse
from app.routes.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/topics", tags=["topics"])

@router.get("/", response_model=List[TopicResponse])
def get_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    topics = db.query(Topic).all()
    return topics

@router.post("/", response_model=TopicResponse)
def create_topic(
    topic_data: TopicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Topic).filter(Topic.name == topic_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Topic already exists")
    topic = Topic(name=topic_data.name, description=topic_data.description)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic