from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Interview Prep API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/test")
def test():
    return {"message": "Your first API endpoint works!"}
