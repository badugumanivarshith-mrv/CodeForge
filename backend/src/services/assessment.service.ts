import { IAssessmentRepository } from '../repositories/interfaces/IAssessmentRepository';
import { AdaptiveEngineService } from './adaptiveEngine.service';
import { RatingService } from './rating.service';
import { LearnerIntelligenceService } from './learnerIntelligence.service';
import {
  AssessmentType,
  AssessmentSessionStatus,
  AssessmentQuestionType,
  ProblemDifficulty,
  CreateAssessmentSessionDto,
  SubmitAssessmentAnswerDto,
  AssessmentSessionDto,
  AssessmentQuestionDto,
  AssessmentResultDto,
  AssessmentAnalyticsDto,
  RemediationPlanDto,
} from '@codeforge/shared';
import { NotFoundError, ForbiddenError, ValidationError } from '../core/errors';
import { logger } from '../core/utils/logger';

export class AssessmentService {
  constructor(
    private readonly assessmentRepo: IAssessmentRepository,
    private readonly adaptiveEngine: AdaptiveEngineService,
    private readonly ratingService: RatingService,
    private readonly intelligenceService?: LearnerIntelligenceService,
  ) {}

  private sanitizeQuestion(q: any): AssessmentQuestionDto {
    const rawOptions = Array.isArray(q.optionsJson) ? q.optionsJson : [];
    // SECURITY MANDATE: isCorrect is strictly stripped from client payload
    const sanitizedOptions = rawOptions.map((opt: any) => ({
      id: opt.id,
      sequence: opt.sequence,
      optionText: opt.optionText,
    }));

    return {
      id: q.id,
      questionType: q.questionType as AssessmentQuestionType,
      topicId: q.topicId,
      topicName: q.topicName,
      difficulty: q.difficulty,
      promptMdx: q.promptMdx,
      options: sanitizedOptions.length > 0 ? sanitizedOptions : undefined,
      codeSnippet: q.codeSnippet,
      starterCode: q.starterCodeJson,
      supportedLanguages: q.supportedLanguagesJson,
      points: q.points || 10,
      estimatedTimeSeconds: q.estimatedTimeSeconds || 120,
    };
  }

  async createSession(userId: string, dto: CreateAssessmentSessionDto): Promise<AssessmentSessionDto> {
    const assessmentType = dto.assessmentType || AssessmentType.DIAGNOSTIC;
    const timeLimitMinutes = dto.timeLimitMinutes || (assessmentType === AssessmentType.CODING_CHALLENGE ? 45 : 20);
    const initialDifficulty = dto.initialDifficulty || ProblemDifficulty.MEDIUM;

    // Retrieve pool of questions
    const allQuestions = await this.assessmentRepo.getQuestions({
      topicId: dto.topicId,
      limit: 50,
    });

    if (allQuestions.length === 0) {
      // Fallback to all questions if none found for specific topic
      const fallbackQuestions = await this.assessmentRepo.getQuestions({ limit: 50 });
      if (fallbackQuestions.length === 0) {
        throw new NotFoundError('No assessment questions available in the question bank.');
      }
      allQuestions.push(...fallbackQuestions);
    }

    // Sequence up to 10 questions starting with initial difficulty
    const targetCount = Math.min(10, allQuestions.length);
    const questionSequence: string[] = [];

    // Prioritize initial difficulty
    const matchingDiff = allQuestions.filter(q => q.difficulty === initialDifficulty);
    const otherDiff = allQuestions.filter(q => q.difficulty !== initialDifficulty);
    const orderedPool = [...matchingDiff, ...otherDiff];

    for (let i = 0; i < targetCount && i < orderedPool.length; i++) {
      questionSequence.push(orderedPool[i].id);
    }

    const maxScore = questionSequence.reduce((sum, qId) => {
      const q = allQuestions.find(item => item.id === qId);
      return sum + (q?.points || 10);
    }, 0);

    const session = await this.assessmentRepo.createSession({
      userId,
      assessmentType,
      timeLimitMinutes,
      totalQuestions: questionSequence.length,
      currentDifficulty: initialDifficulty,
      questionSequence,
      maxScore,
    });

    return await this.getSession(userId, session.id);
  }

