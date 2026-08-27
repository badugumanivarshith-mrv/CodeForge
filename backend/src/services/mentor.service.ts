import {
  IMentorRepository,
  IProblemRepository,
  ISubmissionRepository,
} from '../repositories';
import { MentorContextService } from './mentorContext.service';
import { IAIMentorProvider, MentorProviderFactory } from './ai';
import {
  AIInteractionType,
  LanguageId,
  ProblemDifficulty,
  SocraticHintLevel,
  MentorSessionDto,
  MentorMessageDto,
  SocraticHintResultDto,
  CodeReviewResultDto,
  SubmissionAnalysisResultDto,
  ConceptExplanationDto,
  TargetedPracticeDto,
  CreateMentorSessionDto,
  SendMentorMessageDto,
  RequestHintDto,
  RequestCodeReviewDto,
  AnalyzeSubmissionDto,
  ExplainConceptDto,
  GeneratePracticeDto,
  MistakeCategory,
} from '@codeforge/shared';
import { NotFoundError, ForbiddenError, ValidationError } from '../core/errors';

export class MentorService {
  private aiProvider: IAIMentorProvider;

  constructor(
    private mentorRepo: IMentorRepository,
    private contextService: MentorContextService,
    private problemRepo: IProblemRepository,
    private submissionRepo: ISubmissionRepository,
    aiProvider?: IAIMentorProvider,
  ) {
    this.aiProvider = aiProvider || MentorProviderFactory.createProvider();
  }

  public async createSession(userId: string, data: CreateMentorSessionDto): Promise<MentorSessionDto> {
    const interactionType = (data.interactionType as AIInteractionType) || AIInteractionType.SOCRATIC_HINT;
    const session = await this.mentorRepo.createSession(
      userId,
      interactionType,
      data.contextType,
      data.contextId,
    );

    if (data.initialCodeContext) {
      await this.mentorRepo.addMessage(
        session.id,
        'system',
        'Session initialized with code context.',
        data.initialCodeContext,
      );
    }

    return session;
  }

  public async getSession(userId: string, sessionId: string): Promise<MentorSessionDto> {
    const session = await this.mentorRepo.getSessionById(sessionId, userId);
    if (!session) {
      throw new NotFoundError(`Mentor session with id "${sessionId}" not found or unauthorized`);
    }
    return session;
  }

  public async getUserSessions(userId: string, limit = 20): Promise<MentorSessionDto[]> {
    return await this.mentorRepo.getUserSessions(userId, limit);
  }

  public async sendMessage(
    userId: string,
    data: SendMentorMessageDto,
  ): Promise<{ userMessage: MentorMessageDto; assistantMessage: MentorMessageDto }> {
    // 1. Verify session ownership
    const session = await this.mentorRepo.getSessionById(data.sessionId, userId);
    if (!session) {
      throw new NotFoundError(`Mentor session with id "${data.sessionId}" not found`);
    }
    if (session.userId !== userId) {
      throw new ForbiddenError('You do not have access to this mentor session');
    }

    // 2. Add user message to DB
    const userMessage = await this.mentorRepo.addMessage(
      session.id,
      'user',
      data.content,
      data.codeContext,
    );

    // 3. Fetch past session messages for conversation context
    const allMessages = await this.mentorRepo.getSessionMessages(session.id);
    const messagesHistory = allMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // 4. Build execution context
    const context = await this.contextService.buildExecutionContext(userId, {
      problemId: session.contextType === 'problem' ? session.contextId : undefined,
      languageId: data.currentLanguage as LanguageId,
      currentCode: data.codeContext,
    });

    // 5. Call AI Provider
    const aiResponse = await this.aiProvider.chat(context, messagesHistory);

    // 6. Record assistant message
    const assistantMessage = await this.mentorRepo.addMessage(
      session.id,
      'assistant',
      aiResponse.reply,
      undefined,
      aiResponse.tokensUsed,
    );

    return { userMessage, assistantMessage };
  }

