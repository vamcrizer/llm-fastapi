import os
import sys
import uvicorn

# Add the backend directory to the system path to import the app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

# Import the FastAPI app from backend/app/main.py
from app.main import app

if __name__ == "__main__":
    # Run the FastAPI application with uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        workers=1
    )