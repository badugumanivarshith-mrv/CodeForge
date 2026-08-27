import { QuizDifficulty, QuestionType } from '@codeforge/shared';

export interface SeedQuizOption {
  sequence: number;
  optionText: string;
  isCorrect: boolean;
}

export interface SeedQuizQuestion {
  sequence: number;
  questionType: QuestionType;
  questionMdx: string;
  codeSnippet?: string;
  explanationMdx: string;
  points: number;
  options: SeedQuizOption[];
}

export interface SeedQuiz {
  topicSlug: string;
  title: string;
  description: string;
  difficulty: QuizDifficulty;
  passingScorePercentage: number;
  questions: SeedQuizQuestion[];
}

export const SEED_QUIZZES: SeedQuiz[] = [
  // -------------------------------------------------------------
  // PYTHON: Topic 1 - Syntax & Literals Checkpoint Quiz
  // -------------------------------------------------------------
  {
    topicSlug: 'python-syntax-literals',
    title: 'Python Syntax & Whitespace Mastery Checkpoint',
    description: 'Test your understanding of indentation rules, comment conventions, string formatting, and literal evaluation.',
    difficulty: QuizDifficulty.EASY,
    passingScorePercentage: 75,
    questions: [
      {
        sequence: 1,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionMdx: 'How does Python define code blocks and variable scope?',
        explanationMdx: 'Python uses consistent whitespace indentation (conventionally 4 spaces) rather than curly braces or keywords to delineate blocks.',
        points: 25,
        options: [
          { sequence: 1, optionText: 'By enclosing blocks within curly braces { }', isCorrect: false },
          { sequence: 2, optionText: 'By using 4 spaces of indentation consistently', isCorrect: true },
          { sequence: 3, optionText: 'By ending every statement with a semicolon ;', isCorrect: false },
          { sequence: 4, optionText: 'By using BEGIN and END keyword delimiters', isCorrect: false },
        ],
      },
      {
        sequence: 2,
        questionType: QuestionType.CODE_COMPREHENSION,
        questionMdx: 'What will be printed to standard output when running this code?',
        codeSnippet: `x = 10\ny = 20\nprint(f"{x} + {y} = {x + y}")`,
        explanationMdx: 'f-strings interpolate expression values inside `{}` at runtime, calculating 10 + 20 = 30.',
        points: 25,
        options: [
          { sequence: 1, optionText: '10 + 20 = 30', isCorrect: true },
          { sequence: 2, optionText: 'x + y = 30', isCorrect: false },
          { sequence: 3, optionText: '{x} + {y} = {x + y}', isCorrect: false },
          { sequence: 4, optionText: '30', isCorrect: false },
        ],
      },
      {
        sequence: 3,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionMdx: 'Which of the following creates a valid multi-line string literal in Python?',
        explanationMdx: 'Triple single quotes `\'\'\'` or triple double quotes `"""` define multi-line string literals.',
        points: 25,
        options: [
          { sequence: 1, optionText: '/* multi-line string */', isCorrect: false },
          { sequence: 2, optionText: '"""This is a multi-line string"""', isCorrect: true },
          { sequence: 3, optionText: '// multi-line string //', isCorrect: false },
          { sequence: 4, optionText: '<string>multi-line</string>', isCorrect: false },
        ],
      },
      {
        sequence: 4,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionMdx: 'Which character is used to start a single-line comment in Python?',
        explanationMdx: 'The hash character `#` designates the rest of the line as a comment.',
        points: 25,
        options: [
          { sequence: 1, optionText: '//', isCorrect: false },
          { sequence: 2, optionText: '#', isCorrect: true },
          { sequence: 3, optionText: '--', isCorrect: false },
          { sequence: 4, optionText: '/*', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // JAVASCRIPT: Topic 1 - Syntax & Literals Checkpoint Quiz
  // -------------------------------------------------------------
  {
    topicSlug: 'javascript-syntax-literals',
    title: 'JavaScript Syntax & Scoping Checkpoint',
    description: 'Verify your knowledge of const/let variable scopes, template literals, and expression evaluation.',
    difficulty: QuizDifficulty.EASY,
    passingScorePercentage: 75,
    questions: [
      {
        sequence: 1,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionMdx: 'What happens when you attempt to reassign a variable declared with `const`?',
        explanationMdx: 'Reassigning a `const` identifier throws a TypeError at runtime.',
        points: 25,
        options: [
          { sequence: 1, optionText: 'It succeeds silently', isCorrect: false },
          { sequence: 2, optionText: 'A TypeError is thrown at runtime', isCorrect: true },
          { sequence: 3, optionText: 'The variable converts to `let` automatically', isCorrect: false },
          { sequence: 4, optionText: 'It creates a new shadowed variable in the parent scope', isCorrect: false },
        ],
      },
      {
        sequence: 2,
        questionType: QuestionType.CODE_COMPREHENSION,
        questionMdx: 'What will this code log to the console?',
        codeSnippet: `const a = 5;\nconst b = "5";\nconsole.log(a === b);`,
        explanationMdx: 'The strict equality operator `===` checks both value and type without coercion. Number 5 is not equal to string "5".',
        points: 25,
        options: [
          { sequence: 1, optionText: 'true', isCorrect: false },
          { sequence: 2, optionText: 'false', isCorrect: true },
          { sequence: 3, optionText: 'undefined', isCorrect: false },
          { sequence: 4, optionText: 'NaN', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TYPESCRIPT: Topic 1 - Syntax & Literals Checkpoint Quiz
  // -------------------------------------------------------------
  {
    topicSlug: 'typescript-syntax-literals',
    title: 'TypeScript Type Fundamentals Checkpoint',
    description: 'Assess static typing principles, interface declarations, and compiler guarantees.',
    difficulty: QuizDifficulty.EASY,
    passingScorePercentage: 75,
    questions: [
      {
        sequence: 1,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionMdx: 'When are TypeScript type annotations checked and verified?',
        explanationMdx: 'TypeScript performs static analysis at compile-time before emitting pure JavaScript; types do not exist at runtime.',
        points: 50,
        options: [
          { sequence: 1, optionText: 'At compile time by the TypeScript compiler', isCorrect: true },
          { sequence: 2, optionText: 'At runtime by the V8 JavaScript engine', isCorrect: false },
          { sequence: 3, optionText: 'In the browser DOM rendering cycle', isCorrect: false },
          { sequence: 4, optionText: 'During database transactions', isCorrect: false },
        ],
      },
    ],
  },
];
