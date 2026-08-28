import { JudgeVerdict, LanguageId, ProblemDifficulty, SubmissionAnalysisDto } from '@codeforge/shared';
import { env } from '../../config/env';
import { logger } from '../../core/utils/logger';

export interface AnalysisInput {
  submissionId: string;
  sourceCode: string;
  languageId: LanguageId;
  verdict: JudgeVerdict;
  compileOutput?: string | null;
  errorMessage?: string | null;
  problemTitle?: string;
  problemDifficulty?: ProblemDifficulty | string;
}

export class SubmissionAnalysisService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = env.GEMINI_API_KEY;
  }

  public async analyzeSubmission(input: AnalysisInput): Promise<SubmissionAnalysisDto> {
    if (this.apiKey) {
      try {
        const aiResult = await this.generateAiAnalysis(input);
        if (aiResult) {
          return aiResult;
        }
      } catch (err) {
        logger.warn({ err }, 'Gemini analysis failed, falling back to deterministic analyzer');
      }
    }

    return this.generateDeterministicAnalysis(input);
  }

  public generateDeterministicAnalysis(input: AnalysisInput): SubmissionAnalysisDto {
    const { submissionId, verdict, errorMessage, compileOutput } = input;

    let probableBugCategory = 'Logic & Implementation';
    let likelyRootCause = 'The implementation produced an output that deviated from the expected problem specification.';
    let missedEdgeCases: string[] = ['Empty input (e.g. empty array or string)', 'Single element input (N = 1)', 'Boundary values and extreme inputs (N = 10^5)'];
    let complexityConcerns = {
      estimatedTimeComplexity: 'O(N^2) or higher',
      estimatedSpaceComplexity: 'O(N)',
      analysis: 'Analyze your nested loops and recursive calls to ensure operations scale within 10^8 operations per second.',
    };

    switch (verdict) {
      case JudgeVerdict.TIME_LIMIT_EXCEEDED:
        probableBugCategory = 'Inefficient Time Complexity / Infinite Loop';
        likelyRootCause = 'The execution took longer than the allocated runtime limit. This is typically caused by O(N^2) nested loops on large constraints or an infinite loop where the loop counter is never incremented.';
        missedEdgeCases = [
          'Large inputs where N >= 10^5 requiring O(N) or O(N log N) solutions',
          'Inputs causing worst-case recursion depth',
          'Cycles in graphs or linked lists',
        ];
        complexityConcerns = {
          estimatedTimeComplexity: 'O(N^2) or O(2^N)',
          estimatedSpaceComplexity: 'O(1) to O(N)',
          analysis: 'Optimize brute-force quadratic searches using Hash Maps, Two Pointers, or Binary Search to bring time complexity down to O(N) or O(N log N).',
        };
        break;

      case JudgeVerdict.WRONG_ANSWER:
        probableBugCategory = 'Off-by-One or Unhandled Edge Case';
        likelyRootCause = 'The algorithm passed some sample inputs but failed on hidden edge cases. Common reasons include off-by-one indexing errors, integer overflow, or missing base cases.';
        missedEdgeCases = [
          'Negative numbers or zero',
          'Duplicate values in the input array',
          'Already sorted or reverse sorted arrays',
          'Empty or single-element inputs',
        ];
        complexityConcerns = {
          estimatedTimeComplexity: 'O(N)',
          estimatedSpaceComplexity: 'O(1)',
          analysis: 'Review loop boundary conditions (e.g. <= vs <) and verify that initial accumulator variables are properly initialized.',
        };
        break;

      case JudgeVerdict.RUNTIME_ERROR:
        probableBugCategory = 'Null Reference / Out-of-Bounds Exception';
        likelyRootCause = errorMessage || 'The program terminated abruptly with a runtime exception (e.g., accessing an index outside array bounds, dereferencing null, or dividing by zero).';
        missedEdgeCases = [
          'Index 0 or index N on an empty/out-of-range collection',
          'Division by zero when the denominator evaluates to 0',
          'Stack overflow from deep un-memoized recursion',
        ];
        complexityConcerns = {
          estimatedTimeComplexity: 'Undetermined (crashed early)',
          estimatedSpaceComplexity: 'O(N)',
          analysis: 'Add defensive null and bounds checks before indexing into arrays or accessing object properties.',
        };
        break;

      case JudgeVerdict.MEMORY_LIMIT_EXCEEDED:
        probableBugCategory = 'Unbounded Memory Allocation';
        likelyRootCause = 'The program exceeded the allocated memory limit due to excessive memory allocations, large matrices, or deep recursion call stack depth.';
        missedEdgeCases = ['Large input arrays that trigger deep recursion stacks'];
        complexityConcerns = {
          estimatedTimeComplexity: 'O(N)',
          estimatedSpaceComplexity: 'O(N^2) or unbounded',
          analysis: 'Replace recursive call stacks with iterative loops and reduce memory by using in-place variables rather than creating full auxiliary copies.',
        };
        break;

      case JudgeVerdict.OUTPUT_LIMIT_EXCEEDED:
        probableBugCategory = 'Excessive Logging / Infinite Output Loop';
        likelyRootCause = 'The program produced more than 64KB of standard output. This typically happens when debug print statements are left inside an unconstrained loop.';
        missedEdgeCases = ['Loops without termination conditions printing to stdout'];
        complexityConcerns = {
          estimatedTimeComplexity: 'Infinite',
          estimatedSpaceComplexity: 'O(1)',
          analysis: 'Remove all debug print/console.log statements inside loops and only print the required final answer.',
        };
        break;

      case JudgeVerdict.COMPILATION_ERROR:
        probableBugCategory = 'Syntax / Type System Error';
        likelyRootCause = compileOutput || errorMessage || 'The source code failed to compile due to syntax errors, missing imports, or mismatched type signatures.';
        missedEdgeCases = ['Compilation phase failed before runtime evaluation'];
        complexityConcerns = {
          estimatedTimeComplexity: 'N/A',
          estimatedSpaceComplexity: 'N/A',
          analysis: 'Check compiler error logs for missing semicolons, incorrect variable types, or missing function return statements.',
        };
        break;

      case JudgeVerdict.ACCEPTED:
        probableBugCategory = 'None (Solution Accepted)';
        likelyRootCause = 'The solution passed all sample and hidden test cases within the specified time and memory bounds.';
        missedEdgeCases = [];
        complexityConcerns = {
          estimatedTimeComplexity: 'Optimal',
          estimatedSpaceComplexity: 'Optimal',
          analysis: 'Great work! The solution meets all algorithmic constraints.',
        };
        break;
    }

    return {
      submissionId,
      verdict,
      probableBugCategory,
      likelyRootCause,
      missedEdgeCases,
      complexityConcerns,
      recommendedLearningTopics: [
        {
          title: 'Algorithmic Complexity & Big-O Notation',
          reason: 'Mastering time and space complexity helps avoid Time Limit Exceeded verdicts on large constraints.',
        },
        {
          title: 'Edge Case Testing & Boundary Analysis',
          reason: 'Systematic testing of edge cases (0, negative, duplicates) eliminates Wrong Answer surprises.',
        },
        {
          title: 'Data Structures: Hash Tables & Two Pointers',
          reason: 'Provides O(1) lookups and O(N) traversal techniques to optimize common algorithmic patterns.',
        },
      ],
      suggestedNextProblems: [
        {
          title: 'Two Sum & Pair Search',
          difficulty: ProblemDifficulty.EASY,
        },
        {
          title: 'Valid Palindrome & String Pointers',
          difficulty: ProblemDifficulty.EASY,
        },
        {
          title: 'Longest Substring Without Repeating Characters',
          difficulty: ProblemDifficulty.MEDIUM,
        },
      ],
    };
  }

  private async generateAiAnalysis(input: AnalysisInput): Promise<SubmissionAnalysisDto | null> {
    // If external LLM is configured, fallback to deterministic parser
    return this.generateDeterministicAnalysis(input);
  }
}
