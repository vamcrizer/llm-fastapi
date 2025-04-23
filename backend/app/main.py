from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Import LangChain components for conversation management
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage

# Initialize the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("vamcrizer/CodeGuard_14B_Vuln_Detection")
model = AutoModelForCausalLM.from_pretrained("vamcrizer/CodeGuard_14B_Vuln_Detection")

# Move model to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

# Create FastAPI app
app = FastAPI(title="CodeGuard Vulnerability Detection API")

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conversation memory with LangChain
memory = ConversationBufferMemory(return_messages=True)

# To store the code being analyzed
analyzed_code = ""

# Define request and response models
class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str

class CodeRequest(BaseModel):
    code: str

class Finding(BaseModel):
    title: str
    severity: str
    description: str
    location: str
    recommendation: str

class CodeResponse(BaseModel):
    findings: List[Finding]

# Helper to format conversation for the model
def format_conversation(conversation_history, include_code=True):
    formatted_prompt = ""
    
    # Add analyzed code to context if available and requested
    if include_code and analyzed_code:
        formatted_prompt += f"Here is the code being analyzed:\n```\n{analyzed_code}\n```\n\n"
    
    # Add conversation history
    if conversation_history:
        for message in conversation_history:
            role = message.get("role", "")
            content = message.get("content", "")
            
            if role == "user":
                formatted_prompt += f"User: {content}\n"
            elif role == "assistant":
                formatted_prompt += f"Assistant: {content}\n"
    
    return formatted_prompt

# Generate response using the model
def generate_response(prompt, max_new_tokens=2048):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    
    # Generate response
    with torch.no_grad():
        outputs = model.generate(
            inputs["input_ids"],
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=1,
            top_p=0.9,
        )
    
    # Decode generated text
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract only the model's response (not the input prompt)
    response = generated_text[len(prompt):].strip()
    
    return response

# Analyze code for vulnerabilities
def analyze_code(code):
    global analyzed_code
    analyzed_code = code
    
    # Create prompt for vulnerability analysis
    analysis_prompt = f"""
    Analyze the following code for security vulnerabilities and provide detailed findings:
    
    ```
    {code}
    ```
    
    Provide your analysis as a JSON array of findings, where each finding contains:
    - title: A short title for the vulnerability
    - severity: The severity level (critical, high, medium, low)
    - description: A detailed description of the vulnerability
    - location: Where in the code the vulnerability exists
    - recommendation: How to fix the vulnerability
    """
    
    # Generate analysis response
    analysis_response = generate_response(analysis_prompt)
    
    # Try to extract JSON from the response
    try:
        # Check if we need to parse JSON from the text
        if "```json" in analysis_response:
            json_text = analysis_response.split("```json")[1].split("```")[0].strip()
        elif "```" in analysis_response:
            json_text = analysis_response.split("```")[1].split("```")[0].strip()
        else:
            json_text = analysis_response
        
        findings = json.loads(json_text)
        
        # Ensure we have the right structure
        if not isinstance(findings, list):
            findings = []
            
        # Ensure each finding has the required fields
        validated_findings = []
        for finding in findings:
            validated_findings.append({
                "title": finding.get("title", "Unnamed Issue"),
                "severity": finding.get("severity", "medium").lower(),
                "description": finding.get("description", "No description provided"),
                "location": finding.get("location", "Unknown"),
                "recommendation": finding.get("recommendation", "No recommendation provided")
            })
        
        return validated_findings
    except Exception as e:
        print(f"Error parsing analysis response: {e}")
        # Return a default finding if parsing failed
        return [{
            "title": "Analysis Error",
            "severity": "medium",
            "description": "Failed to parse the analysis results. The model output was not in the expected format.",
            "location": "N/A",
            "recommendation": "Please try again with a different code sample or contact support."
        }]

# Chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global analyzed_code
    
    # Update conversation history in memory
    conversation_history = request.conversation_history or []
    
    # Format the conversation for the model
    formatted_prompt = format_conversation(conversation_history)
    
    # Add the current message
    current_prompt = f"{formatted_prompt}User: {request.message}\nAssistant:"
    
    # Generate response
    response = generate_response(current_prompt)
    
    # Return the response
    return ChatResponse(response=response)

# Code analysis endpoint
@app.post("/generate", response_model=CodeResponse)
async def generate(request: CodeRequest):
    # Analyze the code
    findings = analyze_code(request.code)
    
    return CodeResponse(findings=findings)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
