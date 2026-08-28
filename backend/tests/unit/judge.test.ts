import { test, describe } from 'node:test';
import assert from 'node:assert';
import { VerdictService } from '../../src/modules/judge/verdictService';
import { CompilationService } from '../../src/modules/judge/compilationService';
import { JudgeVerdict, LanguageId, SubmissionStatus } from '@codeforge/shared';
import { IExecutionProvider, ProcessExecutionResult } from '../../src/modules/judge/ExecutionProvider';
import { ExecutionResult } from '../../src/modules/judge/types';

// Mock Execution Provider for Unit Testing
class MockExecutionProvider implements IExecutionProvider {
  constructor(private mockResult?: ProcessExecutionResult) {}

  async execute(): Promise<ProcessExecutionResult> {
    return this.mockResult || {
      stdout: '',
      stderr: '',
      exitCode: 0,
      executionTimeMs: 10,
      memoryKb: 1000,
      isTimedOut: false,
      isMemoryExceeded: false,
      isOutputLimitExceeded: false,
    };
  }

  async compile(): Promise<{ success: boolean; compileOutput: string; compilationTimeMs: number }> {
    return {
      success: true,
      compileOutput: '',
      compilationTimeMs: 10,
    };
  }
}

describe('Judge Engine Unit Tests', () => {
  const compilationService = new CompilationService(new MockExecutionProvider());

  describe('VerdictService - Output Normalization & Comparison', () => {
    test('1. Exact match with identical outputs', () => {
      const match = VerdictService.compareOutputs('Hello World', 'Hello World');
      assert.strictEqual(match, true);
    });

    test('2. Match with trailing whitespaces and CRLF / LF line endings', () => {
      const actual = 'line1 \r\nline2  \r\n\n';
      const expected = 'line1\nline2\n';
      assert.strictEqual(VerdictService.compareOutputs(actual, expected), true);
    });

    test('3. Token-by-token comparison with varying internal spacing', () => {
      const actual = '1   2    3 \n 4   5';
      const expected = '1 2 3\n4 5';
      assert.strictEqual(VerdictService.compareOutputs(actual, expected), true);
    });

    test('4. Floating point comparison within 1e-6 epsilon tolerance', () => {
      const actual = '3.14159265';
      const expected = '3.14159270';
      assert.strictEqual(VerdictService.compareOutputs(actual, expected), true);
    });

    test('5. Floating point mismatch beyond tolerance', () => {
      const actual = '3.141500';
      const expected = '3.141592';
      assert.strictEqual(VerdictService.compareOutputs(actual, expected), false);
    });
  });

  describe('VerdictService - Single Test Case Classification', () => {
    test('6. Classify ACCEPTED when output matches within time & memory limits', () => {
      const res: ExecutionResult = {
        stdout: '42\n',
        stderr: '',
        exitCode: 0,
        executionTimeMs: 120,
        memoryKb: 15000,
        isTimeout: false,
        isMemoryExceeded: false,
        isOutputExceeded: false,
      };

      const { verdict, isPassed } = VerdictService.evaluateTestCase(res, '42', 1000, 256);
      assert.strictEqual(verdict, JudgeVerdict.ACCEPTED);
      assert.strictEqual(isPassed, true);
    });

    test('7. Classify WRONG_ANSWER when output mismatches', () => {
      const res: ExecutionResult = {
        stdout: '100\n',
        stderr: '',
        exitCode: 0,
        executionTimeMs: 120,
        memoryKb: 15000,
        isTimeout: false,
        isMemoryExceeded: false,
        isOutputExceeded: false,
      };

      const { verdict, isPassed } = VerdictService.evaluateTestCase(res, '42', 1000, 256);
      assert.strictEqual(verdict, JudgeVerdict.WRONG_ANSWER);
      assert.strictEqual(isPassed, false);
    });

    test('8. Classify TIME_LIMIT_EXCEEDED when execution times out', () => {
      const res: ExecutionResult = {
        stdout: '',
        stderr: '',
        exitCode: null,
        executionTimeMs: 1050,
        memoryKb: 15000,
        isTimeout: true,
        isMemoryExceeded: false,
        isOutputExceeded: false,
      };

      const { verdict, isPassed } = VerdictService.evaluateTestCase(res, '42', 1000, 256);
      assert.strictEqual(verdict, JudgeVerdict.TIME_LIMIT_EXCEEDED);
      assert.strictEqual(isPassed, false);
    });

    test('9. Classify MEMORY_LIMIT_EXCEEDED when process exceeds memory threshold', () => {
      const res: ExecutionResult = {
        stdout: '',
        stderr: '',
        exitCode: 137,
        executionTimeMs: 200,
        memoryKb: 300000,
        isTimeout: false,
        isMemoryExceeded: true,
        isOutputExceeded: false,
      };

      const { verdict, isPassed } = VerdictService.evaluateTestCase(res, '42', 1000, 256);
      assert.strictEqual(verdict, JudgeVerdict.MEMORY_LIMIT_EXCEEDED);
      assert.strictEqual(isPassed, false);
    });

    test('10. Classify OUTPUT_LIMIT_EXCEEDED when stdout exceeds truncation limit', () => {
      const res: ExecutionResult = {
        stdout: 'A'.repeat(65536),
        stderr: '',
        exitCode: 0,
        executionTimeMs: 200,
        memoryKb: 15000,
        isTimeout: false,
        isMemoryExceeded: false,
        isOutputExceeded: true,
      };

      const { verdict, isPassed } = VerdictService.evaluateTestCase(res, '42', 1000, 256);
      assert.strictEqual(verdict, JudgeVerdict.OUTPUT_LIMIT_EXCEEDED);
      assert.strictEqual(isPassed, false);
    });

    test('11. Classify RUNTIME_ERROR on non-zero exit code or stderr crash', () => {
      const res: ExecutionResult = {
        stdout: '',
        stderr: 'ZeroDivisionError: division by zero',
        exitCode: 1,
        executionTimeMs: 80,
        memoryKb: 14000,
        isTimeout: false,
        isMemoryExceeded: false,
        isOutputExceeded: false,
      };

      const { verdict, isPassed } = VerdictService.evaluateTestCase(res, '42', 1000, 256);
      assert.strictEqual(verdict, JudgeVerdict.RUNTIME_ERROR);
      assert.strictEqual(isPassed, false);
    });
  });

  describe('VerdictService - Verdict Aggregation Priority', () => {
    test('12. Aggregate verdicts with highest severity priority (CE > RTE > TLE > MLE > OLE > WA > AC)', () => {
      assert.strictEqual(
        VerdictService.aggregateVerdicts([JudgeVerdict.ACCEPTED, JudgeVerdict.WRONG_ANSWER, JudgeVerdict.ACCEPTED]),
        JudgeVerdict.WRONG_ANSWER
      );

      assert.strictEqual(
        VerdictService.aggregateVerdicts([JudgeVerdict.ACCEPTED, JudgeVerdict.WRONG_ANSWER, JudgeVerdict.TIME_LIMIT_EXCEEDED]),
        JudgeVerdict.TIME_LIMIT_EXCEEDED
      );

      assert.strictEqual(
        VerdictService.aggregateVerdicts([JudgeVerdict.TIME_LIMIT_EXCEEDED, JudgeVerdict.RUNTIME_ERROR]),
        JudgeVerdict.TIME_LIMIT_EXCEEDED
      );

      assert.strictEqual(
        VerdictService.aggregateVerdicts([JudgeVerdict.ACCEPTED, JudgeVerdict.ACCEPTED]),
        JudgeVerdict.ACCEPTED
      );
    });

    test('13. Map JudgeVerdict to SubmissionStatus correctly', () => {
      assert.strictEqual(VerdictService.mapVerdictToStatus(JudgeVerdict.ACCEPTED), SubmissionStatus.ACCEPTED);
      assert.strictEqual(VerdictService.mapVerdictToStatus(JudgeVerdict.WRONG_ANSWER), SubmissionStatus.WRONG_ANSWER);
      assert.strictEqual(VerdictService.mapVerdictToStatus(JudgeVerdict.TIME_LIMIT_EXCEEDED), SubmissionStatus.TIME_LIMIT_EXCEEDED);
      assert.strictEqual(VerdictService.mapVerdictToStatus(JudgeVerdict.RUNTIME_ERROR), SubmissionStatus.RUNTIME_ERROR);
      assert.strictEqual(VerdictService.mapVerdictToStatus(JudgeVerdict.COMPILATION_ERROR), SubmissionStatus.COMPILATION_ERROR);
      assert.strictEqual(VerdictService.mapVerdictToStatus(JudgeVerdict.OUTPUT_LIMIT_EXCEEDED), SubmissionStatus.OUTPUT_LIMIT_EXCEEDED);
    });
  });

  describe('CompilationService - Language Type Detection', () => {
    test('14. Identifies compiled vs interpreted languages', () => {
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.CPP), true);
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.C), true);
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.JAVA), true);
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.GO), true);
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.RUST), true);

      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.PYTHON), false);
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.JAVASCRIPT), false);
      assert.strictEqual(compilationService.isCompilationRequired(LanguageId.TYPESCRIPT), false);
    });
  });
});
