from crewai import Task
from textwrap import dedent

def create_curriculum_task(agent):
    return Task(
        description=dedent("""
            Research and define the strict learning objectives for the subject: {subject}, 
            at the {grade_level} level, focusing precisely on the topic: {topic}. 
            Consider the {curriculum} standards.

            Produce a Knowledge Blueprint that lists the core concepts to be tested 
            and explicitly states the cognitive limits (what NOT to include because it's too advanced).
        """),
        expected_output="A brief but explicit Knowledge Blueprint outlining core concepts and cognitive limits.",
        agent=agent
    )

def create_narrative_task(agent):
    return Task(
        description=dedent("""
            Using the provided Theme Context: "{theme_context}", build a short narrative storyboard 
            that encompasses exactly {total_questions} scenes/questions. 

            Map out the overarching plot so the student feels they are progressing through a journey.
            If the theme is "Space Exploration", Scene 1 might be Launch, Scene 2 is Asteroids, etc.
            Include a specific situational hook for each scene.
        """),
        expected_output="A narrative outline mapped to specific scene numbers (1 to {total_questions}).",
        agent=agent
    )

def create_drafting_task(agent):
    return Task(
        description=dedent("""
            Using the Knowledge Blueprint from the Curriculum Expert and the Narrative Storyboard 
            from the Storyteller, draft EXACTLY {total_questions} questions about {topic}.

            Question Types allowed: {question_types}.
            Subject: {subject}.

            Each question must start with a situational setup related to the storyboard scene.
            Weave factual content seamlessly into the narrative.
            Provide plausible distractors for multiple-choice questions.

            For each question provide:
            - Question Text
            - Options (if applicable)
            - Correct Answer
            - Standard Explanation
        """),
        expected_output="Raw educational content of {total_questions} Q&A pairs embedded inside the narrative scenes.",
        agent=agent
    )

def create_review_task(agent):
    return Task(
        description=dedent("""
            Review the drafted questions provided by the Subject Matter Expert. 
            Evaluate them against:
            - Grade Level: {grade_level}
            - Difficulty Level: {difficulty_level}
            - Accuracy for Subject: {subject}

            Correct any factual mistakes. Simplify any language that is too advanced. 
            Ensure the wrong options are fair. Check that the tone matches an engaging scenario.
        """),
        expected_output="A fully vetted, pedagogically approved set of {total_questions} questions and answers with explanations.",
        agent=agent
    )

def create_json_task(agent):
    return Task(
        description=dedent("""
            Take the approved questions from the QA Teacher.

            1. Inject "Reward Language" (e.g. "Great navigating!", "Awesome logic!") at the start
               of each Explanation field to gamify the feedback.
            2. Format the entire output into precise JSON following the required schema.

            DO NOT include any markdown code blocks (no ```json). Output raw JSON string only.
            
            The JSON MUST have two main keys:
            - 'paper_metadata': containing subject, grade_level, topic, theme_context, difficulty_level, total_questions.
            - 'questions': an array of question objects (question_id, question_type, question_text, options array, correct_answer, explanation).
        """),
        expected_output="A strictly formatted, valid JSON structure containing paper_metadata and questions array. No extra text.",
        agent=agent
    )
