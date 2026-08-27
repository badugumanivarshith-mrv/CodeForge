import {
  AssessmentQuestionType,
  ProblemDifficulty,
  LanguageId,
} from '@codeforge/shared';

export interface SeedAssessmentQuestion {
  topicSlug: string;
  questionType: AssessmentQuestionType;
  difficulty: ProblemDifficulty;
  promptMdx: string;
  options?: { id: string; sequence: number; optionText: string; isCorrect: boolean }[];
  codeSnippet?: string;
  starterCodeJson?: Record<string, string>;
  supportedLanguagesJson?: string[];
  solutionCode?: string;
  points: number;
  estimatedTimeSeconds: number;
  explanationMdx: string;
  scoringRulesJson?: Record<string, unknown>;
  metadataJson?: Record<string, unknown>;
}

export const SEED_ASSESSMENT_QUESTIONS: SeedAssessmentQuestion[] = [
  // 1. Python Basics / Variables - MCQ
  {
    topicSlug: 'python-data-types-variables',
    questionType: AssessmentQuestionType.MCQ,
    difficulty: ProblemDifficulty.EASY,
    promptMdx: 'What is the type of the result when dividing two integers in Python 3 using the `/` operator (e.g., `7 / 2`)?',
    options: [
      { id: 'opt_1_1', sequence: 1, optionText: 'float', isCorrect: true },
      { id: 'opt_1_2', sequence: 2, optionText: 'int', isCorrect: false },
      { id: 'opt_1_3', sequence: 3, optionText: 'Decimal', isCorrect: false },
      { id: 'opt_1_4', sequence: 4, optionText: 'double', isCorrect: false },
    ],
    points: 10,
    estimatedTimeSeconds: 45,
    explanationMdx: 'In Python 3, the single slash division operator `/` always returns a `float`, even if the division is exact (e.g. `4 / 2` yields `2.0`). For integer division, use `//`.',
  },
  // 2. Control Flow - Output Prediction
  {
    topicSlug: 'python-control-flow',
    questionType: AssessmentQuestionType.OUTPUT_PREDICTION,
    difficulty: ProblemDifficulty.EASY,
    promptMdx: 'What will be the output of the following Python loop?',
    codeSnippet: `count = 0
for i in range(1, 5):
    if i % 2 == 0:
        continue
    count += i
print(count)`,
    options: [
      { id: 'opt_2_1', sequence: 1, optionText: '4', isCorrect: true }, // 1 + 3 = 4
      { id: 'opt_2_2', sequence: 2, optionText: '10', isCorrect: false },
      { id: 'opt_2_3', sequence: 3, optionText: '6', isCorrect: false },
      { id: 'opt_2_4', sequence: 4, optionText: '0', isCorrect: false },
    ],
    points: 10,
    estimatedTimeSeconds: 60,
    explanationMdx: 'The loop iterates over numbers `1, 2, 3, 4`. For even numbers `2` and `4`, `continue` skips the addition. The sum is `1 + 3 = 4`.',
  },
  // 3. Functions - Debugging
  {
    topicSlug: 'python-functions-modularization',
    questionType: AssessmentQuestionType.DEBUGGING,
    difficulty: ProblemDifficulty.MEDIUM,
    promptMdx: 'A programmer intended to compute the factorial of a positive integer `n`, but the function throws a `RecursionError` on large values and fails on `n = 0`. Identify the root defect in the code snippet.',
    codeSnippet: `def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)`,
    options: [
      { id: 'opt_3_1', sequence: 1, optionText: 'The base case fails to handle n = 0, causing infinite recursion for 0.', isCorrect: true },
      { id: 'opt_3_2', sequence: 2, optionText: 'The multiplication operator cannot be used recursively in Python.', isCorrect: false },
      { id: 'opt_3_3', sequence: 3, optionText: 'Variable n is out of scope inside the recursive call.', isCorrect: false },
      { id: 'opt_3_4', sequence: 4, optionText: 'The function must use global state to store the accumulator.', isCorrect: false },
    ],
    points: 15,
    estimatedTimeSeconds: 90,
    explanationMdx: '`0! = 1` by definition. If `n = 0` is passed, `factorial(0)` calls `factorial(-1)`, `factorial(-2)`, etc., until maximum recursion depth is exceeded.',
  },
  // 4. Data Structures / Lists & Dicts - Code Completion
  {
    topicSlug: 'python-data-structures',
    questionType: AssessmentQuestionType.CODE_COMPLETION,
    difficulty: ProblemDifficulty.MEDIUM,
    promptMdx: 'Fill in the blank to build a dictionary that maps each word to its character length using a dictionary comprehension:\n\n```python\nwords = ["apple", "banana", "cherry"]\nlengths = { ___ for w in words }\n```',
    options: [
      { id: 'opt_4_1', sequence: 1, optionText: 'w: len(w)', isCorrect: true },
      { id: 'opt_4_2', sequence: 2, optionText: 'len(w): w', isCorrect: false },
      { id: 'opt_4_3', sequence: 3, optionText: 'w -> len(w)', isCorrect: false },
      { id: 'opt_4_4', sequence: 4, optionText: '[w, len(w)]', isCorrect: false },
    ],
    points: 15,
    estimatedTimeSeconds: 60,
    explanationMdx: 'In Python dictionary comprehensions, key-value pairs are specified as `key: value`. Thus `w: len(w)` correctly maps word to length.',
  },
  // 5. Algorithms / Sorting & Searching - Complexity Analysis
  {
    topicSlug: 'python-operators-expressions',
    questionType: AssessmentQuestionType.COMPLEXITY_ANALYSIS,
    difficulty: ProblemDifficulty.MEDIUM,
    promptMdx: 'What is the average-case and worst-case time complexity of standard Binary Search on a sorted array of size N?',
    options: [
      { id: 'opt_5_1', sequence: 1, optionText: 'Average: O(log N), Worst: O(log N)', isCorrect: true },
      { id: 'opt_5_2', sequence: 2, optionText: 'Average: O(log N), Worst: O(N)', isCorrect: false },
      { id: 'opt_5_3', sequence: 3, optionText: 'Average: O(1), Worst: O(N log N)', isCorrect: false },
      { id: 'opt_5_4', sequence: 4, optionText: 'Average: O(N), Worst: O(N^2)', isCorrect: false },
    ],
    points: 15,
    estimatedTimeSeconds: 60,
    explanationMdx: 'Binary Search halves the search space at each iteration, resulting in both average and worst-case time complexity of O(log N).',
  },
  // 6. OOP / Classes - Multiple Select
  {
    topicSlug: 'python-object-oriented-functional-paradigms',
    questionType: AssessmentQuestionType.MULTIPLE_SELECT,
    difficulty: ProblemDifficulty.MEDIUM,
    promptMdx: 'Which of the following are valid statements regarding Object-Oriented Programming principles? (Select all that apply)',
    options: [
      { id: 'opt_6_1', sequence: 1, optionText: 'Encapsulation restricts direct access to some of an object\'s components to prevent unintended modifications.', isCorrect: true },
      { id: 'opt_6_2', sequence: 2, optionText: 'Polymorphism allows subclasses to provide specific implementations of methods defined by their superclasses.', isCorrect: true },
      { id: 'opt_6_3', sequence: 3, optionText: 'Inheritance eliminates the need for unit testing in derived classes.', isCorrect: false },
      { id: 'opt_6_4', sequence: 4, optionText: 'Abstract classes can be directly instantiated with constructor arguments.', isCorrect: false },
    ],
    points: 20,
    estimatedTimeSeconds: 90,
    explanationMdx: 'Encapsulation and Polymorphism are fundamental pillars of OOP. Inheritance does not eliminate testing, and abstract classes cannot be instantiated directly.',
  },
  // 7. Advanced Recursion / Memoization - Coding Challenge
  {
    topicSlug: 'python-memory-concurrency',
    questionType: AssessmentQuestionType.CODING_PROBLEM,
    difficulty: ProblemDifficulty.DIFFICULT,
    promptMdx: 'Implement a function `climbStairs(n)` that calculates how many distinct ways you can climb to the top of a staircase with `n` steps, given that each time you can either climb 1 or 2 steps.',
    starterCodeJson: {
      python: `def climbStairs(n: int) -> int:\n    # Return the number of distinct ways to climb n stairs\n    pass\n`,
      javascript: `function climbStairs(n) {\n  // Return the number of distinct ways to climb n stairs\n}\n`,
    },
    supportedLanguagesJson: ['python', 'javascript'],
    solutionCode: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    points: 25,
    estimatedTimeSeconds: 300,
    explanationMdx: 'This is isomorphic to the Fibonacci sequence: `ways(n) = ways(n-1) + ways(n-2)`. An iterative dynamic programming approach achieves O(N) time and O(1) space.',
  },
  // 8. Code Review - Code Quality & Best Practices
  {
    topicSlug: 'python-error-exception-handling',
    questionType: AssessmentQuestionType.CODE_REVIEW,
    difficulty: ProblemDifficulty.DIFFICULT,
    promptMdx: 'Review the following Python snippet designed to find duplicate elements in a list. Identify the primary performance anti-pattern.',
    codeSnippet: `def find_duplicates(numbers):
    duplicates = []
    for num in numbers:
        if numbers.count(num) > 1 and num not in duplicates:
            duplicates.append(num)
    return duplicates`,
    options: [
      { id: 'opt_8_1', sequence: 1, optionText: 'Calling `numbers.count(num)` inside the loop creates an O(N^2) time complexity bottleneck.', isCorrect: true },
      { id: 'opt_8_2', sequence: 2, optionText: 'Lists in Python cannot contain duplicate integers.', isCorrect: false },
      { id: 'opt_8_3', sequence: 3, optionText: 'The `in` operator cannot be used on lists.', isCorrect: false },
      { id: 'opt_8_4', sequence: 4, optionText: 'The function name violates PEP8 naming standards.', isCorrect: false },
    ],
    points: 20,
    estimatedTimeSeconds: 120,
    explanationMdx: '`numbers.count(num)` iterates over the entire list of size N. When invoked inside a loop that also runs N times, the overall complexity degrades to O(N^2). Using a hash set or frequency map solves this in O(N).',
  },
];

