1. The Scaling Curriculum ArchitectureMathematics: The "Digit-Stepper" ProgressionLevel 1 (1-Digit: 1 to 9):UI Focus: Pure visual manipulatives. Dragging blocks, counting animated objects.Operations: Basic addition and subtraction (e.g., $4 + 3 = 7$).Level 2 (2-Digit: 10 to 99):UI Focus: Introduction of place value. Using interactive Base-10 blocks (rods of ten, units of one).Operations: Addition/subtraction without regrouping, progressing to basic regrouping (carrying).Level 3 (3-Digit: 100 to 999):UI Focus: Column-based grid UI. Interactive input fields above the columns specifically designed for the student to type in the "carried" or "borrowed" numbers.Operations: Complex addition/subtraction, introduction of 1-digit multiplication ($145 \times 3$).Level 4 & 5 (4-Digit to 5-Digit: 1,000 to 99,999):UI Focus: Abstract calculation grids and heavy emphasis on word problems.Operations: Long multiplication, introduction to long division.AI Integration: Here, we utilize the OpenAI API on the backend to dynamically generate word problems involving these large numbers, themed around the user's selected interests (e.g., calculating fuel for a spaceship journey of 12,500 miles).English: The "Word-Builder" ProgressionLevel 1 (2-Letter Words):Focus: Sight words and basic phonics (e.g., at, in, on, to).UI: Giant drag-and-drop letter blocks. Audio cues pronouncing the word.Level 2 (3-Letter Words):Focus: CVC (Consonant-Vowel-Consonant) words (e.g., cat, dog, run).UI: "Missing letter" games where the middle vowel is blanked out.Level 3 (4-Letter Words):Focus: Blends and digraphs (e.g., play, stop, chat).UI: Word jumbles and interactive spelling bees.Level 4 (5-Letter Words):Focus: Complex vowel teams and silent letters (e.g., apple, train, clock).UI: A "Wordle-style" interface for kids, or typing challenges where OpenAI generates a contextual sentence, reads it aloud, and asks the child to spell the missing 5-letter word.2. Firestore Database Schema for ProgressionTo avoid hardcoding thousands of questions, your Next.js app should generate these dynamically based on the student's current "Level" stored in Firestore.Here is how you should structure the user_progress subcollection:JSON// Firestore Document path: /users/{userId}/progress/{subjectId}

{
  "subject": "mathematics",
  "current_topic": "addition",
  "difficulty_level": 3,          // Represents 3-digit numbers
  "mastery_score": 85,            // Percentage. Unlocks level 4 at 90%
  "total_problems_solved": 142,
  "recent_struggles": ["regrouping_tens"], 
  "last_played": "2026-04-26T10:30:00Z"
}
3. Next.js Component StrategyInstead of building a separate page for every single problem, we build a Master Engine Component that reads the Firestore data and renders the correct UI.Provide this prompt to your coding assistant to scaffold the engine:PlaintextYou are an expert Next.js and React developer. 

CONTEXT:
I am building a dynamic learning engine. I need a single master React component called `<MathEngine />` that dynamically adjusts its UI based on a `difficultyLevel` prop (1 through 5, representing 1-digit through 5-digit math).

REQUIREMENTS:
1. Create a TypeScript interface for the problem state: `operation` (+, -, *, /), `operands` (array of numbers), and `difficultyLevel`.
2. Implement a switch statement or component map inside `<MathEngine />` that renders different sub-components:
   - Level 1: Renders `<VisualBlocks mode={operation} numbers={operands} />` (Placeholders for drag-and-drop).
   - Level 2 & 3: Renders `<ColumnGrid numbers={operands} requiresRegrouping={true} />` (A grid with extra input boxes at the top for carrying numbers).
   - Level 4 & 5: Renders `<WordProblem text={generateText()} numbers={operands} />`.
3. The component must manage the state of the user's answer and include a `verifyAnswer` function.
4. Write clean, modular Tailwind CSS for the Level 3 `<ColumnGrid>` so the inputs perfectly align vertically for hundreds, tens, and units.

Output the complete, well-commented TypeScript code for these components.
By structuring the application this way, adding a new feature—like a 6-letter spelling challenge—just means adding one new configuration level to the database, rather than rewriting the site.