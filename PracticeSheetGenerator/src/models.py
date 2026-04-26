from pydantic import BaseModel, Field
from typing import List

class PaperMetadata(BaseModel):
    subject: str = Field(description="Subject of the practice paper")
    grade_level: str = Field(description="Target grade level")
    topic: str = Field(description="Specific topic covered")
    theme_context: str = Field(description="Thematic context or storyline")
    difficulty_level: str = Field(description="Difficulty level of the questions")
    total_questions: int = Field(description="Total number of questions")

class Question(BaseModel):
    question_id: int = Field(description="Unique ID for the question, sequentially numbered")
    question_type: str = Field(description="Type of question (e.g., 'multiple_choice', 'fill_in_the_blank', 'true_false', 'short_answer')")
    question_text: str = Field(description="The actual question text, woven into the narrative theme")
    options: List[str] = Field(description="List of options for multiple_choice. Empty list for short_answer or fill_in_the_blank")
    correct_answer: str = Field(description="The correct answer to the question")
    explanation: str = Field(description="Explanation of why the answer is correct, starting with an encouraging exclamation (Gamification layer)")

class FinalPracticePaper(BaseModel):
    paper_metadata: PaperMetadata = Field(description="Metadata about the generated paper")
    questions: List[Question] = Field(description="List of all generated questions")
