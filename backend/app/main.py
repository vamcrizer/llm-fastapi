import ollama
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeAnalysisRequest(BaseModel):
    code: str

@app.post("/generate")
async def generate(request: CodeAnalysisRequest):
    prompt = f"""
    Analyze the following code for potential security vulnerabilities. 
    Provide a detailed report with the following fields for each finding:
    - Title: A short title for the issue.
    - Description: A detailed explanation of the issue.
    - Severity: The severity level (low, medium, high, critical).
    - Location: The approximate location in the code (e.g., line number).
    - Recommendation: Suggestions to fix or mitigate the issue.

    Code:
    {request.code}
    """
    try:
        messages = [
            {"role": "user", "content": prompt},
            {"role": "system", "content": "You are a cybersecurity expert specializing in code analysis. You will be provided with a snippet of code, your task is to identify security vulnerabilities in the provided code and provide detailed recommendations."},
            ]

        response = ollama.chat(model="qwen2.5-coder:7b", messages=messages)
        return {"findings": response["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))