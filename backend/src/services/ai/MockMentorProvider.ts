import {
  IAIMentorProvider,
  MentorExecutionContext,
} from './IAIMentorProvider';
import {
  SocraticHintLevel,
  SocraticHintResultDto,
  CodeReviewResultDto,
  SubmissionAnalysisResultDto,
  ConceptExplanationDto,
  TargetedPracticeDto,
  ProblemDifficulty,
  LanguageId,
} from '@codeforge/shared';

export class MockMentorProvider implements IAIMentorProvider {
  public async chat(
    context: MentorExecutionContext,
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  ): Promise<{ reply: string; tokensUsed: number }> {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const skill = context.skillLevel || 'beginner';
    const problemTitle = context.problem?.title || 'the current coding exercise';

    let reply = `I'm here to mentor you on ${problemTitle}. `;

    if (lastUserMsg.toLowerCase().includes('hint')) {
      reply += `Let's break this down conceptually. What happens when you trace this with the smallest possible input?`;
    } else if (lastUserMsg.toLowerCase().includes('error') || lastUserMsg.toLowerCase().includes('bug')) {
      reply += `Look closely at your state transitions and boundary conditions. Are you mutating variables before checking conditions?`;
    } else if (lastUserMsg.toLowerCase().includes('complexity') || lastUserMsg.toLowerCase().includes('optimize')) {
      reply += `Can you trade a bit of auxiliary memory (like a Hash Map or Set) to reduce your nested loop from O(N²) down to O(N)?`;
    } else {
      reply += `You're currently working at the **${skill.toUpperCase()}** skill tier. Consider how each data structure's access time affects your overall solution. What is your current hypothesis for the next step?`;
    }

    return {
      reply,
      tokensUsed: 120,
    };
  }

  public async generateHint(
    context: MentorExecutionContext,
    level: SocraticHintLevel,
    code: string,
  ): Promise<SocraticHintResultDto> {
    const problemTitle = context.problem?.title || 'Problem';

    switch (level) {
      case 1:
        return {
          hintLevel: 1,
          title: 'Level 1: Conceptual Direction',
          hint: `Think about what '${problemTitle}' is asking at its core. Instead of jumping directly to nested iterations, consider what relationships must hold between elements.`,
          guidingQuestion: 'Can you write down in plain English what target condition satisfies the problem?',
          nextLevelAvailable: true,
        };
      case 2:
        return {
          hintLevel: 2,
          title: 'Level 2: Technique & Pattern',
          hint: `Consider using a **Complement Lookup** or **Lookup Table** (e.g. Hash Map / Dictionary). As you iterate through each element $x$, what value $y$ are you looking for such that $x + y = \\text{target}$?`,
          guidingQuestion: 'How can storing previously seen elements allow you to check for a complement in O(1) time?',
          nextLevelAvailable: true,
        };
      case 3:
        return {
          hintLevel: 3,
          title: 'Level 3: Inspecting Your Implementation',
          hint: code && code.length > 20
            ? `In your current implementation, observe how your indices and lookups are managed. Make sure you don't use the same element twice and that your lookup happens before (or simultaneously with) insertion.`
            : `When building your loop, remember to check whether the required complement is already in your lookup map before adding the current element.`,
          guidingQuestion: 'What edge case happens if an element equals half of the target sum?',
          nextLevelAvailable: true,
        };
      case 4:
        return {
          hintLevel: 4,
          title: 'Level 4: Algorithm & Pseudocode Logic',
          hint: `1. Initialize an empty hash map \`seen = {}\`.\n2. Iterate through each index \`i\` and value \`num\` in the array.\n3. Compute \`complement = target - num\`.\n4. If \`complement\` exists in \`seen\`, return \`[seen[complement], i]\`.\n5. Otherwise, store \`seen[num] = i\`.`,
          guidingQuestion: 'Why does this single-pass approach guarantee O(N) time and O(N) space?',
          nextLevelAvailable: true,
        };
      case 5:
      default:
        return {
          hintLevel: 5,
          title: 'Level 5: Near-Solution Scaffold',
          hint: `Here is the structural blueprint:\n\`\`\`python\nseen = {}\nfor i, num in enumerate(nums):\n    diff = target - num\n    if diff in seen:\n        return [seen[diff], i]\n    seen[num] = i\nreturn []\n\`\`\`\nTry adapting this structure to your selected language!`,
          guidingQuestion: 'Have you verified your return value matches the expected format when no valid pair is found?',
          nextLevelAvailable: false,
        };
    }
  }

