import {
  InterviewSessionDto,
  InterviewExchangeDto,
  StartInterviewDto,
} from '@codeforge/shared';

export interface IInterviewRepository {
  createSession(userId: string, data: StartInterviewDto): Promise<InterviewSessionDto>;
  getSessionById(id: string): Promise<InterviewSessionDto | null>;
  getUserSessions(userId: string): Promise<InterviewSessionDto[]>;
  createExchange(sessionId: string, questionOrder: number, questionText: string): Promise<InterviewExchangeDto>;
  getExchangeById(id: string): Promise<InterviewExchangeDto | null>;
  getExchanges(sessionId: string): Promise<InterviewExchangeDto[]>;
  recordAnswer(
    exchangeId: string,
    userAnswerText: string,
    evaluationFeedback: string,
    score: number,
    timeSpentSeconds?: number,
  ): Promise<InterviewExchangeDto>;
  completeSession(
    sessionId: string,
    overallScore: number,
    communicationScore: number,
    technicalScore: number,
    confidenceScore: number,
    feedbackSummaryMdx: string,
    improvements: string[],
  ): Promise<InterviewSessionDto>;
}
