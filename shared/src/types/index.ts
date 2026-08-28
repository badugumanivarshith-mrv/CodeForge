import {
  UserRole,
  UserStatus,
  LanguageId,
  TopicDifficulty,
  QuizDifficulty,
  QuestionType,
  ProblemDifficulty,
  AssignmentDifficulty,
  SubmissionStatus,
  AssignmentStatus,
  AchievementType,
  ProjectStatus,
  AIInteractionType,
  MasteryLevel,
  XPTransactionType,
  ContentStatus,
  MistakeCategory,
  AssessmentType,
  AssessmentSessionStatus,
  AssessmentQuestionType,
  ContestState,
  LeaderboardTimeframe,
  RatingReferenceType,
  StudyGroupRole,
  ForumTargetType,
  ForumVoteType,
  CareerRole,
  InterviewType,
  InterviewStatus,
  ActivityType,
  JudgeVerdict,
} from '../enums/index.js';



// Standard API Response Envelopes
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: ApiErrorDetail[];
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// User Domain Types
export interface UserDto {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDto {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  githubUsername: string | null;
  preferredLanguageId: LanguageId | null;
  timezone: string;
  totalXp: number;
  currentLevel: number;
  learningGoals?: string[];
}

export interface UserPreferencesDto {
  userId: string;
  theme: 'dark' | 'light';
  editorFontSize: number;
  editorKeybindings: 'standard' | 'vim' | 'emacs';
  emailNotifications: boolean;
  aiHintLevel: 1 | 2 | 3;
}

// Authentication DTOs
export interface AuthResponseDto {
  user: UserDto;
  profile: UserProfileDto;
  preferences: UserPreferencesDto;
  accessToken: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

// Curriculum Domain Types
export interface LanguageDto {
  id: LanguageId;
  slug: string;
  name: string;
  monacoId: string;
  compilerId: string;
  version: string;
  isActive: boolean;
  displayOrder: number;
}

export interface TopicDto {
  id: string;
  languageId: LanguageId;
  slug: string;
  sequence: number; // 1 to 10
  title: string;
  description: string;
  difficulty: TopicDifficulty;
  estimatedHours: number;
}

export interface TopicProgressSummaryDto extends TopicDto {
  isUnlocked: boolean;
  isCompleted: boolean;
  lessonsTotal: number;
  lessonsCompleted: number;
  problemsTotal: number;
  problemsSolved: number;
  quizPassed: boolean;
  masteryScore: number;
}

export interface LanguageRoadmapDto {
  language: LanguageDto;
  topics: TopicProgressSummaryDto[];
  overallProgressPercentage: number;
}

export interface LessonDto {
  id: string;
  topicId: string;
  sequence: number;
  slug: string;
  title: string;
  description: string | null;
  readTimeMinutes: number;
  status: ContentStatus;
  isCompleted?: boolean;
}

export interface LessonSectionDto {
  id: string;
  lessonId: string;
  sequence: number;
  title: string;
  contentMdx: string;
  contentType: 'text' | 'code_sandbox' | 'video_callout' | 'quiz_checkpoint';
}

export interface LearningExampleDto {
  id: string;
  lessonId: string;
  sequence: number;
  title: string;
  codeTemplate: string;
  expectedOutput: string;
  explanationMdx: string | null;
}

export interface LessonDetailDto {
  lesson: LessonDto;
  topic: TopicDto;
  language: LanguageDto;
  sections: LessonSectionDto[];
  examples: LearningExampleDto[];
  previousLessonId: string | null;
  nextLessonId: string | null;
  isCompleted: boolean;
}

export interface TopicDetailDto {
  topic: TopicDto;
  language: LanguageDto;
  lessons: LessonDto[];
  quiz: {
    id: string;
    title: string;
    difficulty: QuizDifficulty;
    questionCount: number;
    isPassed: boolean;
    bestScore: number;
  } | null;
  problems: {
    id: string;
    slug: string;
    title: string;
    difficulty: ProblemDifficulty;
    isSolved: boolean;
  }[];
}

// Quiz Domain Types
export interface QuizOptionDto {
  id: string;
  sequence: number;
  optionText: string;
  isCorrect?: boolean; // Stripped in client payloads!
}

export interface QuizQuestionDto {
  id: string;
  quizId: string;
  sequence: number;
  questionType: QuestionType;
  questionMdx: string;
  codeSnippet: string | null;
  explanationMdx?: string | null;
  points: number;
  options: QuizOptionDto[];
}

export interface QuizDto {
  id: string;
  topicId: string;
  title: string;
  description: string;
  difficulty: QuizDifficulty;
  passingScorePercentage: number;
  questions?: QuizQuestionDto[];
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmitRequestDto {
  answers: QuizAnswerSubmission[];
}

export interface QuizSubmitResultDto {
  quizId: string;
  scorePercentage: number;
  isPassed: boolean;
  correctAnswersCount: number;
  totalQuestions: number;
  xpAwarded: number;
  questionsReview?: Array<{
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
    explanationMdx: string | null;
  }>;
}

export interface QuizAttemptDto {
  id: string;
  quizId: string;
  userId: string;
  scorePercentage: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string | null;
}

// Problem Domain Types
export interface TestCaseDto {
  id: string;
  problemId: string;
  sequence: number;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
  isSample: boolean;
  isEdgeCase: boolean;
  weight: number;
  explanation?: string | null;
}

export interface ProblemExampleDto {
  id: string;
  problemId: string;
  sequence: number;
  inputData: string;
  expectedOutput: string;
  explanationMdx: string | null;
}

export interface ProblemSummaryDto {
  id: string;
  topicId: string;
  topicTitle?: string;
  languageId?: LanguageId;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  isSolved?: boolean;
}

export interface ProblemDetailDto {
  id: string;
  topicId: string;
  topicTitle: string;
  languageId: LanguageId;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  promptMdx: string;
  starterCode: Record<string, string>;
  boilerplateCode: Record<string, string>;
  memoryLimitMb: number;
  timeLimitMs: number;
  examples: ProblemExampleDto[];
  sampleTestCases: TestCaseDto[];
  isSolved?: boolean;
}

export interface ProblemDto {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  promptMdx: string;
  starterCode: Record<string, string>;
  boilerplateCode: Record<string, string>;
  solutionCode?: Record<string, string>;
  memoryLimitMb: number;
  timeLimitMs: number;
  isPublished: boolean;
  examples?: ProblemExampleDto[];
  sampleTestCases?: TestCaseDto[];
}

// Progress & Dashboard Types
export interface ProgressDashboardDto {