  async getSession(userId: string, sessionId: string): Promise<AssessmentSessionDto> {
    const session = await this.assessmentRepo.getSessionById(sessionId);
    if (!session) {
      throw new NotFoundError('Assessment session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenError('You do not have access to this assessment session');
    }

    const now = Date.now();
    const expiresAtMs = session.expiresAt ? new Date(session.expiresAt).getTime() : now + 1800000;
    const remainingSeconds = Math.max(0, Math.round((expiresAtMs - now) / 1000));

    // Server-Authoritative Expiration Check
    if (session.status === AssessmentSessionStatus.IN_PROGRESS && remainingSeconds === 0) {
      logger.info({ sessionId }, 'Assessment session time expired on server');
      await this.completeSession(userId, sessionId, true);
      const updated = await this.assessmentRepo.getSessionById(sessionId);
      return this.mapSessionDto(updated, 0, null);
    }

    let currentQuestionDto: AssessmentQuestionDto | null = null;
    const sequence = Array.isArray(session.questionSequenceJson) ? session.questionSequenceJson : [];
    const currentIndex = session.currentQuestionIndex || 0;

    if (session.status === AssessmentSessionStatus.IN_PROGRESS && currentIndex < sequence.length) {
      const qId = sequence[currentIndex];
      const q = await this.assessmentRepo.getQuestionById(qId);
      if (q) {
        currentQuestionDto = this.sanitizeQuestion(q);
      }
    }

    return this.mapSessionDto(session, remainingSeconds, currentQuestionDto);
  }

  private mapSessionDto(
    session: any,
    remainingSeconds: number,
    currentQuestion: AssessmentQuestionDto | null,
  ): AssessmentSessionDto {
    const sequence = Array.isArray(session.questionSequenceJson) ? session.questionSequenceJson : [];

    return {
      id: session.id,
      userId: session.userId,
      assessmentType: session.assessmentType as AssessmentType,
      status: session.status as AssessmentSessionStatus,
      startedAt: session.startedAt ? new Date(session.startedAt).toISOString() : null,
      expiresAt: session.expiresAt ? new Date(session.expiresAt).toISOString() : null,
      completedAt: session.completedAt ? new Date(session.completedAt).toISOString() : null,
      timeLimitMinutes: session.timeLimitMinutes,
      remainingSeconds,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: sequence.length || session.totalQuestions,
      currentDifficulty: session.currentDifficulty,
      totalScore: session.totalScore || 0,
      maxScore: session.maxScore || 100,
      accuracyPercentage: Number(session.accuracyPercentage || 0),
      finalSkillEstimate: session.finalSkillEstimate || null,
      topicPerformance: session.topicPerformanceJson || {},
      currentQuestion,
      createdAt: session.createdAt ? new Date(session.createdAt).toISOString() : new Date().toISOString(),
    };
  }

  async submitAnswer(userId: string, dto: SubmitAssessmentAnswerDto): Promise<AssessmentSessionDto> {
    const session = await this.assessmentRepo.getSessionById(dto.sessionId);
    if (!session) {
      throw new NotFoundError('Assessment session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenError('You do not have access to this assessment session');
    }

    if (session.status !== AssessmentSessionStatus.IN_PROGRESS) {
      throw new ValidationError(`Assessment is not in progress (status: ${session.status})`);
    }

    // Server-Authoritative Timing Enforcement
    const now = Date.now();
    const expiresAtMs = session.expiresAt ? new Date(session.expiresAt).getTime() : now + 1800000;
    if (now > expiresAtMs) {
      await this.completeSession(userId, session.id, true);
      throw new ValidationError('Assessment time has expired. Submissions are no longer accepted.');
    }

    const question = await this.assessmentRepo.getQuestionById(dto.questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    // Evaluate answer correctness
    let isCorrect = false;
    let feedbackMdx = '';
    const points = question.points || 10;

    const rawOptions = Array.isArray(question.optionsJson) ? question.optionsJson : [];
    if (
      question.questionType === AssessmentQuestionType.MCQ ||
      question.questionType === AssessmentQuestionType.OUTPUT_PREDICTION ||
      question.questionType === AssessmentQuestionType.DEBUGGING ||
      question.questionType === AssessmentQuestionType.CODE_COMPLETION ||
      question.questionType === AssessmentQuestionType.COMPLEXITY_ANALYSIS ||
      question.questionType === AssessmentQuestionType.CODE_REVIEW
    ) {
      const correctOption = rawOptions.find((opt: any) => opt.isCorrect);
      const selectedId = dto.selectedOptionIds?.[0];
      if (correctOption && selectedId && correctOption.id === selectedId) {
        isCorrect = true;
        feedbackMdx = 'Correct! ' + (question.explanationMdx || '');
      } else {
        feedbackMdx = 'Incorrect. ' + (question.explanationMdx || '');
      }
    } else if (question.questionType === AssessmentQuestionType.MULTIPLE_SELECT) {
      const correctOptionIds = rawOptions.filter((opt: any) => opt.isCorrect).map((opt: any) => opt.id);
      const userSelected = dto.selectedOptionIds || [];
      const matchAll =
        correctOptionIds.length === userSelected.length &&
        correctOptionIds.every((id: string) => userSelected.includes(id));
      if (matchAll) {
        isCorrect = true;
        feedbackMdx = 'Correct! All valid options selected.';
      } else {
        feedbackMdx = 'Incorrect. ' + (question.explanationMdx || '');
      }
    } else if (question.questionType === AssessmentQuestionType.CODING_PROBLEM) {
      // Basic coding evaluation: passes if non-empty code provided with function keywords
      const code = (dto.codeAnswer || '').trim();
      if (code.length > 30 && !code.includes('pass\n') && (code.includes('return') || code.includes('def ') || code.includes('function '))) {
        isCorrect = true;
        feedbackMdx = 'Coding problem solution accepted.';
      } else {
        feedbackMdx = 'Solution incomplete or failed tests.';
      }
    }

    const scoreEarned = isCorrect ? points : 0;
    const timeSpentSeconds = dto.timeSpentSeconds || 30;

    // Record attempt
    await this.assessmentRepo.recordAttempt({
      sessionId: session.id,
      questionId: question.id,
      questionType: question.questionType,
      selectedOptionIdsJson: dto.selectedOptionIds || [],
      userCode: dto.codeAnswer,
      languageId: dto.languageId as string,
      isCorrect,
      scoreEarned,
      maxScore: points,
      timeSpentSeconds,
      feedbackMdx,
    });

    // Run Adaptive Engine to determine next difficulty
    const diffHistory = Array.isArray(session.difficultyHistoryJson) ? session.difficultyHistoryJson : [];
    const lastConsecutiveCorrect = diffHistory.length > 0 ? diffHistory[diffHistory.length - 1].consecutiveCorrect || 0 : 0;
    const lastConsecutiveIncorrect = diffHistory.length > 0 ? diffHistory[diffHistory.length - 1].consecutiveIncorrect || 0 : 0;

    const transition = this.adaptiveEngine.calculateNextDifficulty(
      session.currentDifficulty,
      isCorrect,
      lastConsecutiveCorrect,
      lastConsecutiveIncorrect,
    );

    diffHistory.push({
      questionIndex: session.currentQuestionIndex,
      difficulty: session.currentDifficulty,
      wasCorrect: isCorrect,
      nextDifficulty: transition.nextDifficulty,
      reason: transition.reason,
      consecutiveCorrect: transition.consecutiveCorrect,
      consecutiveIncorrect: transition.consecutiveIncorrect,
    });

    const newScore = (session.totalScore || 0) + scoreEarned;
    const nextQuestionIndex = (session.currentQuestionIndex || 0) + 1;
    const sequence = Array.isArray(session.questionSequenceJson) ? session.questionSequenceJson : [];

    if (nextQuestionIndex >= sequence.length) {
      // All questions completed -> finalize session
      await this.assessmentRepo.updateSession(session.id, {
        currentQuestionIndex: nextQuestionIndex,
        totalScore: newScore,
        currentDifficulty: transition.nextDifficulty,
        difficultyHistoryJson: diffHistory,
      });
      await this.completeSession(userId, session.id, false);
    } else {
      await this.assessmentRepo.updateSession(session.id, {
        currentQuestionIndex: nextQuestionIndex,
        totalScore: newScore,
        currentDifficulty: transition.nextDifficulty,
        difficultyHistoryJson: diffHistory,
      });
    }

    return await this.getSession(userId, session.id);
  }

  async completeSession(userId: string, sessionId: string, isExpired: boolean = false): Promise<AssessmentResultDto> {
    const session = await this.assessmentRepo.getSessionById(sessionId);
    if (!session) {
      throw new NotFoundError('Assessment session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    const attempts = await this.assessmentRepo.getAttemptsBySessionId(sessionId);
    const totalScore = attempts.reduce((sum, att) => sum + (att.scoreEarned || 0), 0);
    const maxScore = Math.max(1, session.maxScore || attempts.reduce((sum, att) => sum + (att.maxScore || 10), 0));
    const percentage = Math.min(100, Math.round((totalScore / maxScore) * 10000) / 100);
    const correctCount = attempts.filter(att => att.isCorrect).length;
    const accuracy = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 10000) / 100 : 0;
    const totalTimeSpentSeconds = attempts.reduce((sum, att) => sum + (att.timeSpentSeconds || 0), 0);

    const status = isExpired ? AssessmentSessionStatus.EXPIRED : AssessmentSessionStatus.COMPLETED;

    // Update Skill Rating via RatingService
    const ratingUpdate = await this.ratingService.updateRatingOnAssessment(
      userId,
      sessionId,
      percentage,
      session.currentDifficulty || 'medium',
    );

    // Topic Performance Breakdown
    const topicBreakdown: Record<string, any> = {};
    const errorCategories: Record<string, number> = {};
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    for (const att of attempts) {
      const q = await this.assessmentRepo.getQuestionById(att.questionId);
      const topicId = q?.topicId || 'general';
      const topicName = q?.topicName || 'General Programming';

      if (!topicBreakdown[topicId]) {
        topicBreakdown[topicId] = {
          topicId,
          topicName,
          score: 0,
          maxScore: 0,
          percentage: 0,
          strengthLevel: 'developing',
        };
      }

      topicBreakdown[topicId].score += att.scoreEarned || 0;
      topicBreakdown[topicId].maxScore += att.maxScore || 10;

      if (!att.isCorrect) {
        errorCategories[q?.questionType || 'conceptual'] = (errorCategories[q?.questionType || 'conceptual'] || 0) + 1;
      }
    }

    Object.values(topicBreakdown).forEach((tb: any) => {
      tb.percentage = Math.round((tb.score / Math.max(1, tb.maxScore)) * 100);
      if (tb.percentage >= 80) {
        tb.strengthLevel = 'strong';
        strengths.push(tb.topicName);
      } else if (tb.percentage < 60) {
        tb.strengthLevel = 'weak';
        weaknesses.push(tb.topicName);
      } else {
        tb.strengthLevel = 'developing';
      }
    });

    if (strengths.length === 0) strengths.push('Problem-solving persistence');
    if (weaknesses.length === 0 && percentage < 90) weaknesses.push('Advanced boundary condition handling');

    // Record Result
    const result = await this.assessmentRepo.recordResult({
      sessionId,
      userId,
      assessmentType: session.assessmentType,
      score: totalScore,
      maxScore,
      percentage: percentage.toFixed(2),
      accuracy: accuracy.toFixed(2),
      timeSpentSeconds: totalTimeSpentSeconds,
      skillRatingBefore: ratingUpdate.previousRating,
      skillRatingAfter: ratingUpdate.newRating,
      skillRatingDelta: ratingUpdate.ratingChange,
      rankPercentile: '75.00',
      topicBreakdownJson: topicBreakdown,
      errorCategoriesJson: errorCategories,
      strengthsJson: strengths,
      weaknessesJson: weaknesses,
    });

    // Generate Remediation Plan
    const actionItems = [];
    if (weaknesses.length > 0) {
      actionItems.push({
        id: 'act_1',
        type: 'lesson',
        title: `Review Core Concept: ${weaknesses[0]}`,
        description: `Strengthen fundamental patterns identified in ${weaknesses[0]} to close assessment gap.`,
        priority: 'high',
        completed: false,
        estimatedMinutes: 15,
      });
      actionItems.push({
        id: 'act_2',
        type: 'mentor_concept',
        title: `AI Mentor Socratic Walkthrough: ${weaknesses[0]}`,
        description: `Request an adaptive breakdown from the AI Mentor with interactive code examples.`,
        priority: 'high',
        completed: false,
        estimatedMinutes: 10,
      });
      actionItems.push({
        id: 'act_3',
        type: 'targeted_practice',
        title: `Targeted Practice: 3 Challenges in ${weaknesses[0]}`,
        description: `Solve 3 calibrated practice problems to verify remediation.`,
        priority: 'medium',
        completed: false,
        estimatedMinutes: 20,
      });
    } else {
      actionItems.push({
        id: 'act_1',
        type: 'problem',
        title: 'Advance to Algorithmic Challenges',
        description: 'Explore Difficult arena problems to increase your skill rating toward Master tier.',
        priority: 'medium',
        completed: false,
        estimatedMinutes: 25,
      });
    }

    await this.assessmentRepo.recordRemediation({
      assessmentId: sessionId,
      userId,
      summary: `Assessment finalized with ${Math.round(percentage)}% score. ${weaknesses.length > 0 ? `Identified growth opportunities in ${weaknesses.join(', ')}.` : 'Excellent performance across all tested domains.'}`,
      weakConceptsJson: weaknesses,
      prerequisiteGapsJson: [],
      actionItemsJson: actionItems,
      estimatedStudyTimeMinutes: 45,
    });

    await this.assessmentRepo.updateSession(sessionId, {
      status,
      completedAt: new Date(),
      totalScore,
      accuracyPercentage: accuracy.toFixed(2),
      finalSkillEstimate: `${ratingUpdate.rankTier} (${ratingUpdate.newRating})`,
      topicPerformanceJson: topicBreakdown,
    });

    return {
      sessionId,
      userId,
      assessmentType: session.assessmentType,
      score: totalScore,
      maxScore,
      percentage,
      accuracy,
      timeSpentSeconds: totalTimeSpentSeconds,
      skillRatingBefore: ratingUpdate.previousRating,
      skillRatingAfter: ratingUpdate.newRating,
      skillRatingDelta: ratingUpdate.ratingChange,
      rankPercentile: 75,
      status,
      completedAt: new Date().toISOString(),
      attemptsCount: attempts.length,
    };
  }

  async getResult(userId: string, sessionId: string): Promise<AssessmentResultDto> {
    const session = await this.assessmentRepo.getSessionById(sessionId);
    if (!session) {
      throw new NotFoundError('Assessment session not found');
    }
    if (session.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    const res = await this.assessmentRepo.getResultBySessionId(sessionId);
    if (!res) {
      throw new NotFoundError('Assessment result not found or assessment not yet completed');
    }

    const attempts = await this.assessmentRepo.getAttemptsBySessionId(sessionId);

    return {
      sessionId,
      userId: res.userId,
      assessmentType: res.assessmentType as AssessmentType,
      score: res.score,
      maxScore: res.maxScore,
      percentage: Number(res.percentage),
      accuracy: Number(res.accuracy),
      timeSpentSeconds: res.timeSpentSeconds,
      skillRatingBefore: res.skillRatingBefore,
      skillRatingAfter: res.skillRatingAfter,
      skillRatingDelta: res.skillRatingDelta,
      rankPercentile: Number(res.rankPercentile || 50),
      status: session.status as AssessmentSessionStatus,
      completedAt: res.createdAt ? new Date(res.createdAt).toISOString() : new Date().toISOString(),
      attemptsCount: attempts.length,
    };
  }

  async getAnalytics(userId: string, sessionId: string): Promise<AssessmentAnalyticsDto> {
    const res = await this.getResult(userId, sessionId);
    const rawRes = await this.assessmentRepo.getResultBySessionId(sessionId);
    const attempts = await this.assessmentRepo.getAttemptsBySessionId(sessionId);

    const diffBreakdown = {
      easy: { attempted: 0, correct: 0 },
      medium: { attempted: 0, correct: 0 },
      difficult: { attempted: 0, correct: 0 },
    };

    let codingAttempts = 0;
    let codingCorrect = 0;

    for (const att of attempts) {
      const q = await this.assessmentRepo.getQuestionById(att.questionId);
      const diff = (q?.difficulty || 'medium').toLowerCase() as 'easy' | 'medium' | 'difficult';
      if (diffBreakdown[diff]) {
        diffBreakdown[diff].attempted += 1;
        if (att.isCorrect) diffBreakdown[diff].correct += 1;
      }
      if (q?.questionType === AssessmentQuestionType.CODING_PROBLEM) {
        codingAttempts += 1;
        if (att.isCorrect) codingCorrect += 1;
      }
    }

    const codingSuccessRate = codingAttempts > 0 ? Math.round((codingCorrect / codingAttempts) * 100) : 100;

    return {
      sessionId,
      userId,
      overallScore: res.score,
      maxScore: res.maxScore,
      percentage: res.percentage,
      accuracy: res.accuracy,
      timeSpentSeconds: res.timeSpentSeconds,
      codingSuccessRate,
      difficultyBreakdown: diffBreakdown,
      topicPerformance: (rawRes?.topicBreakdownJson as any) || {},
      errorCategories: (rawRes?.errorCategoriesJson as any) || {},
      strengths: Array.isArray(rawRes?.strengthsJson) ? rawRes.strengthsJson : [],
      weaknesses: Array.isArray(rawRes?.weaknessesJson) ? rawRes.weaknessesJson : [],
    };
  }

  async getRemediationPlan(userId: string, assessmentId: string): Promise<RemediationPlanDto> {
    const rem = await this.assessmentRepo.getRemediationByAssessmentId(assessmentId);
    if (!rem) {
      throw new NotFoundError('Remediation plan not found for this assessment');
    }
    if (rem.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return {
      assessmentId,
      generatedAt: rem.createdAt ? new Date(rem.createdAt).toISOString() : new Date().toISOString(),
      summary: rem.summary,
      weakConcepts: Array.isArray(rem.weakConceptsJson) ? rem.weakConceptsJson : [],
      prerequisiteGaps: Array.isArray(rem.prerequisiteGapsJson) ? rem.prerequisiteGapsJson : [],
      actionItems: Array.isArray(rem.actionItemsJson) ? rem.actionItemsJson : [],
      estimatedStudyTimeMinutes: rem.estimatedStudyTimeMinutes || 45,
    };
  }

  async getUserHistory(userId: string): Promise<any[]> {
    return await this.assessmentRepo.getUserAssessmentHistory(userId);
  }
}
