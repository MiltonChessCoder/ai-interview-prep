from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.question import Question
from app.models.topic import Topic
from app.schemas.question import QuestionGenerate, QuestionResponse
from app.routes.auth import get_current_user
from app.models.user import User
from dotenv import load_dotenv
import google.generativeai as genai
import json
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
client = genai.GenerativeModel("gemini-3.6-flash")

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/generate-question", response_model=QuestionResponse)
def generate_question(
    data: QuestionGenerate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    topic = db.query(Topic).filter(Topic.id == data.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    prompt = f"""You are a technical interview coach.
Generate a {data.difficulty} difficulty interview question on the topic: {topic.name}.

Respond ONLY with a JSON object in this exact format, no extra text:
{{
    "question_text": "the interview question here",
    "hints": ["hint 1", "hint 2", "hint 3"],
    "ideal_answer_points": ["key point 1", "key point 2", "key point 3"]
}}"""

    try:
        response = client.generate_content(prompt)
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        question_data = json.loads(response_text.strip())
    except (json.JSONDecodeError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"AI returned invalid response: {str(e)}")

    question = Question(
    topic_id=data.topic_id,
    difficulty=data.difficulty,
    question_text=question_data["question_text"],
    hints=json.dumps(question_data["hints"]),
    ideal_answer_points=json.dumps(question_data["ideal_answer_points"]),
    generated_by="ai"
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

@router.get("/get-question/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

