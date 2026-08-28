import { JudgeVerdict, SubmissionStatus } from '@codeforge/shared';
import { ExecutionResult } from './types';

export class VerdictService {
  private static readonly EPSILON = 1e-6;

  /**
   * Normalizes an output string for reliable competitive programming comparison
   */
  public static normalizeOutput(output: string): string {
    if (!output) return '';
    return output
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      .trim();
  }

  /**
   * Evaluates if actual output matches expected output using exact, token, and floating-point logic
   */
  public static compareOutputs(actual: string, expected: string): boolean {
    const normActual = this.normalizeOutput(actual);
    const normExpected = this.normalizeOutput(expected);

    // 1. Direct normalized string match
    if (normActual === normExpected) {
      return true;
    }

    // 2. Token-by-token comparison (ignoring differing whitespace configurations)
    const actualTokens = normActual.split(/\s+/).filter(Boolean);
    const expectedTokens = normExpected.split(/\s+/).filter(Boolean);

    if (actualTokens.length !== expectedTokens.length) {
      return false;
    }

    for (let i = 0; i < actualTokens.length; i++) {
      const a = actualTokens[i];
      const e = expectedTokens[i];

      if (a === e) continue;

      // Check numeric equivalence with floating point tolerance
      const numA = Number(a);
      const numE = Number(e);
      if (!isNaN(numA) && !isNaN(numE) && a !== '' && e !== '') {
        if (Math.abs(numA - numE) <= this.EPSILON) {
          continue;
        }
      }

      return false;
    }

    return true;
  }

  /**
   * Determines single test case verdict from execution result
   */
  public static evaluateTestCase(
    result: ExecutionResult,
    expectedOutput: string,
    timeLimitMs: number,
    memoryLimitMb: number,
  ): { verdict: JudgeVerdict; isPassed: boolean; errorMessage?: string } {
    if (result.isTimeout || result.executionTimeMs > timeLimitMs) {
      return {
        verdict: JudgeVerdict.TIME_LIMIT_EXCEEDED,
        isPassed: false,
        errorMessage: `Time limit exceeded (${result.executionTimeMs}ms > ${timeLimitMs}ms)`,
      };
    }

    if (result.isMemoryExceeded || (result.memoryKb && result.memoryKb > memoryLimitMb * 1024)) {
      return {
        verdict: JudgeVerdict.MEMORY_LIMIT_EXCEEDED,
        isPassed: false,
        errorMessage: `Memory limit exceeded (${result.memoryKb}KB > ${memoryLimitMb * 1024}KB)`,
      };
    }

    if (result.isOutputExceeded) {
      return {
        verdict: JudgeVerdict.OUTPUT_LIMIT_EXCEEDED,
        isPassed: false,
        errorMessage: 'Output limit exceeded (exceeded 64KB stdout limit)',
      };
    }

    if (result.exitCode !== 0 && result.exitCode !== null) {
      return {
        verdict: JudgeVerdict.RUNTIME_ERROR,
        isPassed: false,
        errorMessage: result.stderr || result.error || `Runtime error with exit code ${result.exitCode}`,
      };
    }

    const isMatch = this.compareOutputs(result.stdout, expectedOutput);
    if (isMatch) {
      return {
        verdict: JudgeVerdict.ACCEPTED,
        isPassed: true,
      };
    } else {
      return {
        verdict: JudgeVerdict.WRONG_ANSWER,
        isPassed: false,
        errorMessage: 'Actual output did not match expected output',
      };
    }
  }

  /**
   * Aggregates test case verdicts into overall submission verdict
   */
  public static aggregateVerdicts(verdicts: JudgeVerdict[]): JudgeVerdict {
    if (verdicts.length === 0) {
      return JudgeVerdict.INTERNAL_ERROR;
    }

    // Priority ordering
    const priority = [
      JudgeVerdict.INTERNAL_ERROR,
      JudgeVerdict.COMPILATION_ERROR,
      JudgeVerdict.TIME_LIMIT_EXCEEDED,
      JudgeVerdict.MEMORY_LIMIT_EXCEEDED,
      JudgeVerdict.OUTPUT_LIMIT_EXCEEDED,
      JudgeVerdict.RUNTIME_ERROR,
      JudgeVerdict.WRONG_ANSWER,
      JudgeVerdict.ACCEPTED,
    ];

    for (const p of priority) {
      if (verdicts.includes(p)) {
        return p;
      }
    }

    return JudgeVerdict.ACCEPTED;
  }

  /**
   * Maps JudgeVerdict to SubmissionStatus
   */
  public static mapVerdictToStatus(verdict: JudgeVerdict): SubmissionStatus {
    switch (verdict) {
      case JudgeVerdict.ACCEPTED:
        return SubmissionStatus.ACCEPTED;
      case JudgeVerdict.WRONG_ANSWER:
        return SubmissionStatus.WRONG_ANSWER;
      case JudgeVerdict.TIME_LIMIT_EXCEEDED:
        return SubmissionStatus.TIME_LIMIT_EXCEEDED;
      case JudgeVerdict.MEMORY_LIMIT_EXCEEDED:
        return SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
      case JudgeVerdict.OUTPUT_LIMIT_EXCEEDED:
        return SubmissionStatus.OUTPUT_LIMIT_EXCEEDED;
      case JudgeVerdict.RUNTIME_ERROR:
        return SubmissionStatus.RUNTIME_ERROR;
      case JudgeVerdict.COMPILATION_ERROR:
        return SubmissionStatus.COMPILATION_ERROR;
      case JudgeVerdict.INTERNAL_ERROR:
      default:
        return SubmissionStatus.INTERNAL_ERROR;
    }
  }
}
