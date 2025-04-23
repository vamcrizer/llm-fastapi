## Overview
A web application that provides a user-friendly interface for interacting with large language models. This project consists of a FastAPI backend and a simple HTML/CSS/JavaScript frontend.

## Model Information
This application uses **CodeGuard_14B_Vuln_Detection**, a specialized model for code vulnerability detection. The model:
- Is a LoRA fine-tuned version of Qwen2.5-Coder 14B
- Uses BitsAndBytes (BNB) 4-bit quantization for improved efficiency
- Has been specifically trained to detect security vulnerabilities in code
- Is hosted on Hugging Face as "vamcrizer/CodeGuard_14B_Vuln_Detection"

The model is optimized to analyze code snippets, identify potential security issues, and provide detailed recommendations for fixing vulnerabilities with varying severity levels.

> **⚠️ IMPORTANT**: This model requires a GPU with at least 11GB VRAM to function smoothly. Performance may be degraded or the application may fail to start with less VRAM.

## Technologies Used

This project leverages several modern technologies:

### Backend
- **FastAPI**: High-performance web framework for building APIs
- **LangChain**: Framework for developing applications powered by language models with:
  - `ConversationBufferMemory` for maintaining chat history
  - Support for message formatting and conversation management
- **Transformers**: Hugging Face library for state-of-the-art NLP models
- **PyTorch**: Deep learning framework (with CUDA support)
- **BitsAndBytes**: Library for model quantization (4-bit optimization)

### Frontend
- **HTML/CSS/JavaScript**: Vanilla frontend technology stack
- **Fetch API**: For seamless communication with the backend

Some preview of the website


<img width="746" alt="image" src="https://github.com/user-attachments/assets/921aae2a-069d-4adf-82f2-3d686aede92d" />
<img width="468" alt="image" src="https://github.com/user-attachments/assets/92078193-1fc7-4b1c-af16-938faf270759" />


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

2. Install torch with your CUDA version:
   ```bash
   # CUDA 11.8
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   # CUDA 12.1
    pip install pytorch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 pytorch-cuda=12.1 -c pytorch -c nvidia
   # CUDA 12.4
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
   # CUDA 12.6
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
   # CUDA 12.8
    pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128
   ```

3. Install backend dependencies:
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
   frontend/index.html
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
