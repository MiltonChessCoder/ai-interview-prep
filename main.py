from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.topics import router as topics_router
from app.routes.questions import router as questions_router
from app.routes.attempts import router as attempts_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(title="AI Interview Prep API")

app.include_router(auth_router)
app.include_router(topics_router)
app.include_router(questions_router)
app.include_router(attempts_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "AI Interview Prep API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}

