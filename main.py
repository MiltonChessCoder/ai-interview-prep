from fastapi import FastAPI
from app.routes.auth import router as auth_router

app = FastAPI(title="AI Interview Prep API")

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "AI Interview Prep API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}