  public async reviewCode(
    context: MentorExecutionContext,
    code: string,
  ): Promise<CodeReviewResultDto> {
    const isShort = !code || code.trim().length < 30;
    const hasLoop = code.includes('for') || code.includes('while');
    const hasMap = code.includes('dict') || code.includes('Map') || code.includes('{') || code.includes('HashMap');

    return {
      summary: isShort
        ? 'Starter solution provided. Needs complete algorithm logic.'
        : hasMap
        ? 'Well-structured linear time solution using auxiliary lookup mapping.'
        : 'Working approach, but can be optimized from O(N²) quadratic time to O(N) linear time.',
      correctness: {
        status: isShort ? 'partially_correct' : 'correct',
        explanation: isShort
          ? 'Code appears incomplete or minimal.'
          : 'Core algorithm satisfies problem invariants without evident syntax faults.',
      },
      bugs: isShort
        ? [
            {
              description: 'Missing return statement for edge cases.',
              severity: 'major',
              fixSuggestion: 'Ensure a fallback return value is provided if no match is found.',
            },
          ]
        : [],
      edgeCases: [
        {
          caseDescription: 'Array with duplicate elements summing to target',
          handled: true,
          suggestion: 'Ensure identical values do not overwrite required earlier indices erroneously.',
        },
        {
          caseDescription: 'Negative integers and zero values',
          handled: true,
          suggestion: 'Arithmetic subtraction works uniformly across positive and negative integers.',
        },
        {
          caseDescription: 'Minimum array size (2 elements)',
          handled: true,
        },
      ],
      complexity: {
        time: hasMap ? 'O(n)' : hasLoop ? 'O(n²)' : 'O(1)',
        space: hasMap ? 'O(n)' : 'O(1)',
        explanation: hasMap
          ? 'Single pass with O(1) average hash table lookups.'
          : 'Iterating without hash table leads to nested scans.',
      },
      suggestions: [
        'Consider adding descriptive type hints to improve code readability and maintainability.',
        'Use early termination when the match is discovered to minimize unnecessary operations.',
      ],
      learningPoints: [
        'Space-Time Tradeoff: Utilizing a hash map reduces search time from O(N) to O(1) at the cost of O(N) memory.',
        'Single-Pass Pattern: Checking before inserting prevents using the same element twice.',
      ],
    };
  }

  public async analyzeSubmission(
    context: MentorExecutionContext,
    submissionData: {
      code: string;
      status: string;
      compileOutput?: string;
      passedCount: number;
      totalCount: number;
      sampleErrors?: Array<{ input: string; expected: string; actual?: string; error?: string }>;
    },
  ): Promise<SubmissionAnalysisResultDto> {
    const isCompileError = submissionData.status === 'compilation_error' || Boolean(submissionData.compileOutput);
    const isWrongAnswer = submissionData.status === 'wrong_answer';
    const isTLE = submissionData.status === 'time_limit_exceeded';

    if (isCompileError) {
      return {
        summary: 'Compilation / Syntax error detected during build.',
        errorType: 'compilation_error',
        rootCause: submissionData.compileOutput || 'Syntax error or missing semicolon/type mismatch in source code.',
        errorExplanation: 'The compiler was unable to parse your code into an executable binary/bytecode. Check line numbers reported in the build log.',
        remediationSteps: [
          'Verify that all brackets, parentheses, and indentation levels match properly.',
          'Ensure all variable and function types are defined before usage.',
          'Check for typos in standard library method names.',
        ],
        learningTakeaway: 'Always verify basic syntax and static typing before running complex algorithmic test suites.',
        suggestedHintLevel: 1,
      };
    }

    if (isTLE) {
      return {
        summary: 'Time Limit Exceeded (TLE) — Solution runtime exceeded the maximum execution quota.',
        errorType: 'time_limit_exceeded',
        rootCause: 'Algorithm time complexity is likely O(N²) or contains an infinite loop condition on large constraints.',
        errorExplanation: 'For array lengths up to 100,000, an O(N²) algorithm executes ~10^10 operations, which takes several seconds and exceeds the 1000ms limit.',
        remediationSteps: [
          'Replace nested loops with a hash map lookup table.',
          'Avoid repeated linear scans or sorting inside your main loop.',
          'Ensure your loop indices advance predictably on each iteration.',
        ],
        learningTakeaway: 'Aim for O(N) or O(N log N) time complexity when inputs exceed N = 10,000.',
        suggestedHintLevel: 2,
      };
    }

    return {
      summary: isWrongAnswer
        ? `Output mismatch on test cases. Passed ${submissionData.passedCount}/${submissionData.totalCount} tests.`
        : 'Submission execution did not produce expected output.',
      errorType: 'wrong_answer',
      rootCause: 'Edge case mishandling or index computation discrepancy.',
      errorExplanation: 'Your solution computed an output that differed from the expected answer on sample or boundary inputs.',
      remediationSteps: [
        'Trace your code manually on small sample cases (e.g. [3, 3] target 6).',
        'Verify that your 0-based vs 1-based indexing matches the problem requirements.',
        'Check whether your condition handles negative numbers and zero values correctly.',
      ],
      learningTakeaway: 'Boundary and duplicate handling are the most frequent causes of off-by-one errors in array problems.',
      suggestedHintLevel: 3,
    };
  }

