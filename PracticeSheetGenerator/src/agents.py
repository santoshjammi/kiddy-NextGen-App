import os
from crewai import Agent, LLM
from dotenv import load_dotenv

load_dotenv()

# We need an LLM instance to pass to the agents
llm = LLM(
    model="openrouter/z-ai/glm-4.5-air:free",
    api_key=os.environ.get("OPENROUTER_API_KEY"),
    temperature=0.5,
)

def create_curriculum_expert():
    return Agent(
        role='The Curriculum Expert',
        goal='Define the strict learning objectives, core concepts, and cognitive limits for {subject} at {grade_level} regarding {topic}, according to {curriculum}.',
        backstory='You are an expert curriculum designer with deep knowledge of global educational standards. '
                  'Your mission is to ensure that educational materials strictly align with the expected developmental level '
                  'of the student, preventing questions that are too advanced or too basic.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_storyteller():
    return Agent(
        role='The Storyteller',
        goal='Build a highly engaging narrative storyboard based on the {theme_context} that encompasses {total_questions} questions.',
        backstory='You are an award-winning children\'s book author and game designer. '
                  'Your mission is to craft a linear narrative where each question acts like a scene in a movie, '
                  'pulling the child into a "What happens next?" loop. You use high-energy, sensory verbs '
                  'to make the child the protagonist.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_subject_matter_expert():
    return Agent(
        role='The Subject Matter Expert',
        goal='Draft {total_questions} questions covering {topic}, weaving the factual content into the '
             'narrative storyboard provided by the Storyteller, strictly adhering to the Knowledge Blueprint '
             'from the Curriculum Expert.',
        backstory='You are a master educator in {subject}. You excel at writing questions that are factually '
                  'accurate and pedagogical. You ensure distractors (wrong options) are tricky but fair, and you '
                  'blend academic rigor flawlessly into themed storytelling.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_qa_teacher():
    return Agent(
        role='The QA / Teacher',
        goal='Review the drafted questions against the {difficulty_level} and {grade_level}. Ensure factual '
             'accuracy, age-appropriate language, fair distractors, and engaging tone.',
        backstory='You are a meticulous head teacher and pedagogical reviewer. You find out-of-place language, '
                  'ambiguous options, and concepts that break the required difficulty leve. You guarantee the '
                  'highest quality educational material.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_json_architect():
    return Agent(
        role='The JSON Architect',
        goal='Format the approved questions perfectly into the required JSON schema, injecting high-energy '
             'Reward Language into the explanations.',
        backstory='You are a senior software architect and gamification expert. You take raw Q&A data, '
                  'enhance it with engaging reward language (e.g. "Great Navigating!"), and mandate precise '
                  'JSON structure for seamless app integration. You never include conversational filler outside '
                  'the JSON structure.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )
