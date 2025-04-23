# FastAPI Language Model Interface

## Overview
A web application that provides a user-friendly interface for interacting with large language models. This project consists of a FastAPI backend and a simple HTML/CSS/JavaScript frontend.

## Model Information
This application uses **CodeGuard_14B_Vuln_Detection**, a specialized model for code vulnerability detection. The model:
- Is a LoRA fine-tuned version of Qwen2.5-Coder 14B
- Uses BitsAndBytes (BNB) 4-bit quantization for improved efficiency
- Has been specifically trained to detect security vulnerabilities in code
- Is hosted on Hugging Face as "vamcrizer/CodeGuard_14B_Vuln_Detection"

The model is optimized to analyze code snippets, identify potential security issues, and provide detailed recommendations for fixing vulnerabilities with varying severity levels.

## Project Structure
```
fastapi-llm/
├── LICENSE
├── README.md
├── run.py                 # Entry point to run the application
├── backend/
│   ├── requirements.txt   # Python dependencies
│   └── app/
│       └── main.py        # FastAPI main application file
└── frontend/
    ├── index.html         # Main HTML page
    ├── css/
    │   └── style.css      # Styling for the frontend
    └── js/
        └── script.js      # Frontend JavaScript logic
```

## Installation

### Prerequisites
- [Conda](https://docs.conda.io/en/latest/miniconda.html) package manager

### Environment Setup
1. Create a Conda virtual environment named "llm-fe" with Python 3.11:
   ```bash
   conda create -n llm-fe python=3.11
   ```

2. Activate the environment:
   ```bash
   conda activate llm-fe
   ```

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/vamcrizer/llm-fastapi.git
   cd fastapi-llm
   ```

2. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

### Frontend Setup
No additional setup required for the frontend as it uses vanilla HTML, CSS, and JavaScript.

## Usage

1. Ensure your Conda environment is activated:
   ```bash
   conda activate llm-fe
   ```

2. Start the application:
   ```bash
   python run.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Features
- RESTful API for interacting with language models
- Simple and responsive web interface
- Real-time model responses

## Development
- Backend: FastAPI for building the API endpoints
- Frontend: HTML, CSS, and JavaScript for the user interface

## License
This project is licensed under the terms of the LICENSE file included in the repository.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements
- [FastAPI](https://fastapi.tiangolo.com/) for the API framework
- [Transformers](https://huggingface.co/transformers/) for language model integration