  public async explainConcept(
    context: MentorExecutionContext,
    concept: string,
  ): Promise<ConceptExplanationDto> {
    const skill = context.skillLevel || 'beginner';
    const lang = context.languageId || 'python';

    return {
      concept,
      skillLevel: skill,
      analogy: `Think of ${concept} like a librarian's indexed catalog: instead of checking every book on every shelf from beginning to end, you look up the exact index card in constant time.`,
      corePrinciples: [
        'Direct Addressing / Indexing: Computing a hash value allows immediate key-to-value resolution.',
        'Collision Resolution: Efficient algorithms handle shared hash slots using chaining or open addressing.',
        'Space-Time Tradeoff: Sacrificing O(N) auxiliary space saves O(N) execution time on every query.',
      ],
      codeExamples: [
        {
          language: String(lang),
          title: `Idiomatic ${concept} Demonstration in ${String(lang).toUpperCase()}`,
          code:
            lang === LanguageId.JAVASCRIPT || lang === LanguageId.TYPESCRIPT
              ? `const map = new Map();\nmap.set('key', 42);\nif (map.has('key')) {\n  console.log(map.get('key')); // 42\n}`
              : `lookup = {}\nlookup['key'] = 42\nif 'key' in lookup:\n    print(lookup['key'])  # 42`,
          explanation: 'Standard syntax for setting, checking existence, and retrieving values in constant amortized time.',
        },
      ],
      commonPitfalls: [
        'Assuming hash map iteration order is always sorted (it is generally insertion-ordered or arbitrary).',
        'Ignoring hash collisions in high-concurrency or custom hash key implementations.',
        'Mutating mutable keys after storing them in a hash set/map.',
      ],
      prerequisiteAdvice: context.prerequisiteGaps && context.prerequisiteGaps.length > 0
        ? `Note: Reviewing ${context.prerequisiteGaps[0]} will make understanding this concept much faster.`
        : undefined,
    };
  }

  public async generatePractice(
    context: MentorExecutionContext,
    params: {
      targetSkillOrWeakness: string;
      difficulty: ProblemDifficulty;
      language: LanguageId | string;
    },
  ): Promise<TargetedPracticeDto> {
    const diff = params.difficulty || ProblemDifficulty.EASY;
    const skill = params.targetSkillOrWeakness || 'Array Operations & Lookup';

    return {
      id: `practice_${Date.now()}`,
      title: `Targeted Challenge: ${skill} Mastery`,
      targetSkillOrWeakness: skill,
      difficulty: diff,
      descriptionMdx: `### Problem Description\n\nGiven an array of integers \`nums\` and an integer \`k\`, determine if there exist two distinct indices \`i\` and \`j\` such that \`nums[i] == nums[j]\` and \`abs(i - j) <= k\`.\n\nUse your understanding of **${skill}** to optimize your approach.`,
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^9 <= nums[i] <= 10^9',
        '0 <= k <= 10^5',
      ],
      examples: [
        {
          input: 'nums = [1, 2, 3, 1], k = 3',
          output: 'true',
          explanation: 'nums[0] == nums[3] and abs(0 - 3) = 3 <= 3.',
        },
        {
          input: 'nums = [1, 2, 3, 1, 2, 3], k = 2',
          output: 'false',
          explanation: 'The difference between identical elements is at least 3, which is greater than k = 2.',
        },
      ],
      starterCode: {
        python: 'def containsNearbyDuplicate(nums: list[int], k: int) -> bool:\n    # Write your solution here\n    pass\n',
        javascript: 'function containsNearbyDuplicate(nums, k) {\n  // Write your solution here\n}\n',
        typescript: 'function containsNearbyDuplicate(nums: number[], k: number): boolean {\n  // Write your solution here\n  return false;\n}\n',
        java: 'class Solution {\n    public boolean containsNearbyDuplicate(int[] nums, int k) {\n        // Write your solution here\n        return false;\n    }\n}\n',
        cpp: 'class Solution {\npublic:\n    bool containsNearbyDuplicate(vector<int>& nums, int k) {\n        // Write your solution here\n        return false;\n    }\n};\n',
        c: '#include <stdbool.h>\n\nbool containsNearbyDuplicate(int* nums, int numsSize, int k) {\n    // Write your solution here\n    return false;\n}\n',
      },
      learningObjective: `Strengthen your capability in ${skill} by combining sliding window constraints with instant hash lookup.`,
    };
  }
}
