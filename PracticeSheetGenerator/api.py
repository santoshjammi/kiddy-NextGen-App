import os
import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore

from src.models import FinalPracticePaper
from main import generate_practice_sheet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
firebase_initialized = False
try:
    if not firebase_admin._apps:
        cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback to Application Default Credentials
            project_id = os.environ.get('FIREBASE_PROJECT_ID') or os.environ.get('GOOGLE_CLOUD_PROJECT')
            options = {'projectId': project_id} if project_id else None
            firebase_admin.initialize_app(options=options)
    db = firestore.client()
    firebase_initialized = True
    print("Firebase initialized successfully.")
except Exception as e:
    logging.warning(f"Could not initialize Firebase: {e}\nPractice sheets will not be saved to Firestore locally.")
    db = None

class GenerateRequest(BaseModel):
    subject: str
    grade_level: str
    curriculum: str
    topic: str
    total_questions: int
    difficulty_level: str
    theme_context: str
    question_types: str

@app.post("/api/generate")
async def generate_sheet(req: GenerateRequest):
    try:
        # Generate the sheet
        result = generate_practice_sheet(
            subject=req.subject,
            grade_level=req.grade_level,
            curriculum=req.curriculum,
            topic=req.topic,
            total_questions=req.total_questions,
            difficulty_level=req.difficulty_level,
            theme_context=req.theme_context,
            question_types=req.question_types
        )
        
        # Result output from crewai is often a CrewOutput object with a `.raw` attribute
        raw_result = getattr(result, 'raw', str(result))
        
        print(f"RAW RESULT FROM CREWAI: {repr(raw_result)}")

        # We must clean the JSON if LLM output included markdown artifacts ```json ... ```
        raw_result = raw_result.strip()
        if raw_result.startswith('```json'):
            raw_result = raw_result[7:]
        if raw_result.endswith('```'):
            raw_result = raw_result[:-3]

        print(f"CLEANED RESULT (going into json.loads): {repr(raw_result)}")
        parsed_json = json.loads(raw_result.strip())

        # Save to firestore if initialized
        doc_id = None
        if firebase_initialized and db:
            doc_ref = db.collection('practice_sheets').document()
            doc_ref.set(parsed_json)
            doc_id = doc_ref.id
            parsed_json['id'] = doc_id

        return {"status": "success", "data": parsed_json}

    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8005, reload=True)
