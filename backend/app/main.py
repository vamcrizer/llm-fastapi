import ollama
import json
import re
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

def parse_findings(content):
    """Parse the markdown-formatted content into a structured findings list."""
    findings = []
    
    # Pattern to match issue sections
    issue_pattern = r"(?:#### Issue \d+:|#### Finding \d+:)\s*([^\n]+)\n([\s\S]+?)(?=#### Issue \d+:|#### Finding \d+:|$)"
    
    # Find all issue sections
    issues = re.finditer(issue_pattern, content)
    
    for issue in issues:
        title = issue.group(1).strip()
        body = issue.group(2).strip()
        
        # Extract data from issue content
        description = re.search(r"- \*\*Description:\*\* ([\s\S]+?)(?=- \*\*|$)", body)
        severity = re.search(r"- \*\*Severity:\*\* ([\s\S]+?)(?=- \*\*|$)", body)
        location = re.search(r"- \*\*Location:\*\* ([\s\S]+?)(?=- \*\*|$)", body)
        recommendation = re.search(r"- \*\*Recommendation:\*\* ([\s\S]+?)(?=$)", body)
        
        finding = {
            "title": title,
            "description": description.group(1).strip() if description else "No description provided",
            "severity": severity.group(1).strip().lower() if severity else "medium",
            "location": location.group(1).strip() if location else "Unknown",
            "recommendation": recommendation.group(1).strip() if recommendation else "No recommendation provided"
        }
        
        findings.append(finding)
    
    # If no issues were found using the pattern, try to extract directly from markdown
    if not findings:
        title_pattern = r"- \*\*Title:\*\* ([^\n]+)"
        description_pattern = r"- \*\*Description:\*\* ([^\n]+(?:\n(?!- \*\*)[^\n]+)*)"
        severity_pattern = r"- \*\*Severity:\*\* ([^\n]+)"
        location_pattern = r"- \*\*Location:\*\* ([^\n]+)"
        recommendation_pattern = r"- \*\*Recommendation:\*\* ([\s\S]+?)(?=(?:\n\n)|$)"
        
        titles = re.finditer(title_pattern, content)
        descriptions = re.finditer(description_pattern, content)
        severities = re.finditer(severity_pattern, content)
        locations = re.finditer(location_pattern, content)
        recommendations = re.finditer(recommendation_pattern, content)
        
        titles_list = [m.group(1).strip() for m in titles]
        descriptions_list = [m.group(1).strip() for m in descriptions]
        severities_list = [m.group(1).strip().lower() for m in severities]
        locations_list = [m.group(1).strip() for m in locations]
        recommendations_list = [m.group(1).strip() for m in recommendations]
        
        # Create findings from the extracted data
        for i in range(min(len(titles_list), len(descriptions_list), len(severities_list), len(locations_list), len(recommendations_list))):
            finding = {
                "title": titles_list[i],
                "description": descriptions_list[i],
                "severity": severities_list[i],
                "location": locations_list[i],
                "recommendation": recommendations_list[i]
            }
            findings.append(finding)
    
    # Nếu vẫn không tìm được findings, tạo items giả
    if not findings:
        # Trích xuất các tiêu đề có thể tìm được
        potential_titles = re.finditer(r"(?:^|\n)#+\s+(.+?)(?:\n|$)", content)
        titles_list = [m.group(1).strip() for m in potential_titles if "summary" not in m.group(1).lower()]
        
        for title in titles_list:
            findings.append({
                "title": title,
                "description": "Analysis provided but in non-standard format.",
                "severity": "medium",
                "location": "Unknown",
                "recommendation": "Please check the full analysis for details."
            })
    
    return findings

@app.post("/generate")
async def generate(request: CodeAnalysisRequest):
    prompt = f"""
    Analyze the following code for potential security vulnerabilities.
    Your response MUST follow this exact format for each vulnerability found:

    #### Issue 1: [Vulnerability Name]
    - **Title:** [Brief title of the vulnerability]
    - **Description:** [Detailed explanation of what the vulnerability is and why it's dangerous]
    - **Severity:** [critical/high/medium/low]
    - **Location:** [Exact line number or function where the vulnerability exists]
    - **Recommendation:** [Detailed guidance on how to fix the issue with code examples]

    #### Issue 2: [Next Vulnerability]
    ...and so on for each vulnerability

    You MUST include all five fields (Title, Description, Severity, Location, Recommendation) for each issue found.
    If you find no vulnerabilities, clearly state that no security issues were found.

    Code to analyze:
    ```
    {request.code}
    ```
    """
    try:
        messages = [
            {"role": "system", "content": "You are a cybersecurity expert specializing in code analysis. Provide extremely detailed and specific information for each vulnerability. Always include code examples in your recommendations. Never leave any field empty."},
            {"role": "user", "content": prompt}
            ]

        response = ollama.chat(model="qwen2.5-coder:3b-instruct-q8_0", messages=messages)
        content = response["message"]["content"]
        
        # Parse the content into structured findings
        findings = parse_findings(content)
        
        return {"findings": findings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))