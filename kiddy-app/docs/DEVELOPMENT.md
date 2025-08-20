# 🛠️ Development Guide

## Prerequisites
- Python 3.8+
- Google Gemini API key

## Setup
1. Clone the repository
2. Copy `scripts/.env.example` to `scripts/.env`
3. Add your Gemini API key to `scripts/.env`
4. Install dependencies: `pip install -r scripts/requirements.txt`

## Generating Assets
```bash
cd scripts
python generate_alphabet_assets.py
python generate_numbers_assets.py
python generate_shapes_assets.py
python generate_colors_assets.py
```

## Local Testing
```bash
cd src
python -m http.server 8080
# Open http://localhost:8080
```
