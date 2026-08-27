import {
  AIInteractionType,
  LanguageId,
  MistakeCategory,
  MentorSessionDto,
  MentorMessageDto,
  SocraticHintLevel,
} from '@codeforge/shared';

export interface IMentorRepository {
  createSession(
    userId: string,
    interactionType: AIInteractionType,
    contextType: 'problem' | 'topic' | 'lesson' | 'general' | 'practice',
    contextId: string,
  ): Promise<MentorSessionDto>;

  getSessionById(sessionId: string, userId?: string): Promise<MentorSessionDto | null>;

  getUserSessions(userId: string, limit?: number): Promise<MentorSessionDto[]>;

  addMessage(
    sessionId: string,
    sender: 'user' | 'assistant' | 'system',
    messageText: string,
    codeContext?: string,
    tokensUsed?: number,
  ): Promise<MentorMessageDto>;

  getSessionMessages(sessionId: string): Promise<MentorMessageDto[]>;

  recordMistakeMemory(data: {
    userId: string;
    languageId: LanguageId;
    topicId: string;
    problemId?: string;
    mistakeCategory: MistakeCategory;
    errorSignature: string;
    codeSnippet: string;
    explanation: string;
  }): Promise<void>;

  getMistakeMemory(
    userId: string,
    topicId?: string,
    limit?: number,
  ): Promise<
    Array<{
      id: string;
      userId: string;
      languageId: LanguageId;
      topicId: string;
      problemId?: string | null;
      mistakeCategory: MistakeCategory;
      errorSignature: string;
      codeSnippet: string;
      explanation: string;
      createdAt: Date;
    }>
  >;
}
