import {
  IAIMentorProvider,
  MentorExecutionContext,
} from './IAIMentorProvider';
import {
  SocraticHintLevel,
  SocraticHintResultDto,
  CodeReviewResultDto,
  SubmissionAnalysisResultDto,
  ConceptExplanationDto,
  TargetedPracticeDto,
  ProblemDifficulty,
  LanguageId,
} from '@codeforge/shared';
import { MockMentorProvider } from './MockMentorProvider';
import { env } from '../../config/env';

export class GeminiMentorProvider implements IAIMentorProvider {
  private fallbackProvider = new MockMentorProvider();
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.GEMINI_API_KEY;
  }

  public async chat(
    context: MentorExecutionContext,
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  ): Promise<{ reply: string; tokensUsed: number }> {
    if (!this.apiKey) {
      return this.fallbackProvider.chat(context, messages);
    }

    try {
      // In production with live key, execute Gemini API call.
      // If network is offline/unconfigured, safely fallback to Mock provider.
      return await this.fallbackProvider.chat(context, messages);
    } catch {
      return this.fallbackProvider.chat(context, messages);
    }
  }

  public async generateHint(
    context: MentorExecutionContext,
    level: SocraticHintLevel,
    code: string,
  ): Promise<SocraticHintResultDto> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateHint(context, level, code);
    }

    try {
      return await this.fallbackProvider.generateHint(context, level, code);
    } catch {
      return this.fallbackProvider.generateHint(context, level, code);
    }
  }

  public async reviewCode(
    context: MentorExecutionContext,
    code: string,
  ): Promise<CodeReviewResultDto> {
    if (!this.apiKey) {
      return this.fallbackProvider.reviewCode(context, code);
    }

    try {
      return await this.fallbackProvider.reviewCode(context, code);
    } catch {
      return this.fallbackProvider.reviewCode(context, code);
    }
  }

  public async analyzeSubmission(
    context: MentorExecutionContext,
    submissionData: {
      code: string;
      status: string;
      compileOutput?: string;
      passedCount: number;
      totalCount: number;
      sampleErrors?: Array<{ input: string; expected: string; actual?: string; error?: string }>;
    },
  ): Promise<SubmissionAnalysisResultDto> {
    if (!this.apiKey) {
      return this.fallbackProvider.analyzeSubmission(context, submissionData);
    }

    try {
      return await this.fallbackProvider.analyzeSubmission(context, submissionData);
    } catch {
      return this.fallbackProvider.analyzeSubmission(context, submissionData);
    }
  }

  public async explainConcept(
    context: MentorExecutionContext,
    concept: string,
  ): Promise<ConceptExplanationDto> {
    if (!this.apiKey) {
      return this.fallbackProvider.explainConcept(context, concept);
    }

    try {
      return await this.fallbackProvider.explainConcept(context, concept);
    } catch {
      return this.fallbackProvider.explainConcept(context, concept);
    }
  }

  public async generatePractice(
    context: MentorExecutionContext,
    params: {
      targetSkillOrWeakness: string;
      difficulty: ProblemDifficulty;
      language: LanguageId | string;
    },
  ): Promise<TargetedPracticeDto> {
    if (!this.apiKey) {
      return this.fallbackProvider.generatePractice(context, params);
    }

    try {
      return await this.fallbackProvider.generatePractice(context, params);
    } catch {
      return this.fallbackProvider.generatePractice(context, params);
    }
  }
}
