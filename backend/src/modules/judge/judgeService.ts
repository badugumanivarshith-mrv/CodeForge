import { eq, and, asc, desc } from 'drizzle-orm';
import { db } from '../../database/connection';
import {
  submissions,
  submissionResults,
  submissionTestResults,
  languageRuntimes,
  problems,
  testCases,
  contests,
  contestProblems,
  contestParticipants,
  contestSubmissions,
  users,
} from '../../database/schema';
import {
  LanguageId,
  JudgeVerdict,
  SubmissionStatus,
  SubmitSolutionDto,
  RunCodeDto,
  JudgeRunResultDto,
  SubmissionDetailDto,
  LanguageRuntimeDto,
  SubmissionAnalysisDto,
} from '@codeforge/shared';
import { IExecutionProvider, LocalProcessExecutionProvider } from './ExecutionProvider';
import { ExecutionService } from './executionService';
import { VerdictService } from './verdictService';
import { SubmissionAnalysisService } from './submissionAnalysisService';
import { logger } from '../../core/utils/logger';

export class JudgeService {
  private executionProvider: IExecutionProvider;
  private executionService: ExecutionService;
  private analysisService: SubmissionAnalysisService;

  constructor(executionProvider?: IExecutionProvider) {
    this.executionProvider = executionProvider || new LocalProcessExecutionProvider();
    this.executionService = new ExecutionService(this.executionProvider);
    this.analysisService = new SubmissionAnalysisService();
  }

  /**
   * Retrieves available language runtimes
   */
  public async getLanguageRuntimes(): Promise<LanguageRuntimeDto[]> {
    const rows = await db
      .select()
      .from(languageRuntimes)
      .where(eq(languageRuntimes.isActive, true));

    return rows.map(r => ({
      id: r.id,
      languageId: r.languageId as LanguageId,
      displayName: r.displayName,
      version: r.version,
      compilerPath: r.compilerPath || undefined,
      runtimePath: r.runtimePath || undefined,
      compileCommand: r.compileCommand || undefined,
      runCommand: r.runCommand || undefined,
      timeLimitMultiplier: r.timeLimitMultiplier,
      memoryLimitMultiplier: r.memoryLimitMultiplier,
      isCompiled: r.isCompiled,
      isActive: r.isActive,
    }));
  }

