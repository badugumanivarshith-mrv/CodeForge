import {
  SocraticHintLevel,
  SocraticHintResultDto,
  CodeReviewResultDto,
  SubmissionAnalysisResultDto,
  ConceptExplanationDto,
  TargetedPracticeDto,
  ProblemDifficulty,
  LanguageId,
  LearnerIntelligenceProfileDto,
} from '@codeforge/shared';

export interface MentorExecutionContext {
  userId: string;
  learnerProfile?: LearnerIntelligenceProfileDto;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  problem?: {
    id: string;
    slug: string;
    title: string;
    difficulty: ProblemDifficulty;
    promptMdx: string;
    constraints?: string[];
    sampleTestCases?: Array<{ input: string; output: string }>;
  };
  languageId?: LanguageId | string;
  currentCode?: string;
  weaknesses?: string[];
  prerequisiteGaps?: string[];
}

export interface IAIMentorProvider {
  chat(
    context: MentorExecutionContext,
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  ): Promise<{ reply: string; tokensUsed: number }>;

  generateHint(
    context: MentorExecutionContext,
    level: SocraticHintLevel,
    code: string,
  ): Promise<SocraticHintResultDto>;

  reviewCode(context: MentorExecutionContext, code: string): Promise<CodeReviewResultDto>;

  analyzeSubmission(
    context: MentorExecutionContext,
    submissionData: {
      code: string;
      status: string;
      compileOutput?: string;
      passedCount: number;
      totalCount: number;
      sampleErrors?: Array<{ input: string; expected: string; actual?: string; error?: string }>;
    },
  ): Promise<SubmissionAnalysisResultDto>;

  explainConcept(context: MentorExecutionContext, concept: string): Promise<ConceptExplanationDto>;

  generatePractice(
    context: MentorExecutionContext,
    params: {
      targetSkillOrWeakness: string;
      difficulty: ProblemDifficulty;
      language: LanguageId | string;
    },
  ): Promise<TargetedPracticeDto>;
}
