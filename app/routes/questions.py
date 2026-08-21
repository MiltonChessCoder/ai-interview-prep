from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.question import Question
from app.models.topic import Topic
from app.schemas.question import QuestionGenerate, QuestionResponse
from app.routes.auth import get_current_user
from app.models.user import User
from dotenv import load_dotenv
import anthropic
import json
import os

load_dotenv()

router = APIRouter(prefix="/questions", tags=["questions"])

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@router.post("/generate-question", response_model=QuestionResponse)
def generate_question(
    data: QuestionGenerate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check topic exists
    topic = db.query(Topic).filter(Topic.id == data.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    # Build prompt
    prompt = f"""You are a technical interview coach.
Generate a {data.difficulty} difficulty interview question on the topic: {topic.name}.

Respond ONLY with a JSON object in this exact format, no extra text:
{{
    "question_text": "the interview question here",
    "hints": ["hint 1", "hint 2", "hint 3"],
    "ideal_answer_points": ["key point 1", "key point 2", "key point 3"]
}}"""

    # Call Anthropic API
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    # Parse response
    try:
        response_text = message.content[0].text
        question_data = json.loads(response_text)
    except (json.JSONDecodeError, IndexError):
        raise HTTPException(status_code=500, detail="AI returned invalid response")

    # Save to database
    question = Question(
        topic_id=data.topic_id,
        difficulty=data.difficulty,
        question_text=question_data["question_text"],
        ideal_answer_points=json.dumps(question_data["ideal_answer_points"]),
        generated_by="ai"
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