  public async requestHint(userId: string, data: RequestHintDto): Promise<SocraticHintResultDto> {
    const requestedLevel: SocraticHintLevel = data.requestedLevel
      ? (Math.min(Math.max(data.requestedLevel, 1), 5) as SocraticHintLevel)
      : 1;

    const context = await this.contextService.buildExecutionContext(userId, {
      problemId: data.problemId,
      languageId: data.languageId,
      currentCode: data.currentCode,
    });

    const hintResult = await this.aiProvider.generateHint(context, requestedLevel, data.currentCode);

    // If session ID provided, log hint into session history
    if (data.sessionId) {
      const session = await this.mentorRepo.getSessionById(data.sessionId, userId);
      if (session && session.userId === userId) {
        await this.mentorRepo.addMessage(
          session.id,
          'assistant',
          `💡 **${hintResult.title}**\n\n${hintResult.hint}\n\n*${hintResult.guidingQuestion}*`,
          data.currentCode,
        );
      }
    }

    return hintResult;
  }

  public async requestCodeReview(
    userId: string,
    data: RequestCodeReviewDto,
  ): Promise<CodeReviewResultDto> {
    if (!data.code || data.code.trim().length === 0) {
      throw new ValidationError('Source code cannot be empty for code review');
    }

    const context = await this.contextService.buildExecutionContext(userId, {
      problemId: data.problemId,
      languageId: data.languageId,
      currentCode: data.code,
      topicId: data.topicId,
    });

    return await this.aiProvider.reviewCode(context, data.code);
  }

  public async analyzeSubmission(
    userId: string,
    data: AnalyzeSubmissionDto,
  ): Promise<SubmissionAnalysisResultDto> {
    const submission = await this.submissionRepo.findById(data.submissionId);
    if (!submission) {
      throw new NotFoundError(`Submission with id "${data.submissionId}" not found`);
    }

    // Ownership check: User A cannot analyze User B's submission
    if (submission.userId !== userId) {
      throw new ForbiddenError('You are not authorized to analyze another user\'s submission');
    }

    // SANITIZATION: Ensure hidden test cases are never passed to AI context
    const sanitizedData = this.contextService.sanitizeSubmissionData({
      sourceCode: submission.sourceCode,
      status: submission.status,
      compileOutput: submission.compileOutput,
      passedTestCases: submission.passedTestCases,
      totalTestCases: submission.totalTestCases,
    });

    const context = await this.contextService.buildExecutionContext(userId, {
      problemId: submission.problemId,
      languageId: submission.languageId,
      currentCode: submission.sourceCode,
    });

    const analysis = await this.aiProvider.analyzeSubmission(context, sanitizedData);

    // If compilation error or logical fault, log into mistake memory for adaptive remediation
    if (submission.status !== 'accepted' && context.problem) {
      await this.mentorRepo
        .recordMistakeMemory({
          userId,
          languageId: submission.languageId,
          topicId: context.problem.id,
          problemId: submission.problemId,
          mistakeCategory:
            submission.status === 'compilation_error'
              ? MistakeCategory.SYNTAX
              : MistakeCategory.LOGIC_FAULT,
          errorSignature: analysis.errorType,
          codeSnippet: submission.sourceCode.slice(0, 500),
          explanation: analysis.errorExplanation,
        })
        .catch(() => {
          // Non-blocking
        });
    }

    return analysis;
  }

  public async explainConcept(
    userId: string,
    data: ExplainConceptDto,
  ): Promise<ConceptExplanationDto> {
    if (!data.concept || data.concept.trim().length === 0) {
      throw new ValidationError('Concept name cannot be empty');
    }

    const context = await this.contextService.buildExecutionContext(userId, {
      languageId: data.languageId,
      topicId: data.topicId,
    });

    return await this.aiProvider.explainConcept(context, data.concept.trim());
  }

  public async generatePractice(
    userId: string,
    data: GeneratePracticeDto,
  ): Promise<TargetedPracticeDto> {
    const context = await this.contextService.buildExecutionContext(userId, {
      languageId: data.preferredLanguage || LanguageId.PYTHON,
      topicId: data.targetTopicId,
    });

    const targetSkill = data.weaknessCategory || context.weaknesses?.[0] || 'Problem Solving & Pattern Recognition';
    const difficulty = data.difficulty || ProblemDifficulty.EASY;

    return await this.aiProvider.generatePractice(context, {
      targetSkillOrWeakness: targetSkill,
      difficulty,
      language: data.preferredLanguage || LanguageId.PYTHON,
    });
  }
}
