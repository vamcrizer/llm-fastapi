import ollama
from fastapi import FastAPI

app = FastAPI()

@app.post("/generate")
async def generate(prompt: str):
    response = ollama.chat(model = "qwen2.5-coder:7b", messages=[{"role": "user", "content": prompt}])
    return {"response": response["message"]["content"]}