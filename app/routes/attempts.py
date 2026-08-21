from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.attempt import Attempt
from app.models.question import Question
from app.schemas.attempt import AttemptCreate, AttemptResponse
from app.routes.auth import get_current_user
from app.models.user import User
from dotenv import load_dotenv
import google.generativeai as genai
import json
import os
from typing import List

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
client = genai.GenerativeModel("gemini-3.6-flash")

router = APIRouter(prefix="/attempts", tags=["attempts"])

@router.post("/", response_model=AttemptResponse)
def submit_attempt(
    data: AttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the question
    question = db.query(Question).filter(Question.id == data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Build scoring prompt
    prompt = f"""You are a strict but fair technical interviewer.

Question: {question.question_text}
Ideal answer points: {question.ideal_answer_points}
Candidate's answer: {data.user_answer}

Evaluate the candidate's answer and respond ONLY with a JSON object in this exact format, no extra text:
{{
    "score": <integer between 0 and 100>,
    "feedback": "<overall feedback string>",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"]
}}"""

    # Call Gemini API
    try:
        response = client.generate_content(prompt)
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        scoring_data = json.loads(response_text.strip())

        # Validate required keys exist
        required_keys = ["score", "feedback", "strengths", "improvements"]
        for key in required_keys:
            if key not in scoring_data:
                raise ValueError(f"Missing key: {key}")

    except (json.JSONDecodeError, ValueError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"AI returned invalid response: {str(e)}")

    # Save attempt to database
    attempt = Attempt(
        user_id=current_user.id,
        question_id=data.question_id,
        user_answer=data.user_answer,
        score=scoring_data["score"],
        feedback=scoring_data["feedback"],
        strengths=json.dumps(scoring_data["strengths"]),
        improvements=json.dumps(scoring_data["improvements"])
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

@router.get("/me", response_model=List[AttemptResponse])
def get_my_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id
    ).order_by(Attempt.created_at.desc()).all()
    return attempts

@router.get("/{attempt_id}", response_model=AttemptResponse)
def get_attempt(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(Attempt).filter(
        Attempt.id == attempt_id,
        Attempt.user_id == current_user.id
    ).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return attempt