  /**
   * Runs solution against sample test cases or custom input with fast feedback
   */
  public async runSample(request: RunCodeDto): Promise<JudgeRunResultDto> {
    const { problemId, languageId, sourceCode, customInput } = request;

    // Fetch problem and language runtime
    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.id, problemId))
      .limit(1);

    if (!problem) {
      throw new Error(`Problem with ID '${problemId}' not found.`);
    }

    const [runtime] = await db
      .select()
      .from(languageRuntimes)
      .where(eq(languageRuntimes.languageId, languageId))
      .limit(1);

    // Fetch sample test cases
    let testList: { sequence: number; inputData: string; expectedOutput: string; isSample: boolean }[] = [];

    if (customInput !== undefined && customInput !== null) {
      testList = [
        {
          sequence: 1,
          inputData: customInput,
          expectedOutput: '',
          isSample: true,
        },
      ];
    } else {
      const sampleCases = await db
        .select()
        .from(testCases)
        .where(and(eq(testCases.problemId, problemId), eq(testCases.isSample, true)))
        .orderBy(asc(testCases.sequence));

      testList = sampleCases.map(tc => ({
        sequence: tc.sequence,
        inputData: tc.inputData,
        expectedOutput: tc.expectedOutput,
        isSample: true,
      }));
    }

    // If no sample cases found, provide a fallback single run
    if (testList.length === 0) {
      testList = [{ sequence: 1, inputData: '', expectedOutput: '', isSample: true }];
    }

    const evaluation = await this.executionService.evaluateSubmission({
      languageId,
      sourceCode,
      testCases: testList,
      baseTimeLimitMs: problem.timeLimitMs || 2000,
      baseMemoryLimitMb: problem.memoryLimitMb || 256,
      timeLimitMultiplier: runtime?.timeLimitMultiplier || 1,
      memoryLimitMultiplier: runtime?.memoryLimitMultiplier || 1,
      compilerCommand: runtime?.compileCommand || undefined,
      runCommand: runtime?.runCommand || undefined,
      isCompiled: runtime?.isCompiled || false,
    });

    return {
      status: evaluation.status,
      verdict: evaluation.verdict,
      executionTimeMs: evaluation.totalRuntimeMs,
      memoryKb: evaluation.peakMemoryKb,
      compileOutput: evaluation.compileOutput,
      sampleResults: evaluation.testResults.map(r => ({
        sequence: r.sequence,
        inputData: r.inputData,
        expectedOutput: r.expectedOutput,
        actualOutput: r.actualOutput,
        isPassed: r.isPassed,
        executionTimeMs: r.executionTimeMs,
        memoryKb: r.memoryKb,
        errorMessage: r.errorMessage,
      })),
    };
  }

  /**
   * Submits solution for full official judging against all test cases
   */
  public async submitSolution(userId: string, dto: SubmitSolutionDto): Promise<SubmissionDetailDto> {
    const { problemId, languageId, sourceCode, contestId } = dto;

    // 1. Fetch problem and runtime
    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.id, problemId))
      .limit(1);

    if (!problem) {
      throw new Error(`Problem with ID '${problemId}' not found.`);
    }

    const [runtime] = await db
      .select()
      .from(languageRuntimes)
      .where(eq(languageRuntimes.languageId, languageId))
      .limit(1);

    // 2. Fetch all test cases
    const allCases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.problemId, problemId))
      .orderBy(asc(testCases.sequence));

    // 3. Create initial submission record in QUEUED / COMPILING state
    const [sub] = await db
      .insert(submissions)
      .values({
        userId,
        problemId,
        contestId: contestId || null,
        languageId,
        sourceCode,
        status: SubmissionStatus.COMPILING,
        passedTestCases: 0,
        totalTestCases: allCases.length,
      })
      .returning();

    // 4. Run execution
    const evaluation = await this.executionService.evaluateSubmission({
      languageId,
      sourceCode,
      testCases: allCases.map(tc => ({
        id: tc.id,
        sequence: tc.sequence,
        inputData: tc.inputData,
        expectedOutput: tc.expectedOutput,
        isSample: tc.isSample,
      })),
      baseTimeLimitMs: problem.timeLimitMs || 2000,
      baseMemoryLimitMb: problem.memoryLimitMb || 256,
      timeLimitMultiplier: runtime?.timeLimitMultiplier || 1,
      memoryLimitMultiplier: runtime?.memoryLimitMultiplier || 1,
      compilerCommand: runtime?.compileCommand || undefined,
      runCommand: runtime?.runCommand || undefined,
      isCompiled: runtime?.isCompiled || false,
    });

    const judgedAt = new Date();

    // 5. Update submission record
    await db
      .update(submissions)
      .set({
        status: evaluation.status,
        verdict: evaluation.verdict,
        executionTimeMs: evaluation.totalRuntimeMs,
        memoryUsedKb: evaluation.peakMemoryKb,
        passedTestCases: evaluation.passedTestCases,
        totalTestCases: evaluation.totalTestCases,
        compileOutput: evaluation.compileOutput || null,
        judgedAt,
      })
      .where(eq(submissions.id, sub.id));

    // 6. Save submission results summary
    const [resultRow] = await db
      .insert(submissionResults)
      .values({
        submissionId: sub.id,
        status: evaluation.status,
        verdict: evaluation.verdict,
        totalRuntimeMs: evaluation.totalRuntimeMs,
        peakMemoryKb: evaluation.peakMemoryKb,
        verdictDetailsJson: {
          passedTestCases: evaluation.passedTestCases,
          totalTestCases: evaluation.totalTestCases,
          verdict: evaluation.verdict,
        },
      })
      .returning();

    // 7. Save individual test case results
    for (const tr of evaluation.testResults) {
      await db.insert(submissionTestResults).values({
        submissionId: sub.id,
        testCaseId: tr.testCaseId || null,
        status: VerdictService.mapVerdictToStatus(tr.verdict),
        actualOutput: tr.actualOutput,
        executionTimeMs: tr.executionTimeMs,
        memoryKb: tr.memoryKb,
        errorMessage: tr.errorMessage || null,
      });
    }

    // 8. Contest updates if submission is inside a contest
    if (contestId) {
      await this.handleContestSubmissionUpdate(userId, contestId, problemId, sub.id, evaluation.verdict);
    }

    // 9. Fetch user and problem details for sanitized return DTO
    const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId)).limit(1);

    const sanitizedTestResults = evaluation.testResults.map((tr, idx) => ({
      id: `${sub.id}-${idx}`,
      submissionId: sub.id,
      testCaseId: tr.testCaseId,
      sequence: tr.sequence,
      status: tr.verdict,
      isSample: tr.isSample,
      inputData: tr.isSample ? tr.inputData : null,
      expectedOutput: tr.isSample ? tr.expectedOutput : null,
      actualOutput: tr.isSample ? tr.actualOutput : null,
      executionTimeMs: tr.executionTimeMs,
      memoryKb: tr.memoryKb,
      errorMessage: tr.errorMessage || null,
    }));

    return {
      id: sub.id,
      userId,
      username: user?.username || 'Unknown',
      problemId,
      problemTitle: problem.title,
      problemSlug: problem.slug,
      contestId: contestId || undefined,
      languageId,
      sourceCode,
      status: evaluation.status,
      verdict: evaluation.verdict,
      executionTimeMs: evaluation.totalRuntimeMs,
      memoryUsedKb: evaluation.peakMemoryKb,
      passedTestCases: evaluation.passedTestCases,
      totalTestCases: evaluation.totalTestCases,
      compileOutput: evaluation.compileOutput || null,
      createdAt: sub.createdAt.toISOString(),
      judgedAt: judgedAt.toISOString(),
      result: {
        id: resultRow.id,
        submissionId: sub.id,
        status: evaluation.status,
        verdict: evaluation.verdict,
        totalRuntimeMs: evaluation.totalRuntimeMs,
        peakMemoryKb: evaluation.peakMemoryKb,
        passedTestCases: evaluation.passedTestCases,
        totalTestCases: evaluation.totalTestCases,
        compileOutput: evaluation.compileOutput,
        testResults: sanitizedTestResults,
      },
      testResults: sanitizedTestResults,
    };
  }

  /**
   * Retrieves single submission detail with hidden tests sanitized
   */
  public async getSubmissionDetail(id: string, requestingUserId?: string): Promise<SubmissionDetailDto | null> {
    const [sub] = await db
      .select({
        submission: submissions,
        user: { username: users.username },
        problem: { title: problems.title, slug: problems.slug },
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.userId, users.id))
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.id, id))
      .limit(1);

    if (!sub) return null;

    const [resultRow] = await db
      .select()
      .from(submissionResults)
      .where(eq(submissionResults.submissionId, id))
      .limit(1);

    const testResultRows = await db
      .select({
        testResult: submissionTestResults,
        testCase: testCases,
      })
      .from(submissionTestResults)
      .leftJoin(testCases, eq(submissionTestResults.testCaseId, testCases.id))
      .where(eq(submissionTestResults.submissionId, id));

    const sanitizedTestResults = testResultRows.map((row, idx) => {
      const isSample = row.testCase?.isSample ?? true;
      return {
        id: row.testResult.id,
        submissionId: id,
        testCaseId: row.testResult.testCaseId || undefined,
        sequence: row.testCase?.sequence ?? idx + 1,
        status: row.testResult.status as SubmissionStatus,
        isSample,
        actualOutput: isSample ? row.testResult.actualOutput : '[Hidden Test Case]',
        expectedOutput: isSample ? row.testCase?.expectedOutput || null : null,
        inputData: isSample ? row.testCase?.inputData || null : null,
        executionTimeMs: row.testResult.executionTimeMs,
        memoryKb: row.testResult.memoryKb,
        errorMessage: row.testResult.errorMessage || null,
      };
    });

    const isAccepted = sub.submission.verdict === JudgeVerdict.ACCEPTED || sub.submission.status === SubmissionStatus.ACCEPTED;
    const verdict = (sub.submission.verdict as JudgeVerdict) || (isAccepted ? JudgeVerdict.ACCEPTED : JudgeVerdict.WRONG_ANSWER);

    return {
      id: sub.submission.id,
      userId: sub.submission.userId,
      username: sub.user?.username || 'Unknown',
      problemId: sub.submission.problemId,
      problemTitle: sub.problem?.title || 'Unknown Problem',
      problemSlug: sub.problem?.slug || '',
      contestId: sub.submission.contestId || undefined,
      languageId: sub.submission.languageId as LanguageId,
      sourceCode: sub.submission.sourceCode,
      status: sub.submission.status as SubmissionStatus,
      verdict,
      executionTimeMs: sub.submission.executionTimeMs,
      memoryUsedKb: sub.submission.memoryUsedKb,
      passedTestCases: sub.submission.passedTestCases,
      totalTestCases: sub.submission.totalTestCases,
      compileOutput: sub.submission.compileOutput,
      createdAt: sub.submission.createdAt.toISOString(),
      judgedAt: sub.submission.judgedAt ? sub.submission.judgedAt.toISOString() : null,
      result: resultRow
        ? {
            id: resultRow.id,
            submissionId: id,
            status: resultRow.status as SubmissionStatus,
            verdict: (resultRow.verdict as JudgeVerdict) || verdict,
            totalRuntimeMs: resultRow.totalRuntimeMs,
            peakMemoryKb: resultRow.peakMemoryKb,
            passedTestCases: sub.submission.passedTestCases,
            totalTestCases: sub.submission.totalTestCases,
            compileOutput: sub.submission.compileOutput,
            testResults: sanitizedTestResults,
          }
        : undefined,
      testResults: sanitizedTestResults,
    };
  }

  /**
   * Generates AI submission analysis
   */
  public async getSubmissionAnalysis(submissionId: string): Promise<SubmissionAnalysisDto> {
    const [sub] = await db
      .select({
        submission: submissions,
        problem: { title: problems.title, difficulty: problems.difficulty },
      })
      .from(submissions)
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.id, submissionId))
      .limit(1);

    if (!sub) {
      throw new Error(`Submission with ID '${submissionId}' not found.`);
    }

    const [firstErrorResult] = await db
      .select()
      .from(submissionTestResults)
      .where(
        and(
          eq(submissionTestResults.submissionId, submissionId),
          eq(submissionTestResults.status, SubmissionStatus.RUNTIME_ERROR),
        ),
      )
      .limit(1);

    const verdict = (sub.submission.verdict as JudgeVerdict) || (sub.submission.status as unknown as JudgeVerdict);

    return await this.analysisService.analyzeSubmission({
      submissionId,
      sourceCode: sub.submission.sourceCode,
      languageId: sub.submission.languageId as LanguageId,
      verdict,
      compileOutput: sub.submission.compileOutput,
      errorMessage: firstErrorResult?.errorMessage,
      problemTitle: sub.problem?.title,
      problemDifficulty: sub.problem?.difficulty,
    });
  }

  /**
   * Contest participant score & penalty updater using ICPC 20-minute rules
   */
  private async handleContestSubmissionUpdate(
    userId: string,
    contestId: string,
    problemId: string,
    submissionId: string,
    verdict: JudgeVerdict,
  ): Promise<void> {
    try {
      // Find participant
      const [participant] = await db
        .select()
        .from(contestParticipants)
        .where(and(eq(contestParticipants.contestId, contestId), eq(contestParticipants.userId, userId)))
        .limit(1);

      if (!participant) {
        logger.warn({ userId, contestId }, 'Participant not registered in contest during submission');
        return;
      }

      // Check contest start time
      const [contest] = await db.select().from(contests).where(eq(contests.id, contestId)).limit(1);
      const contestStartTime = contest?.startAt?.getTime() || Date.now();
      const elapsedMinutes = Math.max(0, Math.floor((Date.now() - contestStartTime) / (1000 * 60)));

      // Check problem contest configuration
      const [cProblem] = await db
        .select()
        .from(contestProblems)
        .where(and(eq(contestProblems.contestId, contestId), eq(contestProblems.problemId, problemId)))
        .limit(1);

      const problemPoints = cProblem?.points || 100;
      const isPassed = verdict === JudgeVerdict.ACCEPTED;

      // Count previous failed attempts for this problem by participant
      const previousAttempts = await db
        .select()
        .from(contestSubmissions)
        .where(
          and(
            eq(contestSubmissions.contestId, contestId),
            eq(contestSubmissions.participantId, participant.id),
            eq(contestSubmissions.problemId, problemId),
          ),
        );

      const alreadySolved = previousAttempts.some(a => a.isPassed);

      let penaltyApplied = 0;
      let scoreEarned = 0;

      if (isPassed && !alreadySolved) {
        scoreEarned = problemPoints;
        const failedPriorCount = previousAttempts.filter(a => !a.isPassed).length;
        penaltyApplied = elapsedMinutes + failedPriorCount * (cProblem?.penaltyMinutes || 20);
      }

      // Record contest submission
      await db.insert(contestSubmissions).values({
        contestId,
        participantId: participant.id,
        problemId,
        submissionId,
        scoreEarned,
        isPassed,
        penaltyAppliedMinutes: penaltyApplied,
      });

      if (isPassed && !alreadySolved) {
        const newScore = participant.score + scoreEarned;
        const newPenalty = participant.penaltyTimeMinutes + penaltyApplied;

        await db
          .update(contestParticipants)
          .set({
            score: newScore,
            penaltyTimeMinutes: newPenalty,
          })
          .where(eq(contestParticipants.id, participant.id));

        // Recalculate ranks across participants
        await this.recalculateContestRanks(contestId);
      }
    } catch (contestErr) {
      logger.error({ contestErr, userId, contestId }, 'Error updating contest standings on submission');
    }
  }

  private async recalculateContestRanks(contestId: string): Promise<void> {
    const participants = await db
      .select()
      .from(contestParticipants)
      .where(eq(contestParticipants.contestId, contestId))
      .orderBy(desc(contestParticipants.score), asc(contestParticipants.penaltyTimeMinutes));

    for (let i = 0; i < participants.length; i++) {
      const rank = i + 1;
      await db
        .update(contestParticipants)
        .set({ rank })
        .where(eq(contestParticipants.id, participants[i].id));
    }
  }
}
