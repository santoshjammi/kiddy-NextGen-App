import os
from crewai import Crew, Process
from src.agents import (
    create_curriculum_expert,
    create_storyteller,
    create_subject_matter_expert,
    create_qa_teacher,
    create_json_architect
)
from src.tasks import (
    create_curriculum_task,
    create_narrative_task,
    create_drafting_task,
    create_review_task,
    create_json_task
)
from src.models import FinalPracticePaper
import json

def generate_practice_sheet(
    subject: str,
    grade_level: str,
    curriculum: str,
    topic: str,
    total_questions: int,
    difficulty_level: str,
    theme_context: str,
    question_types: str
):
    print(f"Generating practice sheet for {subject} - {topic} ({grade_level})")

    # Initialize Agents
    curriculum_expert = create_curriculum_expert()
    storyteller = create_storyteller()
    sme = create_subject_matter_expert()
    qa_teacher = create_qa_teacher()
    json_architect = create_json_architect()

    # Initialize Tasks
    curriculum_task = create_curriculum_task(curriculum_expert)
    narrative_task = create_narrative_task(storyteller)
    drafting_task = create_drafting_task(sme)
    review_task = create_review_task(qa_teacher)
    json_task = create_json_task(json_architect)

    # Note: Modern CrewAI allows structured output using output_pydantic or similar
    # If using newer crewai versions, we can set output_pydantic=FinalPracticePaper on json_task
    # We will enforce this manually within the task if needed, but try it out directly.

    import datetime

    def agent_step_callback(step_output):
        """Callback function that logs every step, thought, and action an agent takes."""
        try:
            with open("agent_activities.log", "a", encoding="utf-8") as f:
                timestamp = datetime.datetime.now().isoformat()
                f.write(f"\n[{timestamp}] --- AGENT ACTIVITY ---\n")
                f.write(str(step_output))
                f.write("\n----------------------------------------\n")
        except Exception:
            pass

    # Form the Crew
    crew = Crew(
        agents=[curriculum_expert, storyteller, sme, qa_teacher, json_architect],
        tasks=[curriculum_task, narrative_task, drafting_task, review_task, json_task],
        process=Process.sequential,
        verbose=True,
        step_callback=agent_step_callback
    )

    # Define input context
    task_inputs = {
        'subject': subject,
        'grade_level': grade_level,
        'curriculum': curriculum,
        'topic': topic,
        'total_questions': total_questions,
        'difficulty_level': difficulty_level,
        'theme_context': theme_context,
        'question_types': question_types
    }

    # Execute
    result = crew.kickoff(inputs=task_inputs)
    return result

if __name__ == "__main__":
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Please set GOOGLE_API_KEY in the .env file")
        exit(1)

    # Example test run mimicking the user's initial request
    result_json = generate_practice_sheet(
        subject="English",
        grade_level="Grade 3",
        curriculum="Cambridge Primary English",
        topic="Pronouns",
        total_questions=3,
        difficulty_level="Intermediate",
        theme_context="A journey across the desert to find a hidden oasis",
        question_types="multiple_choice, fill_in_the_blank"
    )

    print("\n\n--- Final Output ---")
    print(result_json)
    
    # Optionally save to a file
    with open("output.json", "w") as f:
        # result_json might be an object containing the string or just the string.
        # CrewAI returns a CrewOutput object in newer versions.
        # We can extract the raw string via str() 
        f.write(str(result_json))
    
    print("Saved output to output.json")
