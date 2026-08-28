import { LanguageId, JudgeVerdict } from '@codeforge/shared';
import { IExecutionProvider } from './ExecutionProvider';
import { VerdictService } from './verdictService';
import {
  ExecutionRequest,
  SingleTestCaseEvaluation,
  JudgeEvaluationResult,
} from './types';

export interface TestCaseInput {
  id?: string;
  sequence: number;
  inputData: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface ExecutionOptions {
  languageId: LanguageId;
  sourceCode: string;
  testCases: TestCaseInput[];
  baseTimeLimitMs?: number; // default 2000 ms
  baseMemoryLimitMb?: number; // default 256 MB
  timeLimitMultiplier?: number;
  memoryLimitMultiplier?: number;
  compilerCommand?: string;
  runCommand?: string;
  isCompiled?: boolean;
}

export class ExecutionService {
  constructor(private executionProvider: IExecutionProvider) {}

  public async evaluateSubmission(options: ExecutionOptions): Promise<JudgeEvaluationResult> {
    const {
      languageId,
      sourceCode,
      testCases,
      baseTimeLimitMs = 2000,
      baseMemoryLimitMb = 256,
      timeLimitMultiplier = 1,
      memoryLimitMultiplier = 1,
      compilerCommand,
      runCommand,
      isCompiled,
    } = options;

    const timeLimitMs = Math.round(baseTimeLimitMs * timeLimitMultiplier);
    const memoryLimitMb = Math.round(baseMemoryLimitMb * memoryLimitMultiplier);

    const testResults: SingleTestCaseEvaluation[] = [];
    const testVerdicts: JudgeVerdict[] = [];
    let totalRuntimeMs = 0;
    let peakMemoryKb = 0;
    let passedTestCases = 0;

    for (const tc of testCases) {
      const execRequest: ExecutionRequest = {
        languageId,
        sourceCode,
        inputData: tc.inputData,
        timeLimitMs,
        memoryLimitMb,
        compilerCommand,
        runCommand,
        isCompiled,
      };

      const result = await this.executionProvider.execute(execRequest);

      // Check if compilation failed on first run
      if (result.error && result.error.includes('Compilation error') && isCompiled) {
        return {
          verdict: JudgeVerdict.COMPILATION_ERROR,
          status: VerdictService.mapVerdictToStatus(JudgeVerdict.COMPILATION_ERROR),
          totalRuntimeMs: 0,
          peakMemoryKb: 0,
          passedTestCases: 0,
          totalTestCases: testCases.length,
          compileOutput: result.stderr || result.error,
          testResults: [],
        };
      }

      totalRuntimeMs += result.executionTimeMs;
      if (result.memoryKb > peakMemoryKb) {
        peakMemoryKb = result.memoryKb;
      }

      const evaluation = VerdictService.evaluateTestCase(
        result,
        tc.expectedOutput,
        timeLimitMs,
        memoryLimitMb,
      );

      if (evaluation.isPassed) {
        passedTestCases++;
      }

      testVerdicts.push(evaluation.verdict);
      testResults.push({
        testCaseId: tc.id,
        sequence: tc.sequence,
        isSample: tc.isSample,
        inputData: tc.inputData,
        expectedOutput: tc.expectedOutput,
        actualOutput: result.stdout,
        verdict: evaluation.verdict,
        executionTimeMs: result.executionTimeMs,
        memoryKb: result.memoryKb,
        errorMessage: evaluation.errorMessage,
        isPassed: evaluation.isPassed,
      });
    }

    const aggregatedVerdict = VerdictService.aggregateVerdicts(testVerdicts);
    const status = VerdictService.mapVerdictToStatus(aggregatedVerdict);

    return {
      verdict: aggregatedVerdict,
      status,
      totalRuntimeMs,
      peakMemoryKb,
      passedTestCases,
      totalTestCases: testCases.length,
      testResults,
    };
  }
}
