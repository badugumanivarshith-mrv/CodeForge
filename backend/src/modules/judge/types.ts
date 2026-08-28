import { LanguageId, JudgeVerdict, SubmissionStatus } from '@codeforge/shared';

export interface ExecutionRequest {
  languageId: LanguageId;
  sourceCode: string;
  inputData: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  outputLimitBytes?: number;
  compilerCommand?: string;
  runCommand?: string;
  isCompiled?: boolean;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  memoryKb: number;
  isTimeout: boolean;
  isMemoryExceeded: boolean;
  isOutputExceeded: boolean;
  error?: string;
}

export interface CompilationRequest {
  languageId: LanguageId;
  sourceCode: string;
  workDir: string;
  compileCommand?: string;
}

export interface CompilationResult {
  success: boolean;
  compileOutput: string;
  executablePath?: string;
  compilationTimeMs: number;
  error?: string;
}

export interface SingleTestCaseEvaluation {
  testCaseId?: string;
  sequence: number;
  isSample: boolean;
  inputData: string;
  expectedOutput: string;
  actualOutput: string;
  verdict: JudgeVerdict;
  executionTimeMs: number;
  memoryKb: number;
  errorMessage?: string;
  isPassed: boolean;
}

export interface JudgeEvaluationResult {
  verdict: JudgeVerdict;
  status: SubmissionStatus;
  totalRuntimeMs: number;
  peakMemoryKb: number;
  passedTestCases: number;
  totalTestCases: number;
  compileOutput?: string;
  testResults: SingleTestCaseEvaluation[];
}