  gamification: GamificationSummaryDto;
  activeLanguage: LanguageDto | null;
  topicMasteries: TopicMasteryDto[];
  recentCompletedLessons: LessonDto[];
  recommendedTopic: TopicDto | null;
}

// Assignment Domain Types
export interface AssignmentRequirementDto {
  id: string;
  assignmentId: string;
  sequence: number;
  title: string;
  descriptionMdx: string;
  maxPoints: number;
  weight: number;
}

export interface AssignmentDto {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  difficulty: AssignmentDifficulty;
  descriptionMdx: string;
  projectStructureJson: Record<string, unknown>;
  starterFilesJson: Record<string, string>;
  maxScore: number;
  requirements?: AssignmentRequirementDto[];
}

export interface AssignmentSubmissionDto {
  id: string;
  assignmentId: string;
  userId: string;
  filesPayloadJson: Record<string, string>;
  status: AssignmentStatus;
  totalScore: number | null;
  submittedAt: string;
  gradedAt: string | null;
}

// Submission & Execution Types
export interface SubmissionTestCaseResultDto {
  id: string;
  submissionId: string;
  testCaseId?: string;
  sequence?: number;
  status: SubmissionStatus | JudgeVerdict;
  isSample?: boolean;
  actualOutput: string | null;
  expectedOutput?: string | null;
  inputData?: string | null;
  executionTimeMs: number;
  memoryKb: number;
  errorMessage?: string | null;
}

export interface SubmissionDto {
  id: string;
  userId: string;
  problemId: string;
  contestId?: string;
  languageId: LanguageId;
  sourceCode: string;
  status: SubmissionStatus | JudgeVerdict;
  verdict?: JudgeVerdict;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  passedTestCases: number;
  totalTestCases: number;
  compileOutput: string | null;
  createdAt: string;
  judgedAt?: string | null;
  username?: string;
  problemTitle?: string;
  problemSlug?: string;
  testResults?: SubmissionTestCaseResultDto[];
}

// Progress & Mastery Types
export interface TopicMasteryDto {
  id: string;
  userId: string;
  topicId: string;
  topicTitle?: string;
  topicSequence?: number;
  languageId?: LanguageId;
  masteryLevel: MasteryLevel;
  masteryScore: number;
  bktProbability: number;
  problemsSolvedCount: number;
  quizScoreBest: number;
  assignmentsPassedCount: number;
  lastActivityAt: string;
}

export interface LanguageMasteryDto {
  id: string;
  userId: string;
  languageId: LanguageId;
  masteryScore: number;
  topicsCompletedCount: number;
  totalTopicsCount: number;
  updatedAt: string;
}

// Gamification Types
export interface LevelDto {
  levelNumber: number;
  minXpRequired: number;
  title: string;
  badgeUrl: string | null;
  rewardDescription: string | null;
}

export interface AchievementDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeIconUrl: string;
  achievementType: AchievementType;
  xpReward: number;
  criteriaJson: Record<string, unknown>;
}

export interface StreakDto {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  freezeTokensAvailable: number;
}

export interface LeaderboardEntryDto {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  totalXp: number;
  rank: number;
  leagueTier: string;
  weeklyXp: number;
}

export interface GamificationSummaryDto {
  totalXp: number;
  currentLevel: number;
  nextLevelXp: number;
  levelProgressPercentage: number;
  currentStreak: number;
  longestStreak: number;
  freezeTokensAvailable: number;
}

// AI Domain Types
export interface AISessionDto {
  id: string;
  userId: string;
  interactionType: AIInteractionType;
  contextType: 'lesson' | 'problem' | 'assignment';
  contextId: string;
  createdAt: string;
}

export interface AIMessageDto {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant' | 'system';
  messageText: string;
  codeContext: string | null;
  tokensUsed: number;
  createdAt: string;
}

export interface MistakeMemoryDto {
  id: string;
  userId: string;
  languageId: LanguageId;
  topicId: string;
  mistakeCategory: MistakeCategory;
  errorSignature: string;
  codeSnippet: string;
  explanation: string;
  createdAt: string;
}

// Project Domain Types
export interface ProjectDto {
  id: string;
  languageId: LanguageId;
  slug: string;
  title: string;
  descriptionMdx: string;
  difficulty: ProblemDifficulty;
  status: ProjectStatus;
  repositoryTemplateUrl: string | null;
}

// ==========================================
// Phase 5: Adaptive Intelligence & Learning DTOs
// ==========================================

export type ConceptualMasteryLevel =
  | 'not_started'
  | 'learning'
  | 'developing'
  | 'proficient'
  | 'mastered';

export interface LearnerIntelligenceProfileDto {
  userId: string;
  overallSkillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  overallMasteryScore: number;
  confidenceLevel: number; // 0 to 100
  learningVelocity: number; // topics/lessons completed per week
  quizAccuracyPercentage: number;
  problemSolvingSuccessRate: number;
  currentStreakDays: number;
  totalXp: number;
  activeLanguage: LanguageDto | null;
  strengths: string[];
  weaknesses: string[];
  recentActivitySummary: {
    lessonsCompletedLast7Days: number;
    quizzesAttemptedLast7Days: number;
    problemsSubmittedLast7Days: number;
  };
}

export interface TopicMasteryDetailDto {
  topicId: string;
  topicTitle: string;
  topicSequence: number;
  languageId: LanguageId;
  masteryScore: number; // 0 to 100
  conceptualState: ConceptualMasteryLevel;
  bktProbability: number; // 0.0 to 1.0
  evidence: {
    lessonsProgress: { completed: number; total: number; percentage: number };
    quizBestScore: number;
    problemsSolved: number;
    recencyDaysAgo: number;
  };
  explanation: string;
  lastActivityAt: string;
}

export interface WeaknessItemDto {
  id: string;
  topicId: string;
  topicTitle: string;
  topicSequence: number;
  languageId: LanguageId;
  weaknessScore: number; // 0 to 100 (higher means more critical gap)
  category: 'quiz_concept_failure' | 'problem_failure' | 'prerequisite_gap' | 'inactivity_decay';
  evidence: string;
  recommendedRemediation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AdaptiveDifficultyDto {
  topicId: string;
  topicTitle: string;
  currentMasteryScore: number;
  recommendedDifficulty: ProblemDifficulty;
  rationale: string;
  metrics: {
    recentSubmissionsCount: number;
    consecutiveSuccesses: number;
    consecutiveFailures: number;
    quizAccuracy: number;
  };
}

export interface LearningPathItemDto {
  id: string;
  sequence: number;
  actionType:
    | 'continue_lesson'
    | 'review_topic'
    | 'practice_problem'
    | 'take_quiz'
    | 'advance_topic'
    | 'revisit_prerequisite'
    | 'maintain_streak';
  targetType: 'lesson' | 'quiz' | 'problem' | 'topic';
  targetId: string;
  targetSlug?: string;
  targetTitle: string;
  topicTitle: string;
  priority: 'urgent' | 'high' | 'normal' | 'optional';
  reason: string;
  expectedBenefit: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  actionUrl: string;
}

export interface RecommendationDto {
  id: string;
  type:
    | 'CONTINUE_LESSON'
    | 'REVIEW_TOPIC'
    | 'PRACTICE_PROBLEM'
    | 'TAKE_QUIZ'
    | 'ADVANCE_TOPIC'
    | 'REVISIT_PREREQUISITE'
    | 'MAINTAIN_STREAK';
  title: string;
  reason: string;
  priority: 'urgent' | 'high' | 'normal';
  targetId: string;
  targetSlug?: string;
  ctaText: string;
  ctaUrl: string;
  badgeText?: string;
}

export interface LearningAnalyticsDto {
  userId: string;
  totalActivitiesCount: number;
  lessonsCompletedCount: number;
  quizzesAttemptedCount: number;
  quizzesPassedCount: number;
  averageQuizScore: number;
  problemsAttemptedCount: number;
  problemsSolvedCount: number;
  problemSuccessRatePercentage: number;
  totalXp: number;
  xpVelocityLast7Days: number;
  currentStreakDays: number;
  learningConsistencyScore: number; // 0 to 100
  strongestTopics: Array<{ topicId: string; title: string; score: number }>;
  weakestTopics: Array<{ topicId: string; title: string; score: number }>;
  topicMasteryDistribution: {
    notStarted: number;
    learning: number;
    developing: number;
    proficient: number;
    mastered: number;
  };
}

// ============================================================
// PHASE 6: AI CODING MENTOR & INTELLIGENT PROBLEM-SOLVING
// ============================================================

export type MentorMode =
  | 'socratic_hint'
  | 'code_review'
  | 'submission_analysis'
  | 'concept_explanation'
  | 'general_chat'
  | 'targeted_practice';

export type SocraticHintLevel = 1 | 2 | 3 | 4 | 5;

export interface SocraticHintResultDto {
  hintLevel: SocraticHintLevel;
  title: string;
  hint: string;
  guidingQuestion: string;
  nextLevelAvailable: boolean;
}

export interface CodeReviewResultDto {
  summary: string;
  correctness: {
    status: 'correct' | 'partially_correct' | 'incorrect';
    explanation: string;
  };
  bugs: Array<{
    line?: number;
    description: string;
    severity: 'critical' | 'major' | 'minor';
    fixSuggestion?: string;
  }>;
  edgeCases: Array<{
    caseDescription: string;
    handled: boolean;
    suggestion?: string;
  }>;
  complexity: {
    time: string;
    space: string;
    explanation?: string;
  };
  suggestions: string[];
  learningPoints: string[];
}

export interface SubmissionAnalysisResultDto {
  summary: string;
  errorType:
    | 'compilation_error'
    | 'runtime_error'
    | 'wrong_answer'
    | 'time_limit_exceeded'
    | 'memory_limit_exceeded'
    | 'logic_error';
  rootCause: string;
  errorExplanation: string;
  remediationSteps: string[];
  learningTakeaway: string;
  suggestedHintLevel?: SocraticHintLevel;
}

export interface ConceptExplanationDto {
  concept: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  analogy: string;
  corePrinciples: string[];
  codeExamples: Array<{
    language: string;
    title: string;
    code: string;
    explanation: string;
  }>;
  commonPitfalls: string[];
  prerequisiteAdvice?: string;
}

export interface TargetedPracticeDto {
  id: string;
  title: string;
  targetSkillOrWeakness: string;
  difficulty: ProblemDifficulty;
  descriptionMdx: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: Record<string, string>;
  learningObjective: string;
}

export interface MentorMessageDto {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  codeContext?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface MentorSessionDto {
  id: string;
  userId: string;
  interactionType: AIInteractionType | string;
  contextType: 'problem' | 'topic' | 'lesson' | 'general' | 'practice';
  contextId: string;
  currentHintLevel: SocraticHintLevel;
  createdAt: string;
  endedAt?: string | null;
  messages?: MentorMessageDto[];
}

export interface CreateMentorSessionDto {
  interactionType: AIInteractionType | string;
  contextType: 'problem' | 'topic' | 'lesson' | 'general' | 'practice';
  contextId: string;
  initialCodeContext?: string;
}

export interface SendMentorMessageDto {
  sessionId: string;
  content: string;
  codeContext?: string;
  currentLanguage?: LanguageId | string;
}

export interface RequestHintDto {
  problemId: string;
  currentCode: string;
  languageId: LanguageId | string;
  requestedLevel?: SocraticHintLevel;
  sessionId?: string;
}

export interface RequestCodeReviewDto {
  problemId?: string;
  code: string;
  languageId: LanguageId | string;
  topicId?: string;
}

export interface AnalyzeSubmissionDto {
  submissionId: string;
  problemId?: string;
}

export interface ExplainConceptDto {
  concept: string;
  languageId?: LanguageId | string;
  topicId?: string;
}

export interface GeneratePracticeDto {
  targetTopicId?: string;
  weaknessCategory?: string;
  preferredLanguage?: LanguageId | string;
  difficulty?: ProblemDifficulty;
}

// ==========================================
// PHASE 7: ASSESSMENT & COMPETITIVE PLATFORM
// ==========================================

export interface AssessmentQuestionOptionDto {
  id: string;
  sequence: number;
  optionText: string;
  // NOTE: isCorrect is strictly withheld from client delivery
}

export interface AssessmentQuestionDto {
  id: string;
  questionType: AssessmentQuestionType;
  topicId: string;
  topicName?: string;
  difficulty: ProblemDifficulty | QuizDifficulty | string;
  promptMdx: string;
  options?: AssessmentQuestionOptionDto[];
  codeSnippet?: string | null;
  starterCode?: Record<string, string> | null;
  supportedLanguages?: (LanguageId | string)[];
  points: number;
  estimatedTimeSeconds?: number;
  scoringRules?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AssessmentSessionDto {
  id: string;
  userId: string;
  assessmentType: AssessmentType;
  status: AssessmentSessionStatus;
  startedAt?: string | null;
  expiresAt?: string | null;
  completedAt?: string | null;
  timeLimitMinutes: number;
  remainingSeconds?: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentDifficulty: ProblemDifficulty | string;
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  finalSkillEstimate?: string | null;
  topicPerformance?: Record<string, unknown>;
  currentQuestion?: AssessmentQuestionDto | null;
  createdAt: string;
}

export interface AssessmentAttemptDto {
  id: string;
  sessionId: string;
  questionId: string;
  questionType: AssessmentQuestionType;
  selectedOptionIds?: string[];
  userCode?: string;
  languageId?: string;
  isCorrect: boolean;
  scoreEarned: number;
  maxScore: number;
  timeSpentSeconds: number;
  explanationMdx?: string | null;
  feedbackMdx?: string | null;
  evaluatedAt: string;
}

export interface AssessmentResultDto {
  sessionId: string;
  userId: string;
  assessmentType: AssessmentType;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  skillRatingBefore: number;
  skillRatingAfter: number;
  skillRatingDelta: number;
  rankPercentile: number;
  status: AssessmentSessionStatus;
  completedAt: string;
  attemptsCount: number;
}

export interface AssessmentTopicBreakdownDto {
  topicId: string;
  topicName: string;
  score: number;
  maxScore: number;
  percentage: number;
  strengthLevel: 'strong' | 'developing' | 'weak';
}

export interface AssessmentAnalyticsDto {
  sessionId: string;
  userId: string;
  overallScore: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  codingSuccessRate: number;
  difficultyBreakdown: {
    easy: { attempted: number; correct: number };
    medium: { attempted: number; correct: number };
    difficult: { attempted: number; correct: number };
  };
  topicPerformance: Record<string, AssessmentTopicBreakdownDto>;
  errorCategories: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
}

export interface RemediationActionItemDto {
  id: string;
  type: 'lesson' | 'problem' | 'mentor_concept' | 'targeted_practice';
  targetId?: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedMinutes?: number;
}

export interface RemediationPlanDto {
  assessmentId: string;
  generatedAt: string;
  summary: string;
  weakConcepts: string[];
  prerequisiteGaps: string[];
  actionItems: RemediationActionItemDto[];
  estimatedStudyTimeMinutes: number;
}

// Contest Contracts
export interface ContestProblemDto {
  id: string;
  contestId: string;
  problemId: string;
  sequence: number;
  points: number;
  penaltyMinutes: number;
  title: string;
  difficulty: ProblemDifficulty | string;
  slug: string;
}

export interface ContestDto {
  id: string;
  slug: string;
  title: string;
  descriptionMdx: string;
  status: ContestState;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  createdBy: string;
  participantCount: number;
  problemCount: number;
  totalPoints: number;
  rulesJson?: Record<string, unknown>;
  scoringFormula: string;
  problems?: ContestProblemDto[];
  userRegistered?: boolean;
  createdAt: string;
}

export interface ContestParticipantDto {
  id: string;
  contestId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  registeredAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
  score: number;
  penaltyTimeMinutes: number;
  rank: number;
  finalRatingChange?: number | null;
  status: 'registered' | 'in_progress' | 'completed' | 'disqualified';
}

export interface ContestSubmissionDto {
  id: string;
  contestId: string;
  participantId: string;
  problemId: string;
  submissionId: string;
  scoreEarned: number;
  isPassed: boolean;
  penaltyAppliedMinutes: number;
  submittedAt: string;
}

export interface ContestProblemResultDto {
  problemId: string;
  solved: boolean;
  attempts: number;
  points: number;
  timeMinutes: number;
}

export interface ContestLeaderboardEntryDto {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  score: number;
  penaltyTimeMinutes: number;
  solvedProblemsCount: number;
  problemResults: Record<string, ContestProblemResultDto>;
}

export interface ContestLeaderboardDto {
  contestId: string;
  contestTitle: string;
  status: ContestState;
  totalParticipants: number;
  entries: ContestLeaderboardEntryDto[];
}

// Skill Rating Contracts
export interface SkillRatingDto {
  userId: string;
  currentRating: number;
  peakRating: number;
  confidenceInterval: number;
  matchesCount: number;
  assessmentsCount: number;
  percentile: number;
  rankTier: 'Novice' | 'Apprentice' | 'Adept' | 'Master' | 'Grandmaster' | string;
  lastUpdated: string;
}

export interface SkillRatingHistoryDto {
  id: string;
  userId: string;
  previousRating: number;
  newRating: number;
  ratingChange: number;
  changeReason: string;
  referenceType: RatingReferenceType | string;
  referenceId: string;
  timestamp: string;
}

export interface GlobalLeaderboardEntryDto {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  currentRating: number;
  totalXp: number;
  solvedCount: number;
  percentile: number;
}

export interface GlobalLeaderboardDto {
  timeframe: LeaderboardTimeframe;
  totalUsers: number;
  entries: GlobalLeaderboardEntryDto[];
}


// Request DTOs
export interface CreateAssessmentSessionDto {
  assessmentType: AssessmentType;
  topicId?: string;
  timeLimitMinutes?: number;
  initialDifficulty?: ProblemDifficulty;
}

export interface SubmitAssessmentAnswerDto {
  sessionId: string;
  questionId: string;
  selectedOptionIds?: string[];
  codeAnswer?: string;
  languageId?: LanguageId | string;
  timeSpentSeconds?: number;
}

export interface CreateContestDto {
  title: string;
  slug?: string;
  descriptionMdx: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  problems: {
    problemId: string;
    sequence: number;
    points: number;
    penaltyMinutes?: number;
  }[];
  rulesJson?: Record<string, unknown>;
}

export interface SubmitContestProblemDto {
  contestId: string;
  problemId: string;
  sourceCode: string;
  languageId: LanguageId | string;
}

// ==========================================
// PHASE 8: PORTFOLIO DTOs
// ==========================================
export interface PortfolioProjectDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  technologies: string[];
  isFeatured: boolean;
  starsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSettingsDto {
  userId: string;
  headline?: string;
  aboutMdx?: string;
  isPublic: boolean;
  themePreference: string;
  customSlug?: string;
  featuredSkillIds: string[];
  socialLinks: Record<string, string>;
  updatedAt: string;
}

export interface PortfolioHeatmapItemDto {
  date: string;
  count: number;
  level: number;
}

export interface PortfolioSkillItemDto {
  skillName: string;
  level: string;
  score: number;
}

export interface FullPortfolioDto {
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
  };
  settings: PortfolioSettingsDto;
  projects: PortfolioProjectDto[];
  skills: PortfolioSkillItemDto[];
  rating: {
    currentRating: number;
    peakRating: number;
    rankTier: string;
    percentile?: number;
  };
  contests: {
    participatedCount: number;
    bestRank?: number;
  };
  achievements: {
    id: string;
    title: string;
    badgeIcon: string;
    unlockedAt: string;
  }[];
  heatmap: PortfolioHeatmapItemDto[];
}

export interface CreatePortfolioProjectDto {
  title: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  technologies?: string[];
  isFeatured?: boolean;
}

export interface UpdatePortfolioProjectDto {
  title?: string;
  description?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  technologies?: string[];
  isFeatured?: boolean;
}

export interface UpdatePortfolioSettingsDto {
  headline?: string;
  aboutMdx?: string;
  isPublic?: boolean;
  themePreference?: string;
  customSlug?: string;
  featuredSkillIds?: string[];
  socialLinks?: Record<string, string>;
}

// ==========================================
// PHASE 8: STUDY GROUPS DTOs
// ==========================================
export interface StudyGroupDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  avatarUrl?: string;
  isPrivate: boolean;
  maxMembers: number;
  memberCount: number;
  userRole?: StudyGroupRole;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGroupMemberDto {
  groupId: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  role: StudyGroupRole;
  joinedAt: string;
}

export interface StudyGroupDiscussionDto {
  id: string;
  groupId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  contentMdx: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGroupGoalDto {
  id: string;
  groupId: string;
  title: string;
  targetTopicId?: string;
  targetContestId?: string;
  targetDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateStudyGroupDto {
  name: string;
  description: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  maxMembers?: number;
}

export interface CreateDiscussionDto {
  title: string;
  contentMdx: string;
}

export interface GroupLeaderboardEntryDto {
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  role: StudyGroupRole;
  xp: number;
  problemsSolved: number;
  rating: number;
  rank: number;
}

// ==========================================
// PHASE 8: COMMUNITY FORUM DTOs
// ==========================================
export interface ForumTagDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postsCount: number;
}

export interface ForumPostDto {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  slug: string;
  contentMdx: string;
  viewsCount: number;
  upvotesCount: number;
  downvotesCount: number;
  score: number;
  answersCount: number;
  acceptedAnswerId?: string;
  tags: ForumTagDto[];
  userVote?: ForumVoteType;
  createdAt: string;
  updatedAt: string;
}

export interface ForumAnswerDto {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  contentMdx: string;
  upvotesCount: number;
  downvotesCount: number;
  score: number;
  isAccepted: boolean;
  userVote?: ForumVoteType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateForumPostDto {
  title: string;
  contentMdx: string;
  tagIds: string[];
}

export interface CreateForumAnswerDto {
  contentMdx: string;
}

export interface VoteForumDto {
  targetType: ForumTargetType;
  targetId: string;
  voteType: ForumVoteType;
}

// ==========================================
// PHASE 8: CAREER INTELLIGENCE DTOs
// ==========================================
export interface CareerGoalDto {
  id: string;
  userId: string;
  targetRole: CareerRole;
  targetLevel: string;
  targetTimelineMonths: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareerSkillGapDto {
  skillName: string;
  requiredLevel: string;
  currentLevel: string;
  isMet: boolean;
  gapSeverity: 'none' | 'minor' | 'critical';
}

export interface CareerRoadmapPhaseDto {
  phaseNumber: number;
  title: string;
  description: string;
  topics: string[];
  recommendedProjects: string[];
}

export interface CareerPathDetailDto {
  role: CareerRole;
  title: string;
  description: string;
  marketDemand: 'Very High' | 'High' | 'Moderate';
  avgSalaryRange: string;
  keySkills: string[];
  roadmapPhases: CareerRoadmapPhaseDto[];
}

export interface CareerReadinessDto {
  targetRole: CareerRole;
  readinessScore: number;
  skillGaps: CareerSkillGapDto[];
  recommendedCourses: {
    topicId: string;
    title: string;
    languageId: string;
  }[];
  recommendedProjects: {
    title: string;
    difficulty: string;
    description: string;
  }[];
  timelineEstimate: string;
  careerRoadmap: CareerPathDetailDto;
}

export interface SetCareerGoalDto {
  targetRole: CareerRole;
  targetLevel?: string;
  targetTimelineMonths?: number;
}

// ==========================================
// PHASE 8: AI INTERVIEW PREPARATION DTOs
// ==========================================
export interface InterviewSessionDto {
  id: string;
  userId: string;
  interviewType: InterviewType;
  roleTitle: string;
  difficulty: ProblemDifficulty | string;
  status: InterviewStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  overallScore?: number;
  communicationScore?: number;
  technicalScore?: number;
  confidenceScore?: number;
  startedAt: string;
  completedAt?: string;
}

export interface InterviewExchangeDto {
  id: string;
  sessionId: string;
  questionOrder: number;
  questionText: string;
  userAnswerText?: string;
  evaluationFeedback?: string;
  score?: number;
  timeSpentSeconds?: number;
  createdAt: string;
}

export interface StartInterviewDto {
  interviewType: InterviewType;
  roleTitle: string;
  difficulty: ProblemDifficulty | string;
}

export interface AnswerInterviewQuestionDto {
  exchangeId: string;
  answerText: string;
  timeSpentSeconds?: number;
}

export interface InterviewFeedbackDto {
  session: InterviewSessionDto;
  exchanges: InterviewExchangeDto[];
  feedbackSummaryMdx: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
}

// ==========================================
// PHASE 8: AI RESUME GENERATOR DTOs
// ==========================================
export interface ResumeDto {
  id: string;
  userId: string;
  title: string;
  templateName: string;
  targetRole: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    highlights: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    repoUrl?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
  }[];
  atsScore?: number;
  atsFeedback?: {
    score: number;
    strengths: string[];
    missingKeywords: string[];
    formattingSuggestions: string[];
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeDto {
  title: string;
  templateName?: string;
  targetRole: string;
  importCodeforgeData?: boolean;
  personalInfo?: ResumeDto['personalInfo'];
  skills?: string[];
  experience?: ResumeDto['experience'];
  projects?: ResumeDto['projects'];
  education?: ResumeDto['education'];
}

export interface UpdateResumeDto {
  title?: string;
  templateName?: string;
  targetRole?: string;
  personalInfo?: ResumeDto['personalInfo'];
  skills?: string[];
  experience?: ResumeDto['experience'];
  projects?: ResumeDto['projects'];
  education?: ResumeDto['education'];
  atsScore?: number;
  atsFeedback?: ResumeDto['atsFeedback'];
  isPublic?: boolean;
}


export interface AtsAnalysisDto {
  score: number;
  strengths: string[];
  missingKeywords: string[];
  suggestions: string[];
}

// ==========================================
// PHASE 8: TALENT DISCOVERY & SOCIAL FEED DTOs
// ==========================================
export interface TalentSearchQueryDto {
  role?: string;
  language?: string;
  skill?: string;
  minRating?: number;
  experience?: string;
  limit?: number;
  offset?: number;
}

export interface TalentProfileSummaryDto {
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  rating: number;
  rankTier: string;
  topLanguages: string[];
  skills: string[];
  projectsCount: number;
  contestsRank?: number;
}

export interface ActivityFeedEventDto {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  activityType: ActivityType;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  isPublic: boolean;
  createdAt: string;
}

export type PortfolioDto = FullPortfolioDto;

export interface ForumPostDetailDto extends ForumPostDto {
  answers: ForumAnswerDto[];
}

export type CreateStudyDiscussionDto = CreateDiscussionDto;

export interface CreateStudyGoalDto {
  title: string;
  description?: string;
  targetDate?: string;
  targetTopicId?: string;
  targetContestId?: string;
}

// ==========================================
// PHASE 9: ONLINE JUDGE & COMPETITIVE CODING ARENA DTOs
// ==========================================

export interface LanguageRuntimeDto {
  id: string;
  languageId: LanguageId;
  displayName: string;
  version: string;
  compilerPath?: string;
  runtimePath?: string;
  compileCommand?: string;
  runCommand?: string;
  timeLimitMultiplier: number;
  memoryLimitMultiplier: number;
  isCompiled: boolean;
  isActive: boolean;
}

export interface SubmitSolutionDto {
  problemId: string;
  languageId: LanguageId;
  sourceCode: string;
  contestId?: string;
}

export interface RunCodeDto {
  problemId: string;
  languageId: LanguageId;
  sourceCode: string;
  customInput?: string;
}

export type SubmissionTestResultDto = SubmissionTestCaseResultDto;

export interface SubmissionResultDto {
  id: string;
  submissionId: string;
  status: SubmissionStatus | JudgeVerdict;
  verdict: JudgeVerdict;
  totalRuntimeMs: number;
  peakMemoryKb: number;
  passedTestCases: number;
  totalTestCases: number;
  compileOutput?: string | null;
  testResults: SubmissionTestResultDto[];
}

export interface SubmissionDetailDto extends SubmissionDto {
  result?: SubmissionResultDto;
}

export interface JudgeRunResultDto {
  status: SubmissionStatus | JudgeVerdict;
  verdict: JudgeVerdict;
  executionTimeMs: number;
  memoryKb: number;
  compileOutput?: string;
  sampleResults: {
    sequence: number;
    inputData: string;
    expectedOutput: string;
    actualOutput: string;
    isPassed: boolean;
    executionTimeMs: number;
    memoryKb: number;
    errorMessage?: string;
  }[];
}

export interface SubmissionAnalysisDto {
  submissionId: string;
  verdict: JudgeVerdict;
  probableBugCategory: string;
  likelyRootCause: string;
  missedEdgeCases: string[];
  complexityConcerns: {
    estimatedTimeComplexity?: string;
    estimatedSpaceComplexity?: string;
    analysis: string;
  };
  recommendedLearningTopics: {
    topicId?: string;
    title: string;
    reason: string;
  }[];
  suggestedNextProblems: {
    problemId?: string;
    slug?: string;
    title: string;
    difficulty: ProblemDifficulty | string;
  }[];
}

export interface PerformanceAnalyticsDto {
  userId: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  averageRuntimeMs: number;
  averageMemoryKb: number;
  languageUsage: {
    languageId: LanguageId;
    count: number;
    percentage: number;
  }[];
  solvedByDifficulty: {
    easy: number;
    medium: number;
    difficult: number;
    total: number;
  };
  verdictDistribution: Record<string, number>;
  recentTrend: {
    date: string;
    submissionsCount: number;
    acceptedCount: number;
  }[];
  topicMasteryIndicators: {
    topicId: string;
    topicName: string;
    masteryScore: number;
    solvedCount: number;
  }[];
}

export interface SubmissionFilterQueryDto {
  userId?: string;
  problemId?: string;
  contestId?: string;
  languageId?: LanguageId;
  status?: SubmissionStatus | JudgeVerdict;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'runtime' | 'memory';
  sortOrder?: 'asc' | 'desc';
}
