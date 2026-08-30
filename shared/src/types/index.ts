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
  JobType,
  WorkplaceType,
  JobStatus,
  ApplicationStage,
  MatchCategory,
  ReferralStatus,
  HiringInterviewType,
  HiringInterviewStatus,
  OfferRecommendation,
  OrgMemberRole,
  OrgPlan,
  CohortStatus,
  CourseLevel,
  CourseStatus,
  CourseEnrollmentStatus,
  MentorSessionStatus,
  StudentPlacementStatus,
  CertificationStatus,
  RiskLevel,
  RecommendationCategory,
  SkillDemandCategory,
  ForecastHorizon,
  CareerGoalType,
  CareerGoalStatus,
  CareerEventType,
  NetworkRelationType,
  CoachingFrequency,
  CareerRiskAlertLevel,
  AgentType,
  AgentStatus,
  AgentTaskPriority,
  WorkflowStatus,
  WorkflowTriggerType,
  MemoryType,
  KnowledgeNodeType,
  KnowledgeRelationType,
  DocumentType,
  DecisionType,
  MarketplaceCategory,
  PricingModel,
  AgentVerificationStatus,
  PluginType,
  PluginPermission,
  IntegrationProvider,
  IntegrationStatus,
  WorkflowCategory,
  SubscriptionStatus,
  TransactionType,
  WebhookEvent,
  AgentCloudState,
  DistributedWorkflowType,
  WorkflowRunStatus,
  WorkflowStepStatus,
  GlobalEventType,
  WorkforceAgentRole,
  TaskOSPriority,
  TaskOSStatus,
  MemoryFabricType,
  KnowledgeGraphDomain,
  DecisionCenterStatus,
  TelemetryMetricType,
  GlobalNodeType,
  GlobalEdgeType,
  VerificationStatus,
  PublicationStatus,
  DigitalTwinType,
  ReputationTier,
  VentureStage,
  SuperintelligenceScope,
  TrendCategory,
  EcosystemEventCategory,
  PlanetaryTwinType,
  CivilizationHealthTier,
  GovernanceCouncilType,
  PolicyStatus,
  InnovationDomain,
  FederationProtocol,
  AgentFederationStatus,
  EconomicSignalType,
  ForesightHorizon,
  PlanetaryEventCategory,
  CognitiveGoalStatus,
  ReasoningStrategy,
  CognitiveMemoryType,
  AgentCouncilType,
  ConsensusStatus,
  PredictionHorizon,
  ExecutionLoopState,
  SelfImprovementDomain,
  MetacognitionConfidence,
  StrategicPriority,
  OrganizationCivilizationType,
  DigitalEmployeeRole,
  EmployeeEmploymentStatus,
  CompanyStage,
  ProductLifecycleStage,
  EnterpriseFederationType,
  InvestmentReadinessTier,
  ExecutionNetworkTaskPriority,
  ExecutionNetworkTaskStatus,
  EconomicSimulationScenario,
  StartupStage,
  StartupCategory,
  MarketRiskLevel,
  IncubationPhase,
  CustomerPersonaType,
  GrowthChannel,
  VentureHealthStatus,
  StartupFundingStage,
  InvestorType,
  StartupEventType,
  DealStage,
  DealPriority,
  DiligenceCategory,
  DiligenceRiskSeverity,
  InvestmentRecommendation,
  CommitteeType,
  CommitteeVoteType,
  FundType,
  FundStatus,
  ExitType,
  ExitStatus,
  AllocationStrategy,
  SyndicateRole,
  AcademicDepartment,
  ResearchProgramStatus,
  LabType,
  LabStatus,
  ExperimentStatus,
  HypothesisStatus,
  DiscoverySignificance,
  PublicationType,
  PeerReviewRole,
  PeerReviewVerdict,
  GrantType,
  GrantStatus,
  SoftwareProjectType,
  SoftwareProjectStatus,
  EngineeringTaskType,
  EngineeringTaskStatus,
  ArtifactType,
  BlueprintComplexity,
  ClusterRegion,
  ClusterStatus,
  ComputeNodeType,
  ComputeNodeStatus,
  DeploymentStatus,
  WorkloadType,
  AssetType,
  AnalysisStatus,
  ReasoningComplexity,
  ThreatSeverity,
  ThreatStatus,
  VulnerabilityStatus,
  IncidentStatus,
  DataSourceType,
  AnalyticsJobStatus,
  InsightType,
  QualityRating,
  PlatformEventSeverity,
  OrchestrationStepStatus,
  CrossModuleWorkflowStatus,
  AgentTaskStatus,
  EcosystemAgentType,
  EcosystemAgentStatus,
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

// ==========================================
// Phase 10: AI Placement & Hiring Ecosystem DTOs
// ==========================================

export interface CompanyDto {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logoUrl: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  jobCount?: number;
  recruiterCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  name: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  isVerified?: boolean;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {
  isVerified?: boolean;
}

export interface RecruiterProfileDto {
  id: string;
  userId: string;
  companyId: string;
  companyName?: string;
  companySlug?: string;
  companyLogoUrl?: string | null;
  isCompanyVerified?: boolean;
  title: string;
  department?: string | null;
  linkedinUrl?: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface RegisterRecruiterDto {
  companyId?: string;
  companyName?: string;
  title: string;
  department?: string;
  linkedinUrl?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
}

export interface JobPostingDto {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  companyLogoUrl: string | null;
  isCompanyVerified: boolean;
  recruiterId: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  skillsRequired: string[];
  minRatingRequired: number;
  minAssessmentScore: number;
  jobType: JobType;
  workplaceType: WorkplaceType;
  location: string;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  experienceLevel: string;
  status: JobStatus;
  applicantCount?: number;
  matchScore?: number;
  matchCategory?: MatchCategory;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPostingDto {
  title: string;
  description: string;
  requirements: string;
  skillsRequired: string[];
  minRatingRequired?: number;
  minAssessmentScore?: number;
  jobType: JobType;
  workplaceType: WorkplaceType;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  experienceLevel: string;
  expiresAt?: string;
}

export interface UpdateJobPostingDto extends Partial<CreateJobPostingDto> {
  status?: JobStatus;
}

export interface JobFilterQueryDto {
  search?: string;
  jobType?: JobType;
  workplaceType?: WorkplaceType;
  location?: string;
  skills?: string[];
  minSalary?: number;
  experienceLevel?: string;
  companyId?: string;
  status?: JobStatus;
  minMatchScore?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'salary' | 'matchScore' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface JobMatchScoreDto {
  jobId: string;
  candidateId: string;
  overallScore: number;
  category: MatchCategory;
  breakdown: {
    skillScore: number;
    ratingScore: number;
    assessmentScore: number;
    careerGoalScore: number;
    portfolioScore: number;
    resumeScore: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  insights: string[];
}

export interface JobRecommendationDto {
  job: JobPostingDto;
  match: JobMatchScoreDto;
}

export interface JobApplicationDto {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  candidateId: string;
  candidateName: string;
  candidateUsername: string;
  candidateAvatarUrl: string | null;
  candidateRating: number;
  candidateEmail: string;
  resumeId: string | null;
  portfolioId: string | null;
  stage: ApplicationStage;
  matchScore: number;
  matchCategory: MatchCategory;
  coverLetter: string | null;
  recruiterNotes: string | null;
  rejectionReason: string | null;
  appliedAt: string;
  updatedAt: string;
  timeline?: ApplicationStageHistoryDto[];
  interviews?: HiringInterviewDto[];
}

export interface CreateApplicationDto {
  jobId: string;
  resumeId?: string;
  portfolioId?: string;
  coverLetter?: string;
}

export interface UpdateApplicationStageDto {
  stage: ApplicationStage;
  notes?: string;
  rejectionReason?: string;
}

export interface ApplicationStageHistoryDto {
  id: string;
  applicationId: string;
  fromStage: ApplicationStage | null;
  toStage: ApplicationStage;
  notes: string | null;
  changedByUserId: string;
  changedByUsername?: string;
  changedAt: string;
}

export interface CareerAdvisorAnalysisDto {
  candidateId: string;
  targetRole: string;
  currentLevel: string;
  interviewReadinessScore: number;
  placementProbability: number;
  salaryEstimation: {
    minAnnual: number;
    maxAnnual: number;
    medianAnnual: number;
    currency: string;
    percentileRank: number;
  };
  skillGaps: {
    skill: string;
    importance: 'critical' | 'important' | 'nice_to_have';
    currentProficiency: number;
    targetProficiency: number;
  }[];
  careerTrajectory: {
    stage: string;
    timeline: string;
    targetRoles: string[];
    milestones: string[];
  }[];
  personalizedRoadmap: {
    step: number;
    title: string;
    description: string;
    recommendedProblemIds: string[];
    recommendedTopics: string[];
    estimatedWeeks: number;
  }[];
}

export interface ReferralDto {
  id: string;
  companyId: string;
  companyName: string;
  referrerId: string;
  referrerName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string | null;
  jobTitle: string | null;
  status: ReferralStatus;
  notes: string | null;
  bonusAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferralDto {
  candidateEmail: string;
  candidateName: string;
  companyId: string;
  jobId?: string;
  notes?: string;
}

export interface ReferralRequestDto {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  targetCompanyId: string;
  targetCompanyName: string;
  message: string;
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferralRequestDto {
  jobId: string;
  message: string;
}

export interface HiringChallengeDto {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  recruiterId: string;
  contestId: string;
  title: string;
  description: string;
  minScoreThreshold: number;
  autoShortlist: boolean;
  targetRole: string;
  startsAt: string;
  endsAt: string;
  participantCount: number;
  shortlistedCount: number;
  createdAt: string;
}

export interface CreateHiringChallengeDto {
  title: string;
  description: string;
  contestId: string;
  minScoreThreshold: number;
  autoShortlist: boolean;
  targetRole: string;
  startsAt: string;
  endsAt: string;
}

export interface HiringChallengeStandingDto {
  rank: number;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  score: number;
  penaltyTimeMinutes: number;
  isShortlisted: boolean;
  rating: number;
  skills: string[];
}

export interface HiringInterviewDto {
  id: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  interviewerId: string;
  interviewerName: string;
  interviewType: HiringInterviewType;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl: string | null;
  status: HiringInterviewStatus;
  feedbackNotes: string | null;
  technicalScore: number | null;
  communicationScore: number | null;
  problemSolvingScore: number | null;
  recommendation: OfferRecommendation | null;
  completedAt: string | null;
  createdAt: string;
}

export interface ScheduleInterviewDto {
  applicationId: string;
  interviewType: HiringInterviewType;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  interviewerId?: string;
}

export interface SubmitInterviewFeedbackDto {
  feedbackNotes: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  recommendation: OfferRecommendation;
}

export interface TalentAnalyticsDto {
  companyId: string;
  totalJobPostings: number;
  activeJobs: number;
  totalApplicants: number;
  shortlistedCandidates: number;
  interviewsConducted: number;
  offersExtended: number;
  hiresMade: number;
  funnel: {
    stage: ApplicationStage;
    count: number;
    conversionRate: number;
  }[];
  skillHeatmap: {
    skill: string;
    candidateCount: number;
    averageScore: number;
    demandCount: number;
  }[];
  topPerformingCollegesOrTags: {
    name: string;
    hireCount: number;
  }[];
  timeToHireDays: number;
}

// ==========================================
// Phase 11: Enterprise, University & LMS Types
// ==========================================

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  domain: string | null;
  themeConfig?: Record<string, any> | null;
  plan: OrgPlan;
  isVerified: boolean;
  memberCount?: number;
  departmentCount?: number;
  cohortCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  domain?: string;
  logoUrl?: string;
  plan?: OrgPlan;
  themeConfig?: Record<string, any>;
}

export interface UpdateOrganizationDto {
  name?: string;
  domain?: string;
  logoUrl?: string;
  plan?: OrgPlan;
  themeConfig?: Record<string, any>;
}

export interface OrganizationMemberDto {
  id: string;
  organizationId: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: OrgMemberRole;
  department?: string | null;
  title?: string | null;
  createdAt: string;
}

export interface AddOrgMemberDto {
  userId?: string;
  email?: string;
  role: OrgMemberRole;
  department?: string;
  title?: string;
}

export interface DepartmentDto {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  headUserId?: string | null;
  headUserName?: string | null;
  budget?: number | null;
  studentOrMemberCount?: number;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  headUserId?: string;
  budget?: number;
}

export interface TeamDto {
  id: string;
  organizationId: string;
  departmentId?: string | null;
  name: string;
  description?: string | null;
  leadUserId?: string | null;
  leadUserName?: string | null;
  memberCount?: number;
  createdAt: string;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  departmentId?: string;
  leadUserId?: string;
}

export interface CohortDto {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount?: number;
  status: CohortStatus;
  createdAt: string;
}

export interface CreateCohortDto {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  capacity?: number;
  status?: CohortStatus;
}

export interface UniversityDto {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  state?: string | null;
  country?: string | null;
  accreditationGrade?: string | null;
  ranking?: number | null;
  isVerified: boolean;
  totalStudents?: number;
  totalDepartments?: number;
  placementRate?: number;
  createdAt: string;
}

export interface CreateUniversityDto {
  name: string;
  website?: string;
  logoUrl?: string;
  state?: string;
  country?: string;
  accreditationGrade?: string;
  ranking?: number;
}

export interface UpdateUniversityDto extends Partial<CreateUniversityDto> {
  isVerified?: boolean;
}

export interface BatchDto {
  id: string;
  universityId: string;
  departmentId?: string | null;
  departmentName?: string | null;
  name: string;
  graduationYear: number;
  totalStudents: number;
  placedCount?: number;
  averageCgpa?: number;
  createdAt: string;
}

export interface CreateBatchDto {
  departmentId?: string;
  name: string;
  graduationYear: number;
  totalStudents?: number;
}

export interface StudentProfileDto {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  universityId: string;
  universityName?: string;
  departmentId?: string | null;
  departmentName?: string | null;
  batchId?: string | null;
  batchName?: string | null;
  studentRollNumber: string;
  cgpa: number;
  semester: number;
  placementStatus: StudentPlacementStatus;
  rating?: number;
  ranking?: number;
  createdAt: string;
}

export interface RegisterStudentDto {
  universityId: string;
  departmentId?: string;
  batchId?: string;
  studentRollNumber: string;
  cgpa?: number;
  semester?: number;
}

export interface AcademicRecordDto {
  id: string;
  studentId: string;
  semester: number;
  sgpa: number;
  creditsCompleted: number;
  backlogCount: number;
  termDate: string;
}

export interface PlacementRecordDto {
  id: string;
  studentId: string;
  studentName?: string;
  universityId: string;
  companyName: string;
  role: string;
  packageLpa: number;
  offerDate: string;
  status: string;
}

export interface CreatePlacementRecordDto {
  studentId: string;
  universityId: string;
  companyName: string;
  role: string;
  packageLpa: number;
  offerDate: string;
  status?: string;
}

export interface UniversityAnalyticsDto {
  universityId: string;
  universityName: string;
  totalStudents: number;
  placedStudents: number;
  placementRatePercentage: number;
  averagePackageLpa: number;
  highestPackageLpa: number;
  departmentPerformance: {
    departmentId: string;
    departmentName: string;
    studentCount: number;
    placedCount: number;
    averageCgpa: number;
    averageRating: number;
  }[];
  batchComparison: {
    batchName: string;
    graduationYear: number;
    totalStudents: number;
    placementRate: number;
  }[];
  topHiringPartners: {
    companyName: string;
    hiredCount: number;
    avgPackageLpa: number;
  }[];
}

export interface MentorProfileDto {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  organizationId?: string | null;
  organizationName?: string | null;
  specialization: string[];
  bio: string;
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface RegisterMentorDto {
  organizationId?: string;
  specialization: string[];
  bio: string;
  hourlyRate?: number;
  isAvailable?: boolean;
}

export interface FacultyMentorSessionDto {
  id: string;
  mentorId: string;
  mentorName?: string;
  menteeUserId: string;
  menteeName?: string;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string | null;
  status: MentorSessionStatus;
  notes?: string | null;
  rating?: number | null;
  feedback?: string | null;
  createdAt: string;
}

export type FacultySessionDto = FacultyMentorSessionDto;

export interface BookMentorSessionDto {
  mentorId: string;
  topic: string;
  scheduledAt: string;
  durationMinutes?: number;
  notes?: string;
}

export interface SubmitSessionFeedbackDto {
  rating: number;
  feedback: string;
}

export interface StudentMentorshipDto {
  id: string;
  mentorId: string;
  mentorName?: string;
  studentId: string;
  studentName?: string;
  startDate: string;
  status: string;
  goals: string[];
}

export interface CourseDto {
  id: string;
  organizationId?: string | null;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  price: number;
  status: CourseStatus;
  thumbnailUrl?: string | null;
  modulesCount?: number;
  enrolledCount?: number;
  rating?: number;
  createdAt: string;
}

export interface CreateCourseDto {
  organizationId?: string;
  title: string;
  description: string;
  level?: CourseLevel;
  price?: number;
  thumbnailUrl?: string;
  status?: CourseStatus;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

export interface CourseModuleDto {
  id: string;
  courseId: string;
  title: string;
  sequence: number;
  durationMinutes: number;
  lessonsCount?: number;
}

export interface CreateCourseModuleDto {
  title: string;
  sequence?: number;
  durationMinutes?: number;
}

export interface CourseEnrollmentDto {
  id: string;
  courseId: string;
  courseTitle?: string;
  userId: string;
  userName?: string;
  cohortId?: string | null;
  progressPercentage: number;
  status: CourseEnrollmentStatus;
  enrolledAt: string;
  completedAt?: string | null;
}

export interface LearningPathDto {
  id: string;
  organizationId?: string | null;
  title: string;
  slug: string;
  description: string;
  targetRole: string;
  courseIds: string[];
  courses?: CourseDto[];
  estimatedHours: number;
  status: string;
  enrolledCount?: number;
  createdAt: string;
}

export interface CreateLearningPathDto {
  organizationId?: string;
  title: string;
  description: string;
  targetRole: string;
  courseIds: string[];
  estimatedHours?: number;
}

export interface CertificateTemplateDto {
  id: string;
  organizationId?: string | null;
  name: string;
  templateHtml?: string | null;
  badgeImageUrl?: string | null;
  issuerName: string;
  criteriaJson?: Record<string, any> | null;
}

export interface CreateCertificateTemplateDto {
  organizationId?: string;
  name: string;
  templateHtml?: string;
  badgeImageUrl?: string;
  issuerName: string;
  criteriaJson?: Record<string, any>;
}

export interface CertificationDto {
  id: string;
  certificateNumber: string;
  recipientUserId: string;
  recipientName?: string;
  recipientEmail?: string;
  organizationId?: string | null;
  organizationName?: string | null;
  templateId?: string | null;
  courseId?: string | null;
  courseTitle?: string | null;
  skillName: string;
  score: number;
  issueDate: string;
  expiryDate?: string | null;
  qrCodeUrl: string;
  verificationHash: string;
  isRevoked: boolean;
  status: CertificationStatus;
}

export interface IssueCertificationDto {
  recipientUserId: string;
  organizationId?: string;
  templateId?: string;
  courseId?: string;
  skillName: string;
  score?: number;
  expiresInDays?: number;
}

export interface CertificateVerificationResultDto {
  isValid: boolean;
  certificate?: CertificationDto;
  reason?: string;
  verifiedAt: string;
}

export interface SkillDemandForecastDto {
  skill: string;
  category: string;
  demandScore: number; // 0 - 100
  growthRatePercentage: number;
  hiringVolume: number;
  avgSalaryUsd: number;
  projectedDemand2027: number;
}

export interface SalaryIntelligenceDto {
  role: string;
  experienceLevel: string;
  medianSalaryUsd: number;
  percentile25th: number;
  percentile75th: number;
  percentile90th: number;
  salaryGrowthYoY: number;
}

export interface TechAdoptionTrendDto {
  technology: string;
  ecosystem: string;
  adoptionScore: number;
  momentum: 'ACCELERATING' | 'STEADY' | 'MATURE' | 'DECLINING';
  recommendedForCurriculum: boolean;
}

export interface WorkforceReadinessDto {
  overallReadinessIndex: number; // 0 - 100
  industryBenchmark: number;
  activeLearnersCount: number;
  jobReadyTalentCount: number;
  topTalentClusters: {
    domain: string;
    candidateCount: number;
    readinessScore: number;
  }[];
}

export interface WorkforceIntelligenceDto {
  forecastDate: string;
  workforceReadiness: WorkforceReadinessDto;
  topDemandedSkills: SkillDemandForecastDto[];
  salaryIntelligence: SalaryIntelligenceDto[];
  techTrends: TechAdoptionTrendDto[];
}

export interface ExecutiveKPIRollupDto {
  totalInstitutions: number;
  totalOrganizations: number;
  totalStudentsEnrolled: number;
  overallPlacementRate: number;
  averageStartingSalaryLpa: number;
  coursesCompleted: number;
  certificationsIssued: number;
  activeMentorshipSessions: number;
}

export interface ExecutiveAnalyticsDto {
  kpis: ExecutiveKPIRollupDto;
  institutionalLeaderboard: {
    institutionId: string;
    institutionName: string;
    studentCount: number;
    placementRate: number;
    avgRating: number;
  }[];
  workforcePipelineTrend: {
    month: string;
    studentsEnrolled: number;
    certificationsEarned: number;
    placementsConducted: number;
  }[];
  curriculumEffectiveness: {
    courseTitle: string;
    completionRate: number;
    avgAssessmentScore: number;
    industryHiringCorrelation: number;
  }[];
}

export interface StudentRiskAlertDto {
  studentId: string;
  studentName: string;
  rollNumber: string;
  universityName: string;
  departmentName: string;
  riskLevel: RiskLevel;
  riskFactors: string[];
  recommendedAction: string;
  cgpa: number;
  backlogCount: number;
  platformActivityScore: number;
}

export interface ExecutiveRecommendationDto {
  id: string;
  category: RecommendationCategory;
  title: string;
  impactScore: number; // 1 - 10
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  actionPayload?: Record<string, any>;
}

export interface AdminCopilotInsightsDto {
  timestamp: string;
  studentRiskAlerts: StudentRiskAlertDto[];
  recommendations: ExecutiveRecommendationDto[];
  placementForecasts: {
    cohortName: string;
    expectedPlacementRate: number;
    projectedTopRecruiters: string[];
  }[];
  curriculumGaps: {
    topic: string;
    industryDemandGap: string;
    actionableProposal: string;
  }[];
}

export interface WhiteLabelConfigDto {
  organizationId: string;
  organizationName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  customDomain: string | null;
  portalTitle: string;
}

export interface UpdateWhiteLabelDto {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  customDomain?: string;
  portalTitle?: string;
}

// ==========================================
// PHASE 12: AI CAREER OPERATING SYSTEM (CAREER OS) DTOs
// ==========================================

export interface CareerHealthMetricsDto {
  healthScore: number; // 0 - 100
  learningVelocity: number; // 0 - 100
  careerMomentum: number; // 0 - 100
  marketCompetitiveness: number; // 0 - 100
  interviewReadiness: number; // 0 - 100
  salaryPositioning: number; // 0 - 100
  leadershipPotential: number; // 0 - 100
}

export interface CareerTwinDto {
  id: string;
  userId: string;
  healthScore: number;
  learningVelocity: number;
  careerMomentum: number;
  marketCompetitiveness: number;
  interviewReadiness: number;
  salaryPositioning: number;
  leadershipPotential: number;
  currentRole: string;
  targetRole: string;
  currentLevel: string;
  targetLevel: string;
  currentSalaryUsd?: number | null;
  targetSalaryUsd?: number | null;
  yearsOfExperience: number;
  primarySkills: string[];
  topStrengths: string[];
  growthAreas: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCareerTwinDto {
  currentRole: string;
  targetRole: string;
  currentLevel?: string;
  targetLevel?: string;
  currentSalaryUsd?: number;
  targetSalaryUsd?: number;
  yearsOfExperience?: number;
  primarySkills?: string[];
}

export interface UpdateCareerTwinDto {
  currentRole?: string;
  targetRole?: string;
  currentLevel?: string;
  targetLevel?: string;
  currentSalaryUsd?: number;
  targetSalaryUsd?: number;
  yearsOfExperience?: number;
  primarySkills?: string[];
  topStrengths?: string[];
  growthAreas?: string[];
  metadata?: Record<string, any>;
}

export interface CareerSnapshotDto {
  id: string;
  twinId: string;
  userId: string;
  healthScore: number;
  metrics: CareerHealthMetricsDto;
  snapshotDate: string;
  createdAt: string;
}

export interface CareerEventDto {
  id: string;
  twinId: string;
  userId: string;
  eventType: CareerEventType;
  title: string;
  description: string;
  company?: string | null;
  role?: string | null;
  salaryUsd?: number | null;
  eventDate: string;
  isVerified: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CreateCareerEventDto {
  eventType: CareerEventType;
  title: string;
  description: string;
  company?: string;
  role?: string;
  salaryUsd?: number;
  eventDate?: string;
  metadata?: Record<string, any>;
}

export interface CareerMilestoneDto {
  id: string;
  twinId: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  isAchieved: boolean;
  targetDate?: string | null;
  achievedDate?: string | null;
  xpEarned: number;
  createdAt: string;
}

export interface CareerOsGoalDto {
  id: string;
  twinId: string;
  userId: string;
  type: CareerGoalType;
  title: string;
  description: string;
  targetRole?: string | null;
  targetSalaryUsd?: number | null;
  progressPercentage: number; // 0 - 100
  status: CareerGoalStatus;
  targetDate?: string | null;
  achievedDate?: string | null;
  milestones: { title: string; completed: boolean; dueDate?: string }[];
  riskFactors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCareerOsGoalDto {
  type: CareerGoalType;
  title: string;
  description: string;
  targetRole?: string;
  targetSalaryUsd?: number;
  targetDate?: string;
  milestones?: { title: string; completed: boolean; dueDate?: string }[];
}

export interface UpdateCareerOsGoalDto {
  title?: string;
  description?: string;
  targetRole?: string;
  targetSalaryUsd?: number;
  progressPercentage?: number;
  status?: CareerGoalStatus;
  targetDate?: string;
  achievedDate?: string;
  milestones?: { title: string; completed: boolean; dueDate?: string }[];
  riskFactors?: string[];
}

export interface CareerOsRoadmapDto {
  userId: string;
  currentRole: string;
  targetRole: string;
  overallProgress: number;
  estimatedMonthsToTarget: number;
  goals: CareerOsGoalDto[];
  criticalPath: string[];
  riskMitigationTips: string[];
}

export interface CareerRiskAlertDto {
  id: string;
  level: CareerRiskAlertLevel;
  category: string;
  title: string;
  description: string;
  suggestedAction: string;
  identifiedAt: string;
}

export interface PromotionPlanDto {
  targetRole: string;
  currentReadinessScore: number; // 0 - 100
  estimatedHorizonMonths: number;
  keyCompetencyGaps: string[];
  leadershipProofPoints: string[];
  recommendedSponsors: string[];
}

export interface JobSwitchPlanDto {
  targetRole: string;
  marketDemandScore: number;
  targetSalaryRange: { min: number; median: number; max: number };
  interviewReadiness: number;
  recommendedPrepTimeWeeks: number;
  targetCompanies: string[];
}

export interface CareerCoachingReportDto {
  id: string;
  twinId: string;
  userId: string;
  frequency: CoachingFrequency;
  summary: string;
  healthMetrics: CareerHealthMetricsDto;
  strengths: string[];
  riskAlerts: CareerRiskAlertDto[];
  actionItems: { priority: 'HIGH' | 'MEDIUM' | 'LOW'; action: string; category: string }[];
  promotionReadiness: number;
  burnoutRiskScore: number;
  promotionPlan?: PromotionPlanDto;
  jobSwitchPlan?: JobSwitchPlanDto;
  generatedAt: string;
}

export interface SkillMarketDemandForecastDto {
  skill: string;
  category: string;
  demandCategory: SkillDemandCategory;
  demandScore: number; // 0 - 100
  growthRatePercentage: number;
  forecast6Months: number;
  forecast1Year: number;
  forecast3Years: number;
  forecast5Years: number;
  isEmerging: boolean;
  isRecommended: boolean;
}

export interface SkillMarketIntelligenceDto {
  asOf: string;
  topInDemandSkills: SkillMarketDemandForecastDto[];
  explodingSkills: SkillMarketDemandForecastDto[];
  decliningSkills: SkillMarketDemandForecastDto[];
  emergingTechnologies: { tech: string; domain: string; adoptionVelocity: string }[];
  recommendedLearningFocus: string[];
}

export interface SalaryBenchmarkDto {
  role: string;
  level: string;
  region: string;
  p25SalaryUsd: number;
  p50SalaryUsd: number;
  p75SalaryUsd: number;
  p90SalaryUsd: number;
  currency: string;
  annualBonusAvgUsd: number;
  equityAvgUsd: number;
}

export interface SkillSalaryPremiumDto {
  skill: string;
  salaryPremiumPercentage: number;
  avgEstimatedBoostUsd: number;
  highDemandSectors: string[];
}

export interface SalaryIntelligenceReportDto {
  userRole: string;
  currentEstimatedP50: number;
  userPositionPercentile: number;
  benchmarks: SalaryBenchmarkDto[];
  promotionSalaryForecastUsd: number;
  jobSwitchSalaryForecastUsd: number;
  skillSalaryPremiums: SkillSalaryPremiumDto[];
  compensationRecommendations: string[];
}

export interface PersonalBrandScoreDto {
  brandScore: number; // 0 - 100
  githubScore: number;
  portfolioScore: number;
  linkedinScore: number;
  contentScore: number;
  ossScore: number;
  brandTier: 'AUTHORITY' | 'STRONG' | 'DEVELOPING' | 'EMERGING';
}

export interface ContentPlanDto {
  title: string;
  platform: 'BLOG' | 'LINKEDIN' | 'GITHUB' | 'TALK';
  targetAudience: string;
  recommendedKeywords: string[];
  estimatedReachScore: number;
}

export interface PersonalBrandProfileDto {
  userId: string;
  brandScore: PersonalBrandScoreDto;
  recommendations: string[];
  contentPlans: ContentPlanDto[];
  speakingOpportunities: { eventName: string; topic: string; deadline: string }[];
  openSourceRecommendations: { repoName: string; tech: string; difficulty: string }[];
  updatedAt: string;
}

export interface NetworkConnectionDto {
  id: string;
  userId: string;
  connectedUserId?: string | null;
  contactName: string;
  contactRole: string;
  contactCompany: string;
  relationType: NetworkRelationType;
  strengthScore: number; // 0 - 100
  notes?: string | null;
  lastInteractionAt?: string | null;
  createdAt: string;
}

export interface NetworkRecommendationDto {
  name: string;
  role: string;
  company: string;
  relationType: NetworkRelationType;
  matchReason: string;
  actionUrl?: string;
}

export interface NetworkIntelligenceDto {
  networkStrengthScore: number; // 0 - 100
  totalConnections: number;
  distributionByType: Record<string, number>;
  mentorRecommendations: NetworkRecommendationDto[];
  recruiterRecommendations: NetworkRecommendationDto[];
  industryEvents: { eventName: string; date: string; relevanceScore: number }[];
  recommendedCommunities: { communityName: string; focus: string; memberCount: number }[];
}

export interface CareerTimelineDto {
  userId: string;
  currentStanding: {
    role: string;
    level: string;
    company?: string;
    yearsOfExperience: number;
    healthScore: number;
  };
  historicalEvents: CareerEventDto[];
  milestones: CareerMilestoneDto[];
  futureMilestones: {
    title: string;
    expectedDate: string;
    category: string;
    associatedGoalTitle?: string;
  }[];
}

export interface CareerPredictionDto {
  horizon: ForecastHorizon;
  promotionProbability: number; // 0 - 100
  salaryGrowthProbability: number; // 0 - 100
  jobSwitchProbability: number; // 0 - 100
  leadershipReadiness: number; // 0 - 100
  skillRelevanceScore: number; // 0 - 100
  careerRiskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  predictedRoles: string[];
  growthDrivers: string[];
  riskFactors: string[];
}

export interface CareerPredictionReportDto {
  userId: string;
  generatedAt: string;
  predictions: CareerPredictionDto[];
  topRecommendations: string[];
  fastestPathToTarget: string;
}

// Phase 13: Agentic AI Workspace & Autonomous Productivity Types

export interface AgentDto {
  id: string;
  userId: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  systemPrompt: string;
  configuration: Record<string, unknown>;
  stats: {
    tasksCompleted: number;
    successRate: number;
    avgExecutionTimeMs: number;
    lastActiveAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentDto {
  name: string;
  type: AgentType;
  capabilities?: string[];
  systemPrompt?: string;
  configuration?: Record<string, unknown>;
}

export interface UpdateAgentDto {
  name?: string;
  status?: AgentStatus;
  capabilities?: string[];
  systemPrompt?: string;
  configuration?: Record<string, unknown>;
}

export interface AgentTaskDto {
  id: string;
  agentId: string;
  userId: string;
  title: string;
  description?: string;
  priority: AgentTaskPriority;
  status: AgentStatus;
  inputPayload: Record<string, unknown>;
  outputResult?: Record<string, unknown> | null;
  dependencies: string[];
  toolsUsed: string[];
  executionTimeMs?: number;
  createdAt: string;
  completedAt?: string | null;
}

export interface CreateAgentTaskDto {
  agentId: string;
  title: string;
  description?: string;
  priority?: AgentTaskPriority;
  inputPayload?: Record<string, unknown>;
  dependencies?: string[];
  toolsUsed?: string[];
}

export interface WorkflowStepDto {
  stepId: string;
  stepNumber: number;
  agentType: AgentType;
  action: string;
  inputTemplate: string;
  dependencies: string[];
  status?: AgentStatus;
  outputSummary?: string;
}

export interface AgentWorkflowDto {
  id: string;
  userId: string;
  title: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  status: WorkflowStatus;
  steps: WorkflowStepDto[];
  scheduleCron?: string | null;
  lastRunAt?: string | null;
  nextRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentWorkflowDto {
  title: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  steps: WorkflowStepDto[];
  scheduleCron?: string;
}

export interface UpdateAgentWorkflowDto {
  title?: string;
  description?: string;
  status?: WorkflowStatus;
  steps?: WorkflowStepDto[];
  scheduleCron?: string;
}

export interface AgentMemoryDto {
  id: string;
  userId: string;
  agentId?: string | null;
  memoryType: MemoryType;
  content: string;
  importanceScore: number; // 0 - 100
  contextKey: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  lastAccessedAt: string;
}

export interface CreateAgentMemoryDto {
  agentId?: string;
  memoryType: MemoryType;
  content: string;
  importanceScore?: number;
  contextKey: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectSprintDto {
  sprintNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  deliverables: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ProjectObjectiveDto {
  weekNumber: number;
  objective: string;
  keyResults: string[];
  completed: boolean;
}

export interface ProjectRoadmapDto {
  phase: string;
  estimatedWeeks: number;
  milestones: string[];
  dependencies: string[];
}

export interface AutonomousProjectDto {
  id: string;
  userId: string;
  title: string;
  description?: string;
  goal: string;
  status: 'planning' | 'active' | 'in_progress' | 'completed' | 'paused';
  roadmap: ProjectRoadmapDto[];
  sprintPlan: ProjectSprintDto[];
  weeklyObjectives: ProjectObjectiveDto[];
  resourceAllocation: {
    recommendedHoursPerWeek: number;
    primaryTools: string[];
    suggestedLibraries: string[];
  };
  riskFactors: string[];
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutonomousProjectDto {
  title: string;
  description?: string;
  goal: string;
  targetTimelineWeeks?: number;
  preferredTechStack?: string[];
}

export interface SwotAnalysisDto {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ResearchReportDto {
  id: string;
  userId: string;
  topic: string;
  category: string;
  executiveSummary: string;
  reportContent: string;
  swotAnalysis: SwotAnalysisDto;
  opportunityMatrix: {
    opportunity: string;
    impactScore: number; // 0 - 100
    feasibilityScore: number; // 0 - 100
    recommendation: string;
  }[];
  keyTrends: string[];
  recommendations: string[];
  sources: { title: string; url?: string; credibilityScore: number }[];
  createdAt: string;
}

export interface CreateResearchReportDto {
  topic: string;
  category?: string;
  depth?: 'brief' | 'standard' | 'comprehensive';
  focusAreas?: string[];
}

export interface KnowledgeNodeDto {
  id: string;
  userId: string;
  name: string;
  nodeType: KnowledgeNodeType;
  category: string;
  properties: Record<string, unknown>;
  confidenceScore: number;
  createdAt: string;
}

export interface KnowledgeEdgeDto {
  id: string;
  userId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: KnowledgeRelationType;
  weight: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface KnowledgeGraphDto {
  nodes: KnowledgeNodeDto[];
  edges: KnowledgeEdgeDto[];
  stats: {
    totalNodes: number;
    totalEdges: number;
    density: number;
    topConcepts: string[];
  };
}

export interface WorkspaceDocumentDto {
  id: string;
  userId: string;
  title: string;
  documentType: DocumentType;
  summary: string;
  extractedSkills: string[];
  extractedActions: string[];
  flashcards: { question: string; answer: string; tag: string }[];
  keyFindings: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateWorkspaceDocumentDto {
  title: string;
  documentType: DocumentType;
  rawTextContent: string;
  metadata?: Record<string, unknown>;
}

export interface DecisionOptionDto {
  optionId: string;
  title: string;
  pros: string[];
  cons: string[];
  alignmentScore: number; // 0 - 100
  projectedOutcome: string;
}

export interface ExecutiveDecisionDto {
  id: string;
  userId: string;
  decisionType: DecisionType;
  title: string;
  contextData: Record<string, unknown>;
  optionsEvaluated: DecisionOptionDto[];
  recommendedAction: string;
  riskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  expectedOutcomes: string[];
  createdAt: string;
}

export interface CreateExecutiveDecisionDto {
  decisionType: DecisionType;
  title: string;
  contextData?: Record<string, unknown>;
  options?: { title: string; description?: string }[];
}

export interface FocusMetricDto {
  focusScore: number; // 0 - 100
  deepWorkHours: number;
  distractionScore: number; // 0 - 100
  peakProductivityHours: string;
}

export interface AgentEffectivenessMetricDto {
  agentType: AgentType;
  tasksCompleted: number;
  hoursSaved: number;
  qualityScore: number; // 0 - 100
}

export interface ProductivityAnalyticsDto {
  id: string;
  userId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  periodDate: string;
  focusMetrics: FocusMetricDto;
  learningVelocity: number;
  careerGrowthVelocity: number;
  tasksCompleted: number;
  agentEffectivenessScore: number;
  agentBreakdown: AgentEffectivenessMetricDto[];
  recommendations: string[];
  createdAt: string;
}

export interface CommandCenterOverviewDto {
  activeAgentsCount: number;
  runningTasksCount: number;
  activeWorkflowsCount: number;
  productivityScore: number;
  todayPriorities: { id: string; title: string; priority: AgentTaskPriority; completed: boolean }[];
  aiRecommendations: string[];
  alerts: {
    careerAlerts: string[];
    learningAlerts: string[];
    hiringAlerts: string[];
  };
  recentActivities: { timestamp: string; message: string; type: string }[];
}

// ==========================================
// Phase 14: Agent Marketplace & Plugin Ecosystem DTOs
// ==========================================

export interface MarketplaceAgentDto {
  id: string;
  creatorId: string;
  creatorName?: string;
  creatorAvatar?: string | null;
  name: string;
  slug: string;
  description: string;
  category: MarketplaceCategory;
  verificationStatus: AgentVerificationStatus;
  pricingModel: PricingModel;
  priceCents: number;
  capabilities: string[];
  systemPrompt: string;
  configSchema: Record<string, unknown>;
  downloadCount: number;
  ratingAverage: number;
  ratingCount: number;
  isFeatured: boolean;
  isEnterpriseApproved: boolean;
  organizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketplaceAgentDto {
  name: string;
  slug?: string;
  description: string;
  category: MarketplaceCategory;
  pricingModel?: PricingModel;
  priceCents?: number;
  capabilities: string[];
  systemPrompt: string;
  configSchema?: Record<string, unknown>;
  organizationId?: string | null;
}

export interface UpdateMarketplaceAgentDto {
  name?: string;
  description?: string;
  category?: MarketplaceCategory;
  pricingModel?: PricingModel;
  priceCents?: number;
  capabilities?: string[];
  systemPrompt?: string;
  configSchema?: Record<string, unknown>;
  verificationStatus?: AgentVerificationStatus;
  isFeatured?: boolean;
  isEnterpriseApproved?: boolean;
}

export interface AgentReviewDto {
  id: string;
  agentId: string;
  userId: string;
  username?: string;
  userAvatar?: string | null;
  rating: number; // 1 - 5
  reviewText: string;
  isVerifiedBuyer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentReviewDto {
  agentId: string;
  rating: number;
  reviewText: string;
}

export interface AgentDownloadDto {
  id: string;
  agentId: string;
  userId: string;
  version: string;
  createdAt: string;
}

export interface PluginDto {
  id: string;
  creatorId: string;
  creatorName?: string;
  name: string;
  slug: string;
  description: string;
  pluginType: PluginType;
  requiredPermissions: PluginPermission[];
  repositoryUrl?: string | null;
  isVerified: boolean;
  downloadCount: number;
  ratingAverage: number;
  ratingCount: number;
  latestVersion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePluginDto {
  name: string;
  slug?: string;
  description: string;
  pluginType: PluginType;
  requiredPermissions: PluginPermission[];
  repositoryUrl?: string | null;
  initialVersion?: string;
}

export interface UpdatePluginDto {
  name?: string;
  description?: string;
  requiredPermissions?: PluginPermission[];
  repositoryUrl?: string | null;
  isVerified?: boolean;
}

export interface PluginVersionDto {
  id: string;
  pluginId: string;
  version: string;
  changelog: string;
  bundleUrl: string;
  permissions: PluginPermission[];
  status: 'active' | 'deprecated' | 'revoked';
  createdAt: string;
}

export interface CreatePluginVersionDto {
  pluginId: string;
  version: string;
  changelog: string;
  bundleUrl: string;
  permissions: PluginPermission[];
}

export interface PluginInstallDto {
  id: string;
  pluginId: string;
  plugin?: PluginDto;
  userId: string;
  organizationId?: string | null;
  installedVersion: string;
  isEnabled: boolean;
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InstallPluginDto {
  pluginId: string;
  organizationId?: string | null;
  configuration?: Record<string, unknown>;
}

export interface IntegrationDto {
  id: string;
  userId: string;
  organizationId?: string | null;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  config: Record<string, unknown>;
  lastSyncedAt: string | null;
  errorLog?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectIntegrationDto {
  provider: IntegrationProvider;
  credentials?: Record<string, unknown>;
  config?: Record<string, unknown>;
  organizationId?: string | null;
}

export interface SyncIntegrationResultDto {
  provider: IntegrationProvider;
  status: IntegrationStatus;
  itemsSynced: number;
  details: string;
  syncedAt: string;
}

export interface WorkflowTemplateDto {
  id: string;
  creatorId: string;
  creatorName?: string;
  title: string;
  slug: string;
  description: string;
  category: WorkflowCategory;
  triggerType: WorkflowTriggerType;
  steps: {
    stepId: string;
    stepNumber: number;
    agentType: AgentType;
    action: string;
    inputTemplate: string;
    dependencies: string[];
  }[];
  isEnterprise: boolean;
  ratingAverage: number;
  ratingCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowTemplateDto {
  title: string;
  slug?: string;
  description: string;
  category: WorkflowCategory;
  triggerType: WorkflowTriggerType;
  steps: {
    stepId: string;
    stepNumber: number;
    agentType: AgentType;
    action: string;
    inputTemplate: string;
    dependencies: string[];
  }[];
  isEnterprise?: boolean;
}

export interface DeveloperAppDto {
  id: string;
  userId: string;
  organizationId?: string | null;
  appName: string;
  description: string;
  appType: 'public' | 'confidential' | 'internal';
  redirectUris: string[];
  rateLimitTier: 'free' | 'growth' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeveloperAppDto {
  appName: string;
  description: string;
  appType?: 'public' | 'confidential' | 'internal';
  redirectUris?: string[];
  rateLimitTier?: 'free' | 'growth' | 'enterprise';
  organizationId?: string | null;
}

export interface ApiKeyDto {
  id: string;
  userId: string;
  organizationId?: string | null;
  developerAppId?: string | null;
  keyPrefix: string;
  name: string;
  permissions: string[];
  usageCount: number;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  rawKey?: string; // Only returned once on creation
}

export interface CreateApiKeyDto {
  name: string;
  developerAppId?: string | null;
  permissions?: string[];
  expiresInDays?: number;
  organizationId?: string | null;
}

export interface WebhookDto {
  id: string;
  userId: string;
  organizationId?: string | null;
  developerAppId?: string | null;
  targetUrl: string;
  subscribedEvents: WebhookEvent[];
  isActive: boolean;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
  secret?: string; // Only returned once on creation
}

export interface CreateWebhookDto {
  targetUrl: string;
  subscribedEvents: WebhookEvent[];
  developerAppId?: string | null;
  organizationId?: string | null;
}

export interface WebhookDeliveryDto {
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  statusCode: number;
  deliveredAt: string;
  success: boolean;
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  organizationId?: string | null;
  itemType: 'agent' | 'plugin' | 'platform_tier';
  itemId: string;
  tier: string;
  status: SubscriptionStatus;
  amountCents: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionDto {
  itemType: 'agent' | 'plugin' | 'platform_tier';
  itemId: string;
  tier?: string;
  amountCents?: number;
  organizationId?: string | null;
}

export interface TransactionDto {
  id: string;
  userId: string;
  organizationId?: string | null;
  transactionType: TransactionType;
  referenceId: string;
  amountCents: number;
  feeCents: number;
  netCents: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface CreatorPayoutDto {
  id: string;
  creatorId: string;
  amountCents: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  payoutMethod: string;
  processedAt: string | null;
  createdAt: string;
}

export interface CreatorAnalyticsDto {
  creatorId: string;
  totalAgentsPublished: number;
  totalPluginsPublished: number;
  totalWorkflowsPublished: number;
  totalDownloads: number;
  activeSubscribers: number;
  grossRevenueUsd: number;
  platformFeesUsd: number;
  netEarningsUsd: number;
  pendingPayoutUsd: number;
  monthlyRevenueHistory: { month: string; amountUsd: number; downloads: number }[];
  topPerformingItems: { id: string; title: string; type: string; downloads: number; revenueUsd: number; rating: number }[];
}

export interface MarketplaceOverviewDto {
  featuredAgents: MarketplaceAgentDto[];
  popularPlugins: PluginDto[];
  trendingWorkflows: WorkflowTemplateDto[];
  stats: {
    totalAgents: number;
    totalPlugins: number;
    totalWorkflows: number;
    totalInstalls: number;
    activeCreators: number;
  };
  categories: { category: MarketplaceCategory; count: number; icon: string }[];
}

export interface MarketplaceFilterParamsDto {
  category?: MarketplaceCategory;
  pricing?: PricingModel;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'newest' | 'price_low' | 'price_high';
}

// ==========================================
// PHASE 15: AI OPERATING SYSTEM DTOs
// ==========================================

// Module 1: Persistent Agent Cloud
export interface AgentInstanceDto {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  role: WorkforceAgentRole;
  state: AgentCloudState;
  systemPrompt: string;
  capabilities: string[];
  assignedTools: string[];
  isAlwaysOn: boolean;
  scheduleCron?: string | null;
  config: Record<string, any>;
  lastHeartbeatAt?: string | null;
  errorCount: number;
  totalRuns: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentInstanceDto {
  name: string;
  description: string;
  role: WorkforceAgentRole;
  systemPrompt: string;
  capabilities?: string[];
  assignedTools?: string[];
  isAlwaysOn?: boolean;
  scheduleCron?: string | null;
  config?: Record<string, any>;
}

export interface AgentRunDto {
  id: string;
  agentId: string;
  userId: string;
  state: AgentCloudState;
  inputPayload: Record<string, any>;
  outputPayload?: Record<string, any> | null;
  errorMessage?: string | null;
  executionTimeMs: number;
  tokensConsumed: number;
  startedAt: string;
  completedAt?: string | null;
}

export interface AgentCloudTaskDto {
  id: string;
  agentId: string;
  userId: string;
  title: string;
  priority: TaskOSPriority;
  status: TaskOSStatus;
  payload: Record<string, any>;
  result?: Record<string, any> | null;
  retryCount: number;
  maxRetries: number;
  deadline?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentScheduleDto {
  id: string;
  agentId: string;
  userId: string;
  cronExpression: string;
  isActive: boolean;
  lastExecutedAt?: string | null;
  nextExecutionAt?: string | null;
  createdAt: string;
}

export interface AgentHealthStatusDto {
  agentId: string;
  name: string;
  state: AgentCloudState;
  isHealthy: boolean;
  uptimeSeconds: number;
  lastHeartbeat: string;
  errorRate: number;
  activeRuns: number;
}

// Module 2: Distributed Workflow Engine
export interface WorkflowDefinitionDto {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description: string;
  workflowType: DistributedWorkflowType;
  version: number;
  isEnterprise: boolean;
  steps: {
    stepId: string;
    name: string;
    agentRole?: WorkforceAgentRole;
    actionType: string;
    dependsOn?: string[];
    condition?: string;
    retryLimit?: number;
    timeoutSeconds?: number;
    config?: Record<string, any>;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowDefinitionDto {
  title: string;
  description: string;
  workflowType: DistributedWorkflowType;
  isEnterprise?: boolean;
  steps: {
    stepId: string;
    name: string;
    agentRole?: WorkforceAgentRole;
    actionType: string;
    dependsOn?: string[];
    condition?: string;
    retryLimit?: number;
    timeoutSeconds?: number;
    config?: Record<string, any>;
  }[];
}

export interface WorkflowRunDto {
  id: string;
  workflowId: string;
  userId: string;
  status: WorkflowRunStatus;
  triggerEvent?: string | null;
  currentStepIndex: number;
  totalSteps: number;
  contextData: Record<string, any>;
  errorLog?: string | null;
  startedAt: string;
  completedAt?: string | null;
}

export interface DistributedWorkflowStepDto {
  id: string;
  workflowRunId: string;
  stepId: string;
  name: string;
  status: WorkflowStepStatus;
  inputPayload: Record<string, any>;
  outputPayload?: Record<string, any> | null;
  retryAttempts: number;
  durationMs: number;
  errorMessage?: string | null;
  executedAt: string;
}

export interface WorkflowEventDto {
  id: string;
  workflowRunId: string;
  eventType: string;
  payload: Record<string, any>;
  timestamp: string;
}

// Module 3: Event Bus & Automation Engine
export interface EventStreamDto {
  id: string;
  userId?: string | null;
  eventType: GlobalEventType;
  payload: Record<string, any>;
  source: string;
  timestamp: string;
}

export interface PublishEventDto {
  eventType: GlobalEventType;
  payload: Record<string, any>;
  source?: string;
}

export interface AutomationRuleDto {
  id: string;
  userId: string;
  name: string;
  description: string;
  triggerEvent: GlobalEventType;
  conditionExpression?: string | null;
  actionWorkflowId?: string | null;
  targetAgentId?: string | null;
  isActive: boolean;
  executionCount: number;
  lastTriggeredAt?: string | null;
  createdAt: string;
}

export interface CreateAutomationRuleDto {
  name: string;
  description: string;
  triggerEvent: GlobalEventType;
  conditionExpression?: string | null;
  actionWorkflowId?: string | null;
  targetAgentId?: string | null;
}

// Module 4: Execution Fabric
export interface ToolInvocationDto {
  toolName: string;
  agentId: string;
  userId: string;
  parameters: Record<string, any>;
  executionTimeoutMs?: number;
}

export interface ExecutionTaskDto {
  id: string;
  queueName: string;
  priority: number;
  payload: Record<string, any>;
  status: 'queued' | 'running' | 'completed' | 'failed';
  assignedNode?: string | null;
  enqueuedAt: string;
  processedAt?: string | null;
}

export interface ExecutionResourceQuotaDto {
  userId: string;
  maxConcurrentAgents: number;
  maxDailyRuns: number;
  maxMonthlyTokens: number;
  usedDailyRuns: number;
  usedMonthlyTokens: number;
  allocatedCpuPercent: number;
  allocatedMemoryMb: number;
}

// Module 5: Organizational AI Workforces
export interface WorkforceTeamAgentDto {
  id: string;
  teamId: string;
  agentId: string;
  role: WorkforceAgentRole;
  assignedWorkflows: string[];
  permissions: string[];
  createdAt: string;
}

export interface WorkforceOrgAgentDto {
  id: string;
  organizationId: string;
  agentId: string;
  department: string;
  role: WorkforceAgentRole;
  isEnterpriseShared: boolean;
  createdAt: string;
}

export interface WorkforceOptimizationReportDto {
  scopeId: string;
  totalAgents: number;
  activeAgents: number;
  workforceEfficiencyScore: number;
  agentRoleDistribution: { role: WorkforceAgentRole; count: number }[];
  bottlenecksIdentified: string[];
  recommendations: string[];
}

// Module 6: Task Operating System
export interface TaskGraphNodeDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskOSPriority;
  status: TaskOSStatus;
  estimatedHours: number;
  predictedDeadline?: string | null;
  assignedAgentId?: string | null;
  dependencies: string[];
  goalAlignmentScore: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskNodeDto {
  title: string;
  description: string;
  priority?: TaskOSPriority;
  estimatedHours?: number;
  assignedAgentId?: string | null;
  dependencies?: string[];
  tags?: string[];
}

export interface TaskGraphEdgeDto {
  fromNodeId: string;
  toNodeId: string;
  dependencyType: 'blocks' | 'relates_to' | 'enhances';
}

export interface TaskOSPlanDto {
  nodes: TaskGraphNodeDto[];
  edges: TaskGraphEdgeDto[];
  criticalPath: string[];
  totalEstimatedHours: number;
  completionRate: number;
  urgentDeadlines: TaskGraphNodeDto[];
}

// Module 7: Memory Fabric 2.0
export interface MemoryFabricRecordDto {
  id: string;
  userId: string;
  agentId?: string | null;
  memoryType: MemoryFabricType;
  key: string;
  content: string;
  vectorSummary?: string | null;
  importance: number;
  accessCount: number;
  metadata: Record<string, any>;
  lastAccessedAt: string;
  createdAt: string;
}

export interface StoreMemoryDto {
  agentId?: string | null;
  memoryType: MemoryFabricType;
  key: string;
  content: string;
  importance?: number;
  metadata?: Record<string, any>;
}

export interface SharedMemoryDto {
  id: string;
  scopeType: 'team' | 'organization' | 'global';
  scopeId: string;
  memoryKey: string;
  memoryValue: string;
  contributors: string[];
  updatedAt: string;
}

export interface SemanticQueryDto {
  query: string;
  memoryType?: MemoryFabricType;
  topK?: number;
}

// Module 8: Knowledge Fabric
export interface KnowledgeFabricEntityDto {
  id: string;
  domain: KnowledgeGraphDomain;
  name: string;
  entityType: string;
  description: string;
  properties: Record<string, any>;
  centralityScore: number;
  createdAt: string;
}

export interface KnowledgeFabricEdgeDto {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string;
  weight: number;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface KnowledgeDiscoveryDto {
  domain: KnowledgeGraphDomain;
  entities: KnowledgeFabricEntityDto[];
  edges: KnowledgeFabricEdgeDto[];
  density: number;
  discoveredConcepts: string[];
  recommendedPaths: { from: string; to: string; relationChain: string[] }[];
}

export interface KnowledgeGapDto {
  domain: KnowledgeGraphDomain;
  missingSkillOrConcept: string;
  suggestedAction: string;
  impactScore: number;
}

// Module 9: AI Decision Center
export interface DecisionRecordDto {
  id: string;
  userId: string;
  title: string;
  context: string;
  status: DecisionCenterStatus;
  options: {
    optionId: string;
    title: string;
    description: string;
    riskScore: number;
    successProbability: number;
    pros: string[];
    cons: string[];
  }[];
  recommendedOptionId?: string | null;
  confidenceScore: number;
  strategicRoadmap: { phase: string; actions: string[]; timeframe: string }[];
  executedOptionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDecisionDto {
  title: string;
  context: string;
  options: {
    title: string;
    description: string;
    pros?: string[];
    cons?: string[];
  }[];
}

export interface ScenarioSimulationDto {
  decisionId: string;
  scenarioName: string;
  simulatedOutcomes: {
    metric: string;
    expectedChangePercent: number;
    confidenceInterval: [number, number];
  }[];
  riskAssessment: string;
}

// Module 10: Real-Time Collaboration Platform
export interface CollaborativeWorkspaceDto {
  id: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  activeAgentIds: string[];
  livePresence: PresenceUserDto[];
  sharedNotes: SharedNoteDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PresenceUserDto {
  userId: string;
  username: string;
  currentView: string;
  lastActiveAt: string;
}

export interface SharedNoteDto {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

// Module 11: AI Observability & Telemetry
export interface TelemetryMetricDto {
  id: string;
  userId?: string | null;
  agentId?: string | null;
  metricType: TelemetryMetricType;
  value: number;
  unit: string;
  tags: Record<string, string>;
  recordedAt: string;
}

export interface AgentHealthMetricDto {
  agentId: string;
  name: string;
  avgLatencyMs: number;
  errorRate: number;
  successRate: number;
  totalTokensConsumed: number;
  totalCostUsd: number;
}

export interface CostBreakdownDto {
  totalCostUsd: number;
  agentExecutionCostUsd: number;
  toolInvocationCostUsd: number;
  storageAndMemoryCostUsd: number;
  byAgent: { agentId: string; name: string; costUsd: number }[];
}

export interface TelemetryDashboardDto {
  totalAgentsOnline: number;
  totalWorkflowRuns24h: number;
  averageExecutionLatencyMs: number;
  totalTokensConsumed24h: number;
  totalCost24hUsd: number;
  systemErrorRatePercent: number;
  agentMetrics: AgentHealthMetricDto[];
  costBreakdown: CostBreakdownDto;
}

// Module 12: Governance, Security & Compliance
export interface AgentGovernancePermissionDto {
  id: string;
  agentId: string;
  grantedToUserId?: string | null;
  grantedToOrgId?: string | null;
  canExecute: boolean;
  canModifyPrompt: boolean;
  canAccessMemory: boolean;
  canInvokeTools: boolean;
  createdAt: string;
}

export interface AgentAuditLogDto {
  id: string;
  agentId: string;
  actorUserId: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string | null;
  timestamp: string;
}

export interface ComplianceReportDto {
  auditPeriod: string;
  totalEventsAudited: number;
  isolatedTenantsCount: number;
  securityViolationsCount: number;
  policyViolations: { rule: string; severity: 'low' | 'medium' | 'high'; timestamp: string }[];
  complianceScorePercent: number;
}

// ==========================================
// PHASE 16: GLOBAL AI ECOSYSTEM DTOs
// ==========================================

// Module 1: Global AI Network
export interface GlobalNetworkNodeDto {
  id: string;
  entityId: string;
  nodeType: GlobalNodeType;
  label: string;
  score: number;
  metadata: Record<string, any>;
  tenantId?: string | null;
  createdAt: string;
}

export interface GlobalNetworkEdgeDto {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  edgeType: GlobalEdgeType;
  weight: number;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface GlobalGraphDto {
  nodes: GlobalNetworkNodeDto[];
  edges: GlobalNetworkEdgeDto[];
}

export interface GlobalNetworkRecommendationDto {
  targetNodeId: string;
  label: string;
  nodeType: GlobalNodeType;
  relevanceScore: number;
  reason: string;
  commonConnectionsCount: number;
}

export interface GlobalRankingDto {
  rank: number;
  entityId: string;
  label: string;
  nodeType: GlobalNodeType;
  ecosystemScore: number;
  percentile: number;
}

// Module 2: Collective Intelligence Engine
export interface CollectiveConsensusDto {
  id: string;
  topic: string;
  consensusScore: number;
  agreementPercentage: number;
  sampleSize: number;
  verifiedByExpertsCount: number;
  synthesizedInsight: string;
  bestPractices: string[];
  keyTakeaways: string[];
  generatedAt: string;
}

export interface CrowdKnowledgeSubmissionDto {
  topic: string;
  insight: string;
  sourceEntityType?: string;
  confidenceRating?: number;
  tags?: string[];
}

export interface TrendSignalDto {
  trendName: string;
  category: TrendCategory;
  momentumScore: number;
  growthRatePercent: number;
  demandScore: number;
  occurrences: number;
}

// Module 3: Autonomous Enterprise Platform
export interface AutonomousDepartmentDto {
  id: string;
  orgId: string;
  name: string;
  headAgentId?: string | null;
  activeTeamCount: number;
  activeProjectCount: number;
  budgetAllocatedUsd: number;
  budgetSpentUsd: number;
  efficiencyScore: number;
  automatedWorkflowsCount: number;
}

export interface AutonomousEnterpriseProjectDto {
  id: string;
  departmentId: string;
  title: string;
  objective: string;
  status: string;
  priority: string;
  estimatedDurationDays: number;
  progressPercent: number;
  assignedAgentIds: string[];
  allocatedResources: Record<string, any>;
}

export interface AutonomousOptimizationReportDto {
  orgId: string;
  departmentId?: string;
  efficiencyGainPercent: number;
  resourceReallocations: { resource: string; from: string; to: string; rationale: string }[];
  recommendedAutomations: string[];
}

// Module 4: Global Talent Cloud
export interface TalentProfileDto {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  bio: string;
  hourlyRateUsd: number;
  availabilityStatus: string;
  globalRank: number;
  verifiedSkillsCount: number;
  reputationScore: number;
  reputationTier: ReputationTier;
  portfolioScore: number;
  location: string;
  createdAt: string;
}

export interface VerifiedSkillDto {
  id: string;
  talentProfileId: string;
  skillName: string;
  proficiencyLevel: string;
  score: number;
  status: VerificationStatus;
  verifiedAt?: string | null;
  verifierBadge?: string | null;
}

export interface SkillVerificationRequestDto {
  skillName: string;
  evidenceLinks: string[];
  assessmentScore?: number;
}

export interface TalentMatchScoreDto {
  talent: TalentProfileDto;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  fitSummary: string;
}

// Module 5: AI Entrepreneurship Platform
export interface StartupProfileDto {
  id: string;
  founderUserId: string;
  name: string;
  tagline: string;
  description: string;
  stage: VentureStage;
  industry: string;
  targetMarket: string;
  businessModel: string;
  fundingGoalUsd: number;
  raisedAmountUsd: number;
  teamMemberUserIds: string[];
  marketValidationScore: number;
  createdAt: string;
}

export interface FounderMatchDto {
  id: string;
  startupId: string;
  matchedUserId: string;
  matchScore: number;
  complementarySkills: string[];
  roleFit: string;
  status: string;
}

export interface VentureIntelligenceReportDto {
  startupId: string;
  marketViabilityScore: number;
  competitionRiskScore: number;
  growthTrajectory: string;
  strategicRoadmapSteps: string[];
  unitEconomicsModel: { cacUsd: number; ltvUsd: number; grossMarginPercent: number };
}

// Module 6: Global Research Network
export interface ResearchPublicationDto {
  id: string;
  authorUserId: string;
  orgId?: string | null;
  title: string;
  abstract: string;
  domain: string;
  status: PublicationStatus;
  peerReviewScore: number;
  citationsCount: number;
  downloadCount: number;
  fullTextUrl?: string | null;
  publishedAt: string;
}

export interface ResearchCitationDto {
  id: string;
  sourcePublicationId: string;
  targetPublicationId: string;
  contextSnippet: string;
  citationWeight: number;
  createdAt: string;
}

export interface ResearchTrendDto {
  domain: string;
  breakthroughTopics: string[];
  publicationGrowthPercent: number;
  citationVelocity?: number;
  topCitingLabs: string[];
}

// Module 7: Digital Twin Ecosystem
export interface DigitalTwinDto {
  id: string;
  entityId: string;
  twinType: DigitalTwinType;
  name: string;
  stateSnapshot: Record<string, any>;
  behavioralModel: Record<string, any>;
  accuracyRating: number;
  lastSimulatedAt?: string | null;
  createdAt: string;
}

export interface SimulationScenarioDto {
  twinId: string;
  scenarioTitle: string;
  inputParameters: Record<string, any>;
  simulatedOutcomes: { milestone: string; probability: number; expectedImpact: string }[];
  riskScore: number;
  confidenceInterval: { min: number; max: number };
}

// Module 8: AI Economy & Token System
export interface EcosystemReputationDto {
  userId: string;
  score: number;
  tier: ReputationTier;
  totalContributions: number;
  upvotesReceived: number;
  skillCreditsBalance: number;
  badgesEarned: string[];
  rankPercentile: number;
}

export interface EcosystemRewardDto {
  id: string;
  userId: string;
  rewardType: string;
  skillCreditsAwarded: number;
  reason: string;
  transactionReference: string;
  awardedAt: string;
}

// Module 9: Self-Improving AI Ecosystem
export interface EcosystemLearningMetricDto {
  moduleName: string;
  baselinePerformance: number;
  currentPerformance: number;
  optimizationGenerations: number;
  selfTunedPromptVersion: string;
  lastImprovedAt: string;
}

export interface WorkflowOptimizationRecommendationDto {
  workflowId: string;
  currentStepCount: number;
  optimizedStepCount: number;
  estimatedSpeedupPercent: number;
  recommendedRefactor: string;
}

// Module 10: Global Command Center & Executive Superintelligence
export interface GlobalCommandCenterOverviewDto {
  totalNetworkNodes: number;
  activeAutonomousAgents: number;
  liveWorkflowsCount: number;
  globalTalentRegistered: number;
  activeEnterprises: number;
  publishedResearchCount: number;
  ventureStartupsCount: number;
  ecosystemConsensusTopicsCount: number;
  networkHealthScore: number;
  trends: TrendSignalDto[];
}

export interface SuperintelligenceInsightDto {
  id: string;
  scope: SuperintelligenceScope;
  title: string;
  executiveSummary: string;
  opportunityScore: number;
  riskScore: number;
  confidenceScore: number;
  strategicActions: { step: number; action: string; priority: string }[];
  projectedEcosystemImpact: string;
  generatedAt: string;
}

// ==========================================
// PHASE 17: PLANETARY INTELLIGENCE INFRASTRUCTURE DTOs
// ==========================================

// Module 1: Planetary Intelligence Network
export interface PlanetaryClusterNodeDto {
  id: string;
  clusterName: string;
  region: string;
  activeAgentsCount: number;
  workforceCount: number;
  knowledgeNodeCount: number;
  syncLatencyMs: number;
  status: string;
  lastHeartbeat: string;
}

export interface PlanetaryCollaborationMeshDto {
  meshId: string;
  primaryClusterId: string;
  federatedClusterIds: string[];
  totalBandwidthThroughputGbps: number;
  activeSharedMemories: number;
  federatedConsensusScore: number;
}

// Module 2: Digital Civilization Engine
export interface CivilizationMetricsDto {
  id: string;
  civilizationHealthScore: number;
  healthTier: CivilizationHealthTier;
  innovationIndex: number;
  knowledgeGrowthIndex: number;
  economicActivityIndex: number;
  workforceReadinessIndex: number;
  researchProductivityIndex: number;
  recordedAt: string;
}

export interface CivilizationOpportunityDto {
  id: string;
  domain: InnovationDomain;
  title: string;
  description: string;
  projectedGdpImpactScore: number;
  feasibilityScore: number;
  readinessTimeMonths: number;
}

export interface CivilizationRiskDto {
  id: string;
  riskName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy: string;
  probability: number;
}

export interface CivilizationReportDto {
  id: string;
  title: string;
  summary: string;
  metrics: CivilizationMetricsDto;
  growthForecasts: { sector: string; projectedGrowthPercent: number }[];
  opportunityMap: CivilizationOpportunityDto[];
  riskMap: CivilizationRiskDto[];
  generatedAt: string;
}

// Module 3: Autonomous Governance Platform
export interface GovernancePolicyDto {
  id: string;
  title: string;
  councilType: GovernanceCouncilType;
  description: string;
  rules: string[];
  status: PolicyStatus;
  enactedBy: string;
  complianceScore: number;
  ethicalReviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicySimulationDto {
  id: string;
  policyId: string;
  simulationName: string;
  complianceProjectedPercent: number;
  economicFrictionScore: number;
  ethicalAlignmentScore: number;
  stakeholderImpacts: { stakeholder: string; impactScore: number; sentiment: string }[];
  forecastedOutcome: string;
  simulatedAt: string;
}

// Module 4: Planetary Digital Twins
export interface PlanetaryTwinDto {
  id: string;
  twinType: PlanetaryTwinType;
  entityName: string;
  stateSnapshot: Record<string, any>;
  fidelityScore: number;
  lastSimulatedAt?: string;
  syncFrequencySeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanetarySimulationDto {
  id: string;
  twinId: string;
  scenarioName: string;
  horizonDays: number;
  parameters: Record<string, any>;
  projectedOutcomes: { milestone: string; probability: number; impact: string }[];
  monteCarloConfidence: number;
  optimizedInterventions: string[];
  simulatedAt: string;
}

// Module 5: Global Innovation Network
export interface InnovationRecordDto {
  id: string;
  title: string;
  domain: InnovationDomain;
  inventorOrganizationId: string;
  patentStatus: 'filed' | 'approved' | 'commercialized' | 'open_source';
  commercialReadinessScore: number;
  adoptionForecastPercent: number;
  technologyMaturityLevel: number;
  createdAt: string;
}

export interface InnovationRankingDto {
  domain: InnovationDomain;
  topInnovations: InnovationRecordDto[];
  velocityScore: number;
  leadingRegion: string;
}

// Module 6: AI Research Civilization
export interface ResearchFederationDto {
  id: string;
  federationName: string;
  leadInstitutionId: string;
  memberInstitutionIds: string[];
  focusArea: string;
  activeCollaborationsCount: number;
  sharedDatasetsCount: number;
  status: string;
  createdAt: string;
}

export interface ResearchCollaborationDto {
  id: string;
  federationId: string;
  title: string;
  principalInvestigator: string;
  milestones: { title: string; completed: boolean }[];
  impactScore: number;
  validationProof: string;
  createdAt: string;
}

// Module 7: Global Economic Intelligence
export interface EconomicSignalDto {
  id: string;
  signalType: EconomicSignalType;
  sector: string;
  intensityScore: number;
  region: string;
  metadata: Record<string, any>;
  detectedAt: string;
}

export interface EconomicForecastDto {
  id: string;
  horizonMonths: number;
  talentDemandGrowth: number;
  skillPremiumTrends: { skill: string; changePercent: number }[];
  macroEconomicHealthScore: number;
  forecastSummary: string;
  createdAt: string;
}

// Module 8: Autonomous Agent Federation
export interface AgentFederationDto {
  id: string;
  federationName: string;
  organizationId: string;
  protocol: FederationProtocol;
  status: AgentFederationStatus;
  participatingAgentCount: number;
  totalNegotiationsHandled: number;
  cooperationIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentFederationReputationDto {
  agentId: string;
  federationId: string;
  trustScore: number;
  successfulDelegations: number;
  disputeRate: number;
  reputationBadge: string;
}

export interface AgentDelegationPlanDto {
  planId: string;
  sourceFederationId: string;
  targetFederationId: string;
  taskPayload: Record<string, any>;
  negotiatedBountyCredits: number;
  slaTimeoutSeconds: number;
  status: 'negotiating' | 'accepted' | 'executing' | 'completed' | 'rejected';
}

// Module 9: Strategic Foresight Engine
export interface StrategicForecastDto {
  id: string;
  horizon: ForesightHorizon;
  domain: InnovationDomain;
  title: string;
  forecastNarrative: string;
  opportunityRank: number;
  riskRank: number;
  confidenceScore: number;
  recommendedPlaybook: string[];
  createdAt: string;
}

// Module 10: Planetary Command Center
export interface PlanetaryCommandCenterOverviewDto {
  civilizationMetrics: CivilizationMetricsDto;
  activePlanetaryTwinsCount: number;
  activeFederationsCount: number;
  activeResearchCollaborationsCount: number;
  activeGovernancePoliciesCount: number;
  liveEconomicSignalsCount: number;
  topOpportunities: CivilizationOpportunityDto[];
  systemicRisks: CivilizationRiskDto[];
  strategicForecastsCount: number;
}

// ============================================================================
// PHASE 18: AUTONOMOUS SUPERINTELLIGENCE CORE & COGNITIVE OPERATING SYSTEM
// ============================================================================

// Module 1: Cognitive Core & Reasoning Engine
export interface CognitiveGoalDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: CognitiveGoalStatus;
  priority: StrategicPriority;
  targetHorizon: PredictionHorizon;
  completionScore: number;
  subgoalsCount: number;
  activeTracesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CognitiveSubgoalDto {
  id: string;
  goalId: string;
  title: string;
  description: string;
  sequenceOrder: number;
  status: CognitiveGoalStatus;
  estimatedComplexity: number;
  assignedAgentId?: string;
  createdAt: string;
}

export interface ReasoningTraceDto {
  id: string;
  goalId?: string;
  strategy: ReasoningStrategy;
  inputPrompt: string;
  hypothesisTree: Array<{ step: number; thought: string; confidence: number; branchingFactor?: number }>;
  synthesis: string;
  confidenceScore: number;
  biasAudits: string[];
  executionTimeMs: number;
  createdAt: string;
}

export interface MetacognitiveEvaluationDto {
  id: string;
  traceId: string;
  confidenceTier: MetacognitionConfidence;
  epistemicUncertainty: number;
  heuristicBiasesIdentified: string[];
  suggestedMitigations: string[];
  calibrationScore: number;
  createdAt: string;
}

export interface SelfReflectionReportDto {
  id: string;
  entityType: 'agent' | 'user' | 'workflow' | 'council';
  entityId: string;
  observations: string[];
  identifiedStrengths: string[];
  identifiedDeficiencies: string[];
  lessonsLearned: string[];
  actionableAdjustments: string[];
  impactScore: number;
  createdAt: string;
}

// Module 2: Autonomous Learning & Self-Improvement
export interface LearningEvolutionRecordDto {
  id: string;
  domain: SelfImprovementDomain;
  targetEntityId: string;
  preAdaptationPerformance: number;
  postAdaptationPerformance: number;
  performanceDelta: number;
  reinforcementIterations: number;
  adaptationSummary: string;
  appliedAt: string;
}

export interface SelfImprovementRecordDto {
  id: string;
  domain: SelfImprovementDomain;
  componentName: string;
  optimizationType: string;
  improvementScore: number;
  accuracyDelta: number;
  latencyReductionPercent: number;
  status: 'applied' | 'testing' | 'rolled_back';
  createdAt: string;
}

// Module 3: Memory Evolution System
export interface MemoryRecordDto {
  id: string;
  userId: string;
  memoryType: CognitiveMemoryType;
  conceptKey: string;
  content: string;
  contextSummary: string;
  importanceWeight: number;
  accessCount: number;
  decayRate: number;
  lastRecalledAt: string;
  createdAt: string;
}

export interface MemoryConsolidationReportDto {
  id: string;
  userId: string;
  consolidatedCount: number;
  forgottenCount: number;
  synthesizedConcepts: string[];
  compressionRatio: number;
  knowledgeCoherenceScore: number;
  createdAt: string;
}

// Module 4: Multi-Agent Collaborative Councils
export interface AgentCouncilDto {
  id: string;
  councilType: AgentCouncilType;
  councilName: string;
  leadAgentId: string;
  participatingAgentIds: string[];
  activeDebatesCount: number;
  consensusRatio: number;
  charterStatement: string;
  createdAt: string;
}

export interface CouncilDebateDto {
  id: string;
  councilId: string;
  topic: string;
  status: ConsensusStatus;
  perspectives: Array<{ agentId: string; role: string; argument: string; confidence: number }>;
  contradictionsDetected: string[];
  convergedSynthesis?: string;
  consensusScore?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface CouncilVoteDto {
  id: string;
  debateId: string;
  agentId: string;
  voteOption: string;
  rationale: string;
  weight: number;
  createdAt: string;
}

// Module 5: Autonomous Execution Fabric
export interface ExecutionLoopRecordDto {
  id: string;
  goalId: string;
  currentState: ExecutionLoopState;
  iteration: number;
  maxIterations: number;
  observations: string[];
  reflectionSummary?: string;
  appliedImprovements?: string[];
  hasSucceeded: boolean;
  durationMs: number;
  createdAt: string;
}

// Module 6: Predictive Intelligence Engine
export interface PredictiveForecastDto {
  id: string;
  targetScope: 'user' | 'project' | 'organization' | 'planetary';
  targetId: string;
  horizon: PredictionHorizon;
  successProbability: number;
  expectedOutcomes: Array<{ metric: string; projectedValue: number; unit: string; trend: 'up' | 'down' | 'stable' }>;
  riskFactors: string[];
  predictiveConfidence: number;
  actionableRecommendations: string[];
  createdAt: string;
}

// Module 7: Personal Digital Brain
export interface DigitalBrainProfileDto {
  id: string;
  userId: string;
  totalMemoriesCount: number;
  knowledgeNodesCount: number;
  cognitiveEfficiencyScore: number;
  dominantThinkingPatterns: string[];
  recentSyntheses: string[];
  activeGoalsSummary: string[];
  updatedAt: string;
}

export interface KnowledgeGraphNodeDto {
  id: string;
  brainId: string;
  label: string;
  nodeType: string;
  properties: Record<string, any>;
  connectedEdgeCount: number;
}

// Module 8: AI Strategy Engine
export interface StrategicPlanDto {
  id: string;
  scope: string;
  priority: StrategicPriority;
  horizon: PredictionHorizon;
  title: string;
  strategicNarrative: string;
  resourceAllocationMap: Record<string, number>;
  milestones: Array<{ title: string; targetQuarter: string; expectedOutcome: string }>;
  riskAssessments: Array<{ risk: string; severity: 'low' | 'medium' | 'high' | 'critical'; mitigation: string }>;
  expectedRoiScore: number;
  createdAt: string;
}

// Module 9: Executive Command Center 2.0 Overview
export interface ExecutiveCommandCenterOverviewDto {
  cognitiveHealthScore: number;
  metacognitiveEfficiency: number;
  activeGoalsCount: number;
  totalMemoriesSynthesized: number;
  activeCouncilDebatesCount: number;
  activeExecutionLoopsCount: number;
  predictiveForesightAccuracy: number;
  selfImprovementVelocity: number;
  topStrategicOpportunities: Array<{ title: string; priority: StrategicPriority; potentialImpact: number }>;
  recentSelfReflections: SelfReflectionReportDto[];
}

// ============================================================================
// PHASE 19: AUTONOMOUS ENTERPRISE CIVILIZATION & AI WORKFORCE OPERATING SYSTEM
// ============================================================================

// Module 1: AI Organization Engine
export interface OrganizationCivilizationDto {
  id: string;
  creatorUserId: string;
  name: string;
  slug: string;
  organizationType: OrganizationCivilizationType;
  missionStatement: string;
  headquartersRegion: string;
  autonomousOperatingStatus: string;
  totalDepartmentsCount: number;
  totalWorkforceHeadcount: number;
  organizationalEfficiencyScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CivilizationDepartmentDto {
  id: string;
  organizationId: string;
  name: string;
  charter: string;
  leadEmployeeId?: string;
  allocatedBudgetTokens: number;
  efficiencyRating: number;
  teamsCount: number;
  createdAt: string;
}

export interface CivilizationTeamDto {
  id: string;
  departmentId: string;
  organizationId: string;
  name: string;
  focusArea: string;
  leadEmployeeId?: string;
  memberCount: number;
  activeProjectsCount: number;
  createdAt: string;
}

export interface WorkforcePlanningDto {
  organizationId: string;
  currentHeadcount: number;
  optimalHeadcount: number;
  capacityUtilizationScore: number;
  criticalSkillGaps: string[];
  recommendedAllocations: Array<{ departmentName: string; suggestedHires: number; roleType: DigitalEmployeeRole }>;
}

// Module 2: Digital Employee System
export interface DigitalEmployeeDto {
  id: string;
  organizationId: string;
  departmentId?: string;
  teamId?: string;
  name: string;
  role: DigitalEmployeeRole;
  status: EmployeeEmploymentStatus;
  seniorityTier: string;
  capabilities: string[];
  primarySpecialization: string;
  activeAssignedTaskId?: string;
  completedTasksCount: number;
  velocityScore: number;
  accuracyScore: number;
  collaborationIndex: number;
  createdAt: string;
}

// Module 3: Autonomous Company Builder
export interface CompanyBlueprintDto {
  id: string;
  creatorUserId: string;
  companyName: string;
  tagline: string;
  stage: CompanyStage;
  targetMarket: string;
  valueProposition: string;
  businessModelCanvas: {
    keyPartners: string[];
    keyActivities: string[];
    valuePropositions: string[];
    customerRelationships: string[];
    customerSegments: string[];
    costStructure: string[];
    revenueStreams: string[];
  };
  projectedAnnualRunRateUsd: number;
  breakEvenTimelineMonths: number;
  readinessTier: InvestmentReadinessTier;
  createdAt: string;
}

// Module 4: Multi-Enterprise Coordination & Federation
export interface EnterpriseFederationDto {
  id: string;
  initiatorOrgId: string;
  partnerOrgId: string;
  federationType: EnterpriseFederationType;
  treatyTitle: string;
  sharedResourcesDescription: string;
  governanceTerms: string;
  activeStatus: boolean;
  jointProjectsCount: number;
  createdAt: string;
}

// Module 5: Autonomous Product Factory
export interface ProductPortfolioDto {
  id: string;
  organizationId: string;
  productName: string;
  lifecycleStage: ProductLifecycleStage;
  targetPersona: string;
  coreDifferentiator: string;
  monthlyActiveUsersEstimate: number;
  productHealthScore: number;
  featuresRoadmap: Array<{ title: string; releaseTarget: string; status: string }>;
  createdAt: string;
}

// Module 6: Economic Simulation Engine
export interface EconomicSimulationDto {
  id: string;
  organizationId?: string;
  scenario: EconomicSimulationScenario;
  inflationPressureIndex: number;
  talentMarketTightnessIndex: number;
  liquidityAvailabilityIndex: number;
  projectedMarketGrowthRate: number;
  simulatedShockImpactSummary: string;
  stressTestScore: number;
  createdAt: string;
}

// Module 7: Capital & Investment Intelligence
export interface InvestmentRecordDto {
  id: string;
  companyBlueprintId: string;
  fundingRound: string;
  targetAmountUsd: number;
  committedAmountUsd: number;
  preMoneyValuationUsd: number;
  leadInvestorEntity: string;
  investorPitchDeckSummary: string;
  readinessTier: InvestmentReadinessTier;
  createdAt: string;
}

// Module 8: Autonomous Execution Network
export interface ExecutionNetworkTaskDto {
  id: string;
  organizationId: string;
  projectId?: string;
  taskTitle: string;
  assignedEmployeeId?: string;
  priority: ExecutionNetworkTaskPriority;
  status: ExecutionNetworkTaskStatus;
  dependencyTaskIds: string[];
  payloadSpec: Record<string, any>;
  verificationProofHash?: string;
  executionDurationMs?: number;
  retryCount: number;
  createdAt: string;
}

// Module 9: Enterprise Command Center Dashboard Overview
export interface EnterpriseCommandCenterOverviewDto {
  totalActiveOrganizations: number;
  totalDigitalWorkforceHeadcount: number;
  averageOrganizationalEfficiency: number;
  activeProductPortfoliosCount: number;
  totalCapitalCommittedUsd: number;
  activeFederationsCount: number;
  networkTasksExecutionRate: number;
  workforceHealthMetrics: {
    utilizationRate: number;
    velocityAverage: number;
    accuracyAverage: number;
    benchCount: number;
  };
  topEnterprises: OrganizationCivilizationDto[];
  recentCompanyBlueprints: CompanyBlueprintDto[];
}

// ============================================================================
// PHASE 20: AUTONOMOUS STARTUP BUILDER & VENTURE CREATION PLATFORM
// ============================================================================

// Module 1: Autonomous Startup Generator
export interface StartupDto {
  id: string;
  creatorUserId: string;
  name: string;
  slug: string;
  tagline: string;
  category: StartupCategory;
  stage: StartupStage;
  problemStatement: string;
  solutionDescription: string;
  targetMarket: string;
  viabilityScore: number;
  innovationScore: number;
  readinessScore: number;
  businessPlanSummary: string;
  currentFundingStage: StartupFundingStage;
  totalRaisedUsd: number;
  valuationUsd: number;
  monthlyBurnRateUsd: number;
  runwayMonths: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStartupDto {
  name: string;
  tagline?: string;
  category?: StartupCategory;
  stage?: StartupStage;
  problemStatement?: string;
  solutionDescription?: string;
  targetMarket?: string;
  businessPlanSummary?: string;
  valuationUsd?: number;
  totalRaisedUsd?: number;
}

export interface StartupIdeaDto {
  id: string;
  creatorUserId?: string;
  title: string;
  category: StartupCategory;
  problemStatement: string;
  proposedSolution: string;
  marketOpportunity: string;
  differentiationMoat: string;
  viabilityScore: number;
  marketSizeEstimate: string;
  competitors: string[];
  suggestedMonetization: string[];
  leanCanvasKeywords?: string[];
  createdAt: string;
}

export interface GenerateStartupIdeaDto {
  category: StartupCategory;
  domainKeywords?: string[];
  targetAudience?: string;
}

// Module 2: Market Intelligence Engine
export interface MarketReportDto {
  id: string;
  startupId?: string;
  sector: StartupCategory;
  tamUsd: number;
  samUsd: number;
  somUsd: number;
  cagrPercent: number;
  marketTrends: string[];
  competitiveLandscape: Array<{ competitorName: string; marketSharePercent: number; strengths: string[]; weaknesses: string[] }>;
  opportunityGaps: string[];
  riskLevel: MarketRiskLevel;
  confidenceScore: number;
  createdAt: string;
}

export interface GenerateMarketReportDto {
  sector: StartupCategory;
  startupId?: string;
  targetGeography?: string;
}

// Module 3: AI Founder Operating System
export interface AIFounderDecisionDto {
  id: string;
  startupId: string;
  decisionTitle: string;
  context: string;
  simulatedScenarios: Array<{ option: string; riskFactor: number; projectedImpactScore: number; outcomeNarrative: string }>;
  recommendedOption: string;
  strategicRationale: string;
  confidenceScore: number;
  createdAt: string;
}

export interface StrategicPlanReportDto {
  startupId: string;
  visionStatement: string;
  topPriorities: Array<{ priorityTitle: string; horizonMonths: number; ownerRole: string; impactWeight: number }>;
  resourceAllocations: Record<string, number>;
  riskMitigationMatrix: Array<{ risk: string; severity: MarketRiskLevel; mitigationStrategy: string }>;
  createdAt: string;
}

// Module 4: Product Incubation Engine
export interface ProductIncubationDto {
  id: string;
  startupId: string;
  productName: string;
  phase: IncubationPhase;
  conceptSummary: string;
  mvpFeatureSet: Array<{ featureName: string; priority: 'must_have' | 'should_have' | 'nice_to_have'; complexity: 'low' | 'medium' | 'high'; status: string }>;
  validationMetrics: {
    userInterviewsConducted: number;
    prototypeTestCount: number;
    earlyAccessSignups: number;
  };
  productMarketFitScore: number;
  retentionEstimatePercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductIncubationDto {
  startupId: string;
  productName: string;
  phase?: IncubationPhase;
  conceptSummary?: string;
  mvpFeatureSet?: Array<{ featureName: string; priority: 'must_have' | 'should_have' | 'nice_to_have'; complexity: 'low' | 'medium' | 'high'; status: string }>;
}

// Module 5: Customer Discovery System
export interface CustomerPersonaDto {
  id: string;
  startupId?: string;
  personaType: CustomerPersonaType;
  title: string;
  demographics: { roleTitle: string; companySize: string; budgetAuthorityUsd: number };
  painPoints: string[];
  buyingMotivations: string[];
  willingnessToPayMonthlyUsd: number;
  userJourneyStages: Array<{ stage: string; touchpoint: string; frictionPoint: string; delightMoment: string }>;
  createdAt: string;
}

export interface CustomerValidationReportDto {
  startupId: string;
  totalInterviewsAnalyzed: number;
  problemResonanceScore: number;
  willingnessToBuyPercent: number;
  topRequestedFeatures: string[];
  demandProjectionScore: number;
}

// Module 6: Growth Engine
export interface GrowthForecastDto {
  id: string;
  startupId: string;
  primaryChannel: GrowthChannel;
  monthlyActiveUsersForecast: Array<{ month: number; mau: number }>;
  customerAcquisitionCostUsd: number;
  customerLifetimeValueUsd: number;
  ltvCacRatio: number;
  monthlyChurnPercent: number;
  monthlyRevenueForecastUsd: Array<{ month: number; mrr: number }>;
  viralCoefficient: number;
  overallGrowthScore: number;
  createdAt: string;
}

// Module 7: Venture Portfolio Management
export interface VenturePortfolioDto {
  id: string;
  creatorUserId: string;
  portfolioName: string;
  description: string;
  totalVentureCount: number;
  aggregateValuationUsd: number;
  totalCapitalDeployedUsd: number;
  overallHealthScore: number;
  ventures: Array<{ startupId: string; startupName: string; stage: StartupStage; healthStatus: VentureHealthStatus; valuationUsd: number }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVenturePortfolioDto {
  portfolioName: string;
  description?: string;
  initialStartupIds?: string[];
}

// Module 8: Fundraising & Investor Network
export interface FundraisingRoundDto {
  id: string;
  startupId: string;
  roundName: string;
  stage: StartupFundingStage;
  targetRaiseUsd: number;
  committedUsd: number;
  preMoneyValuationUsd: number;
  postMoneyValuationUsd: number;
  leadInvestorId?: string;
  pitchDeckUrl?: string;
  readinessScore: number;
  isClosed: boolean;
  createdAt: string;
  closedAt?: string;
}

export interface CreateFundraisingRoundDto {
  startupId: string;
  roundName: string;
  stage?: StartupFundingStage;
  targetRaiseUsd: number;
  preMoneyValuationUsd?: number;
  pitchDeckUrl?: string;
}

export interface InvestorProfileDto {
  id: string;
  investorName: string;
  investorType: InvestorType;
  investmentThesis: string;
  sweetSpotCheckSizeUsd: number;
  preferredStages: StartupFundingStage[];
  preferredCategories: StartupCategory[];
  portfolioCompanyCount: number;
  matchScore?: number;
}

// Module 9: Startup Metrics & Events
export interface StartupMetricsDto {
  id: string;
  startupId: string;
  mrrUsd: number;
  arrUsd: number;
  burnRateMonthlyUsd: number;
  runwayMonths: number;
  activeUsers: number;
  churnRatePercent: number;
  healthStatus: VentureHealthStatus;
  recordedAt: string;
}

export interface StartupEventDto {
  id: string;
  startupId: string;
  eventType: StartupEventType;
  title: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
}

// Module 10: Startup Command Center Dashboard Overview
export interface StartupCommandCenterOverviewDto {
  totalStartupsCount: number;
  totalIdeasGenerated: number;
  activeIncubationsCount: number;
  totalCapitalRaisedUsd: number;
  aggregatePortfolioValuationUsd: number;
  averageMarketFitScore: number;
  topStartups: StartupDto[];
  recentMarketReports: MarketReportDto[];
  recentFundraisingRounds: FundraisingRoundDto[];
  portfolioHealthSummary: {
    thriving: number;
    onTrack: number;
    needsAttention: number;
  };
}

// ============================================================================
// Phase 21: Venture Capital Intelligence & Autonomous Investment Network DTOs
// ============================================================================

// Module 1: Deal Sourcing & Pipeline
export interface DealFlowDto {
  id: string;
  startupId?: string;
  startupName: string;
  tagline: string;
  category: StartupCategory;
  stage: DealStage;
  priority: DealPriority;
  source: string;
  sourceUrl?: string;
  initialValuationUsd: number;
  targetRaiseUsd: number;
  tractionSummary: string;
  fitScore: number;
  leadPartnerUserId?: string;
  tags: string[];
  assignedAnalyst?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealFlowDto {
  startupId?: string;
  startupName: string;
  tagline?: string;
  category: StartupCategory;
  stage?: DealStage;
  priority?: DealPriority;
  source?: string;
  sourceUrl?: string;
  initialValuationUsd?: number;
  targetRaiseUsd?: number;
  tractionSummary?: string;
  fitScore?: number;
  tags?: string[];
  notes?: string;
}

export interface FounderScoreDto {
  id: string;
  startupId: string;
  founderName: string;
  technicalDepthScore: number;
  convictionScore: number;
  executionVelocityScore: number;
  domainExpertiseScore: number;
  resilienceScore: number;
  compositeScore: number;
  strengths: string[];
  growthAreas: string[];
  assessmentNarrative: string;
  evaluatedAt: string;
}

export interface OpportunityScoreDto {
  id: string;
  startupId: string;
  marketTamScore: number;
  timingMoatScore: number;
  competitiveAdvantageScore: number;
  unitEconomicsPotentialScore: number;
  scalabilityScore: number;
  compositeScore: number;
  keyDrivers: string[];
  majorRisks: string[];
  scoredAt: string;
}

// Module 2: Autonomous Due Diligence
export interface DiligenceDimensionDto {
  category: DiligenceCategory;
  score: number;
  weight: number;
  findings: string[];
  strengths: string[];
  concerns: string[];
}

export interface RiskDetectionDto {
  category: DiligenceCategory;
  severity: DiligenceRiskSeverity;
  riskTitle: string;
  description: string;
  mitigationRecommendation: string;
}

export interface DueDiligenceReportDto {
  id: string;
  dealId?: string;
  startupId: string;
  overallScore: number;
  recommendation: InvestmentRecommendation;
  executiveSummary: string;
  dimensions: DiligenceDimensionDto[];
  detectedRisks: RiskDetectionDto[];
  redFlags: string[];
  greenLights: string[];
  completedAt: string;
  createdAt: string;
}

// Module 3: Investment Committee AI
export interface CommitteeVoteDto {
  committeeType: CommitteeType;
  agentName: string;
  role: string;
  vote: CommitteeVoteType;
  convictionScore: number;
  rationale: string;
  conditions?: string[];
}

export interface CommitteeDebateDto {
  committeeType: CommitteeType;
  topic: string;
  argumentsPro: string[];
  argumentsContra: string[];
  agentPerspectives: Array<{ agent: string; perspective: string }>;
  synthesis: string;
}

export interface InvestmentDecisionDto {
  id: string;
  dealId?: string;
  startupId: string;
  fundId?: string;
  recommendation: InvestmentRecommendation;
  quorumMet: boolean;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  conditionalVotes: number;
  abstainVotes: number;
  convictionScore: number;
  proposedInvestmentUsd: number;
  proposedValuationUsd: number;
  keyDebatePoints: string[];
  contradictionsDetected: string[];
  consensusRationale: string;
  votes: CommitteeVoteDto[];
  decidedAt: string;
}

// Module 4: Fund Management System
export interface FundDto {
  id: string;
  fundName: string;
  fundType: FundType;
  status: FundStatus;
  targetSizeUsd: number;
  committedCapitalUsd: number;
  deployedCapitalUsd: number;
  reserveCapitalUsd: number;
  vintageYear: number;
  managementFeePercent: number;
  carriedInterestPercent: number;
  hurdleRatePercent: number;
  totalInvestments: number;
  activeHoldingsCount: number;
  exitCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFundDto {
  fundName: string;
  fundType?: FundType;
  targetSizeUsd: number;
  vintageYear?: number;
  managementFeePercent?: number;
  carriedInterestPercent?: number;
}

export interface PortfolioHoldingDto {
  id: string;
  fundId: string;
  startupId: string;
  startupName: string;
  category: StartupCategory;
  stage: StartupStage;
  initialInvestedUsd: number;
  followOnInvestedUsd: number;
  totalInvestedUsd: number;
  currentInvestedUsd?: number;
  ownershipPercent: number;
  currentValuationUsd: number;
  holdingValueUsd: number;
  moic: number;
  irr: number;
  healthStatus: VentureHealthStatus;
  boardSeat: boolean;
  proRataRights: boolean;
  acquiredAt: string;
  updatedAt: string;
}

export interface FundMetricsDto {
  fundId: string;
  totalCommittedUsd: number;
  totalCalledUsd: number;
  totalDistributedUsd: number;
  navUsd: number;
  dpi: number;
  rvpi: number;
  tvpi: number;
  grossIrrPercent: number;
  netIrrPercent: number;
  moic: number;
  calculatedAt: string;
}

// Module 5: Portfolio Intelligence
export interface CorrelationMatrixDto {
  sectors: string[];
  matrix: Record<string, Record<string, number>>;
  maxConcentrationRiskSector: string;
  diversificationRating: string;
}

export interface HealthRiskRadarDto {
  holdingId: string;
  startupName: string;
  overallHealth: number;
  runwayRisk: number;
  competitionRisk: number;
  executionRisk: number;
  marketRisk: number;
}

export interface PortfolioIntelligenceDto {
  fundId: string;
  portfolioHealthScore: number;
  diversificationScore: number;
  riskAdjustedReturnScore: number;
  sharpeRatio: number;
  sortinoRatio: number;
  topPerformers: Array<{ startupName: string; moic: number; irr: number }>;
  laggingHoldings: Array<{ startupName: string; issue: string; action: string }>;
  sectorExposure: Record<string, number>;
  stageExposure: Record<string, number>;
  recommendations: string[];
  analyzedAt: string;
}

// Module 6: Exit Strategy & M&A Matching Engine
export interface ExitSimulationDto {
  id: string;
  fundId: string;
  startupId: string;
  startupName: string;
  exitType: ExitType;
  status: ExitStatus;
  targetAcquirerOrExchange?: string;
  simulatedExitValuationUsd: number;
  expectedProceedsUsd: number;
  fundReturnMultiple: number;
  netProfitUsd: number;
  carryGeneratedUsd: number;
  timelineMonths: number;
  confidenceRating: number;
  waterfallSummary: Array<{ tier: string; amountUsd: number; percentage: number }>;
  simulatedAt: string;
}

export interface LiquidityForecastDto {
  fundId: string;
  twelveMonthLiquidityUsd: number;
  twentyFourMonthLiquidityUsd: number;
  expectedExitsCount: number;
  projectedDpiIncrease: number;
  pipelineSummary?: string;
  quarterlyForecasts?: Array<{ quarter: string; projectedProceedsUsd: number; exitCandidates: string[] }>;
}

export interface MnaTargetMatchDto {
  startupId?: string;
  acquirerName?: string;
  potentialAcquirer?: string;
  strategicFitScore: number;
  historicalMnaActivity?: string;
  estimatedOfferRangeUsd?: string;
  synergyRationale?: string;
  rationale?: string;
  estimatedDealSizeRangeUsd?: { min: number; target: number; max: number };
  recentComparableDeals?: string[];
}

// Module 7: Investor Network & Syndicates
export interface LpProfileDto {
  id: string;
  lpName: string;
  lpType: 'INSTITUTIONAL' | 'FAMILY_OFFICE' | 'SOVEREIGN_WEALTH' | 'FUND_OF_FUNDS' | 'HIGH_NET_WORTH';
  committedTotalUsd: number;
  targetCheckSizeMinUsd?: number;
  targetCheckSizeMaxUsd?: number;
  contactEmail?: string;
  activeFunds: string[];
  preferredSectors: StartupCategory[];
  coInvestmentAppetite: boolean;
  relationshipHealth: number;
}

export interface SyndicateMemberDto {
  userId: string;
  investorName: string;
  role: SyndicateRole;
  committedUsd: number;
  joinedAt: string;
}

export interface SyndicateGroupDto {
  id: string;
  dealId?: string;
  startupId: string;
  syndicateName: string;
  leadInvestorId: string;
  targetRaiseUsd: number;
  committedUsd: number;
  committedTotalUsd?: number;
  allocationSpots: number;
  carryPercent: number;
  leadCarryPercent?: number;
  members: SyndicateMemberDto[];
  status: 'OPEN' | 'OVERSUBSCRIBED' | 'CLOSED' | 'ALLOCATED';
  createdAt: string;
}

// Module 8: Capital Allocation Engine
export interface ScenarioSensitivityDto {
  scenarioName: string;
  description: string;
  marketCondition: 'BULL' | 'BASE' | 'BEAR' | 'STAGFLATION';
  simulatedTvpi: number;
  simulatedGrossIrr: number;
  defaultRatePercent: number;
}

export interface CapitalAllocationPlanDto {
  fundId: string;
  strategy: AllocationStrategy;
  targetFundSizeUsd?: number;
  availableCapitalUsd: number;
  newDealsAllocationUsd: number;
  followOnReserveUsd: number;
  contingencyBufferUsd: number;
  allocationsByStage: Record<string, number>;
  allocationsBySector: Record<string, number>;
  scenarioSensitivities: ScenarioSensitivityDto[];
  optimizedAt: string;
}

// Module 9: VC Command Center Overview
export interface VCCommandCenterOverviewDto {
  totalAumUsd: number;
  activeFundsCount: number;
  totalPortfolioCompanies: number;
  aggregatePortfolioNavUsd: number;
  averageTvpi: number;
  averageDpi: number;
  grossIrrWeighted: number;
  activeDealFlowCount: number;
  pendingDueDiligenceCount: number;
  committeeDecisionsCount: number;
  recentDeals: DealFlowDto[];
  topFunds: FundDto[];
  recentExits: ExitSimulationDto[];
  riskAlerts: RiskDetectionDto[];
}

// ============================================================================
// Phase 22: Autonomous Research University & Scientific Knowledge Civilization DTOs
// ============================================================================

// Module 1: Research University Core
export interface ResearchProgramDto {
  id: string;
  name: string;
  department: AcademicDepartment;
  leadFacultyAgent: string;
  description: string;
  status: ResearchProgramStatus;
  primaryHypothesis?: string;
  targetMilestones: string[];
  allocatedBudgetUsd: number;
  activeResearchersCount: number;
  publicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResearchProgramDto {
  name: string;
  department: AcademicDepartment;
  leadFacultyAgent?: string;
  description: string;
  status?: ResearchProgramStatus;
  primaryHypothesis?: string;
  targetMilestones?: string[];
  allocatedBudgetUsd?: number;
}

export interface ResearchProjectDto {
  id: string;
  programId: string;
  title: string;
  abstract: string;
  department: AcademicDepartment;
  principalInvestigator: string;
  status: ResearchProgramStatus;
  startDate: string;
  targetCompletionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResearchProjectDto {
  programId: string;
  title: string;
  abstract: string;
  department: AcademicDepartment;
  principalInvestigator?: string;
  status?: ResearchProgramStatus;
  startDate?: string;
  targetCompletionDate?: string;
}

// Module 2: Scientific Discovery Engine
export interface HypothesisDto {
  id: string;
  programId: string;
  statement: string;
  rationale: string;
  department: AcademicDepartment;
  noveltyScore: number;
  feasibilityScore: number;
  testPlan: string[];
  status: HypothesisStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHypothesisDto {
  programId: string;
  statement: string;
  rationale: string;
  department: AcademicDepartment;
  noveltyScore?: number;
  feasibilityScore?: number;
  testPlan?: string[];
  status?: HypothesisStatus;
}

export interface DiscoveryDto {
  id: string;
  hypothesisId: string;
  programId: string;
  title: string;
  significance: DiscoverySignificance;
  summary: string;
  empiricalEvidence: string[];
  noveltyScore: number;
  reproducibilityIndex: number;
  confirmedAt: string;
  createdAt: string;
}

export interface CreateDiscoveryDto {
  hypothesisId: string;
  programId: string;
  title: string;
  significance?: DiscoverySignificance;
  summary: string;
  empiricalEvidence?: string[];
  noveltyScore?: number;
  reproducibilityIndex?: number;
}

// Module 3: Digital Research Laboratories
export interface LaboratoryDto {
  id: string;
  name: string;
  labType: LabType;
  department: AcademicDepartment;
  status: LabStatus;
  computeCapacityTeraflops: number;
  activeSimulationsCount: number;
  datasetsMountedCount: number;
  directorAgent: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLaboratoryDto {
  name: string;
  labType: LabType;
  department: AcademicDepartment;
  status?: LabStatus;
  computeCapacityTeraflops?: number;
  directorAgent?: string;
}

export interface ExperimentDto {
  id: string;
  labId: string;
  hypothesisId?: string;
  title: string;
  parameters: Record<string, any>;
  datasetRef: string;
  status: ExperimentStatus;
  executionDurationMs: number;
  reproducibilityScore: number;
  resultsSummary?: string;
  logs?: string[];
  executedAt?: string;
  createdAt: string;
}

export interface CreateExperimentDto {
  labId: string;
  hypothesisId?: string;
  title: string;
  parameters?: Record<string, any>;
  datasetRef?: string;
  status?: ExperimentStatus;
  reproducibilityScore?: number;
  resultsSummary?: string;
}

// Module 4: Knowledge Graph Civilization
export interface AcademicKnowledgeNodeDto {
  id: string;
  nodeType: KnowledgeNodeType;
  canonicalName: string;
  domain: AcademicDepartment;
  definition: string;
  confidenceScore: number;
  incomingCitations: number;
  outgoingConnections: string[];
  evolutionLineage: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademicKnowledgeNodeDto {
  nodeType: KnowledgeNodeType;
  canonicalName: string;
  domain: AcademicDepartment;
  definition: string;
  confidenceScore?: number;
  outgoingConnections?: string[];
  evolutionLineage?: string[];
}

// Module 5: Publication Engine
export interface PublicationDto {
  id: string;
  programId: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationType: PublicationType;
  status: PublicationStatus;
  department: AcademicDepartment;
  doi?: string;
  fullMarkdownContent: string;
  citationCount: number;
  readinessScore: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePublicationDto {
  programId: string;
  title: string;
  abstract: string;
  authors?: string[];
  publicationType?: PublicationType;
  status?: PublicationStatus;
  department: AcademicDepartment;
  doi?: string;
  fullMarkdownContent?: string;
  readinessScore?: number;
}

export interface CitationDto {
  id: string;
  sourcePublicationId: string;
  targetPublicationId: string;
  citationContext: string;
  semanticSimilarity: number;
  citedAt: string;
}

export interface CreateCitationDto {
  sourcePublicationId: string;
  targetPublicationId: string;
  citationContext?: string;
  semanticSimilarity?: number;
}

// Module 6: Peer Review Network
export interface PeerReviewDto {
  id: string;
  publicationId: string;
  reviewerRole: PeerReviewRole;
  reviewerAgentName: string;
  verdict: PeerReviewVerdict;
  overallScore: number; // 0-100
  methodologyScore: number;
  soundnessScore: number;
  noveltyScore: number;
  clarityScore: number;
  reproducibilityScore: number;
  comments: string;
  strengths: string[];
  weaknesses: string[];
  reviewedAt: string;
  createdAt: string;
}

export interface CreatePeerReviewDto {
  publicationId: string;
  reviewerRole: PeerReviewRole;
  reviewerAgentName?: string;
  verdict: PeerReviewVerdict;
  overallScore: number;
  methodologyScore?: number;
  soundnessScore?: number;
  noveltyScore?: number;
  clarityScore?: number;
  reproducibilityScore?: number;
  comments: string;
  strengths?: string[];
  weaknesses?: string[];
}

// Module 7: Research Funding Intelligence
export interface GrantDto {
  id: string;
  grantTitle: string;
  grantType: GrantType;
  fundingAgency: string;
  totalPoolUsd: number;
  maximumAwardUsd: number;
  eligibilityCriteria: string[];
  matchingDepartments: AcademicDepartment[];
  status: GrantStatus;
  applicationDeadline: string;
  awardedAmountUsd?: number;
  fundedProgramId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGrantDto {
  grantTitle: string;
  grantType: GrantType;
  fundingAgency: string;
  totalPoolUsd: number;
  maximumAwardUsd: number;
  eligibilityCriteria?: string[];
  matchingDepartments?: AcademicDepartment[];
  status?: GrantStatus;
  applicationDeadline?: string;
  awardedAmountUsd?: number;
  fundedProgramId?: string;
}

// Module 8: Global Collaboration Network
export interface CollaboratorDto {
  id: string;
  institutionName: string;
  primaryDepartment: AcademicDepartment;
  country: string;
  leadInvestigator: string;
  reputationScore: number;
  activeSharedProjects: string[];
  coAuthoredPublicationsCount: number;
  cooperationStatus: 'ACTIVE' | 'PENDING' | 'FORMALIZED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollaboratorDto {
  institutionName: string;
  primaryDepartment: AcademicDepartment;
  country?: string;
  leadInvestigator?: string;
  reputationScore?: number;
  activeSharedProjects?: string[];
  cooperationStatus?: 'ACTIVE' | 'PENDING' | 'FORMALIZED' | 'INACTIVE';
}

// Module 9 & 10: Metrics and Command Center
export interface ResearchMetricsDto {
  universityId: string;
  totalPrograms: number;
  activeLabsCount: number;
  experimentsExecutedCount: number;
  discoveriesLoggedCount: number;
  publicationsCount: number;
  totalCitationsCount: number;
  hIndexEstimated: number;
  totalGrantsSecuredUsd: number;
  globalKnowledgeGraphDensity: number;
  averageReproducibilityRate: number;
  computedAt: string;
}

export interface AcademicCommandCenterOverviewDto {
  universityName: string;
  motto: string;
  totalResearchProgramsCount: number;
  activeDigitalLabsCount: number;
  peerReviewedPapersCount: number;
  totalCitationsCount: number;
  cumulativeGrantFundingUsd: number;
  globalKnowledgeNodesCount: number;
  averageReproducibilityIndex: number;
  topPrograms: ResearchProgramDto[];
  recentDiscoveries: DiscoveryDto[];
  recentPublications: PublicationDto[];
  activeLabs: LaboratoryDto[];
  openGrants: GrantDto[];
}

// Phase 23: Autonomous Software Factory Interfaces
export interface SoftwareProjectDto {
  id: string;
  name: string;
  description: string;
  projectType: SoftwareProjectType;
  status: SoftwareProjectStatus;
  complexity: BlueprintComplexity;
  targetPlatform: string;
  frameworks: string[];
  dependencies: string[];
  linesOfCodeGenerated: number;
  buildStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  deploymentUrl?: string;
  repositoryUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSoftwareProjectDto {
  name: string;
  description: string;
  projectType: SoftwareProjectType;
  complexity: BlueprintComplexity;
  targetPlatform: string;
  frameworks: string[];
  dependencies: string[];
}

export interface EngineeringTaskDto {
  id: string;
  projectId: string;
  title: string;
  description: string;
  taskType: EngineeringTaskType;
  status: EngineeringTaskStatus;
  assignedAgent: string;
  estimatedHours: number;
  actualHoursSpent: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEngineeringTaskDto {
  projectId: string;
  title: string;
  description: string;
  taskType: EngineeringTaskType;
  assignedAgent: string;
  estimatedHours: number;
}

export interface GeneratedArtifactDto {
  id: string;
  projectId: string;
  taskId?: string;
  filePath: string;
  artifactType: ArtifactType;
  fileContent: string;
  fileSizeCharacters: number;
  checksum: string;
  generatedAt: string;
}

export interface CreateGeneratedArtifactDto {
  projectId: string;
  taskId?: string;
  filePath: string;
  artifactType: ArtifactType;
  fileContent: string;
}

export interface ArchitectureBlueprintDto {
  id: string;
  projectId: string;
  diagramMermaid: string;
  componentLayout: Record<string, any>;
  apiGateways: Array<{ route: string; targetService: string; method: string }>;
  databaseSchemas: Record<string, string>;
  deploymentSpecs: Record<string, any>;
  designedAt: string;
}

export interface CreateArchitectureBlueprintDto {
  projectId: string;
  diagramMermaid: string;
  componentLayout: Record<string, any>;
  apiGateways: Array<{ route: string; targetService: string; method: string }>;
  databaseSchemas: Record<string, string>;
  deploymentSpecs: Record<string, any>;
}

export interface SoftwareFactoryMetricsDto {
  totalProjects: number;
  activeProjects: number;
  totalLinesOfCode: number;
  buildSuccessRate: number;
  activeAgentsCount: number;
  averageTaskCompletionHours: number;
  completedTasksCount: number;
  failedTasksCount: number;
  calculatedAt: string;
}

export interface SoftwareFactoryOverviewDto {
  metrics: SoftwareFactoryMetricsDto;
  recentProjects: SoftwareProjectDto[];
  recentTasks: EngineeringTaskDto[];
  recentArtifacts: GeneratedArtifactDto[];
  activeBlueprints: ArchitectureBlueprintDto[];
}

// Phase 24: Autonomous AI Cloud Platform Interfaces
export interface CloudClusterDto {
  id: string;
  name: string;
  region: ClusterRegion;
  status: ClusterStatus;
  totalGpus: number;
  availableGpus: number;
  totalMemoryGb: number;
  availableMemoryGb: number;
  totalCpuCores: number;
  availableCpuCores: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCloudClusterDto {
  name: string;
  region: ClusterRegion;
  totalGpus: number;
  totalMemoryGb: number;
  totalCpuCores: number;
}

export interface ComputeNodeDto {
  id: string;
  clusterId: string;
  name: string;
  nodeType: ComputeNodeType;
  status: ComputeNodeStatus;
  gpuUtilizationPercent: number;
  memoryUtilizationPercent: number;
  cpuUtilizationPercent: number;
  temperatureCelsius: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComputeNodeDto {
  clusterId: string;
  name: string;
  nodeType: ComputeNodeType;
}

export interface CloudDeploymentDto {
  id: string;
  clusterId: string;
  nodeId?: string;
  workloadType: WorkloadType;
  status: DeploymentStatus;
  replicaCount: number;
  cpuLimit: number;
  memoryLimitGb: number;
  gpuLimit: number;
  simulatedCostUsdPerHour: number;
  logs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCloudDeploymentDto {
  clusterId: string;
  workloadType: WorkloadType;
  replicaCount: number;
  cpuLimit: number;
  memoryLimitGb: number;
  gpuLimit: number;
}

export interface InferenceRequestDto {
  id: string;
  deploymentId: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  statusCode: number;
  routedRegion: ClusterRegion;
  createdAt: string;
}

export interface CreateInferenceRequestDto {
  deploymentId: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  statusCode: number;
  routedRegion: ClusterRegion;
}

export interface ResourceMetricsDto {
  id: string;
  clusterId: string;
  timestamp: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  gpuUsagePercent: number;
  networkInboundGbps: number;
  networkOutboundGbps: number;
  estimatedCostUsd: number;
}

export interface CreateResourceMetricsDto {
  clusterId: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  gpuUsagePercent: number;
  networkInboundGbps: number;
  networkOutboundGbps: number;
  estimatedCostUsd: number;
}

export interface AICloudOverviewDto {
  clusters: CloudClusterDto[];
  nodes: ComputeNodeDto[];
  deployments: CloudDeploymentDto[];
  metrics: ResourceMetricsDto[];
  overviewStats: {
    totalAllocatedCostUsd: number;
    activeDeploymentsCount: number;
    globalAverageLatencyMs: number;
    aggregateGpuUtilization: number;
  };
}

// Phase 25: Multimodal Intelligence Platform Interfaces
export interface MediaAssetDto {
  id: string;
  name: string;
  storageUrl: string;
  assetType: AssetType;
  fileSizeCharacters: number;
  checksum: string;
  createdAt: string;
}

export interface CreateMediaAssetDto {
  name: string;
  storageUrl: string;
  assetType: AssetType;
  fileSizeCharacters: number;
}

export interface AnalysisResultDto {
  id: string;
  assetId: string;
  status: AnalysisStatus;
  detectedTags: string[];
  ocrText?: string;
  confidenceScore: number;
  metadata: Record<string, any>;
  analyzedAt: string;
}

export interface CreateAnalysisResultDto {
  assetId: string;
  detectedTags: string[];
  ocrText?: string;
  confidenceScore: number;
  metadata: Record<string, any>;
}

export interface ReasoningSessionDto {
  id: string;
  sessionName: string;
  complexity: ReasoningComplexity;
  promptQuery: string;
  reasoningSteps: string[];
  cognitiveOutput: string;
  confidenceScore: number;
  createdAt: string;
}

export interface CreateReasoningSessionDto {
  sessionName: string;
  complexity: ReasoningComplexity;
  promptQuery: string;
}

export interface MultimodalKnowledgeDto {
  id: string;
  conceptName: string;
  associatedTags: string[];
  crossMediaSummary: string;
  extractedRelations: Array<{ targetConcept: string; predicate: string }>;
  verifiedAt: string;
}

export interface CreateMultimodalKnowledgeDto {
  conceptName: string;
  associatedTags: string[];
  crossMediaSummary: string;
  extractedRelations: Array<{ targetConcept: string; predicate: string }>;
}

export interface MultimodalMetricsDto {
  totalAssetsProcessed: number;
  averageAnalysisConfidence: number;
  totalOCRCharactersExtracted: number;
  activeReasoningSessionsCount: number;
  knowledgeNodeDensity: number;
  calculatedAt: string;
}

export interface MultimodalOverviewDto {
  metrics: MultimodalMetricsDto;
  recentAssets: MediaAssetDto[];
  recentResults: AnalysisResultDto[];
  recentSessions: ReasoningSessionDto[];
  knowledgeBase: MultimodalKnowledgeDto[];
}

// Phase 26: Cybersecurity Intelligence Platform Interfaces
export interface SecurityEventDto {
  id: string;
  eventType: string;
  sourceIp: string;
  severity: ThreatSeverity;
  payload: Record<string, any>;
  timestamp: string;
}

export interface CreateSecurityEventDto {
  eventType: string;
  sourceIp: string;
  severity: ThreatSeverity;
  payload: Record<string, any>;
}

export interface ThreatDto {
  id: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  affectedSystems: string[];
  mitigationSteps: string[];
  detectedAt: string;
}

export interface CreateThreatDto {
  title: string;
  description: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  affectedSystems: string[];
  mitigationSteps: string[];
}

export interface VulnerabilityDto {
  id: string;
  cveId: string;
  packageName: string;
  severity: ThreatSeverity;
  status: VulnerabilityStatus;
  cvssScore: number;
  description: string;
  remediationPlan: string;
  detectedAt: string;
}

export interface CreateVulnerabilityDto {
  cveId: string;
  packageName: string;
  severity: ThreatSeverity;
  status: VulnerabilityStatus;
  cvssScore: number;
  description: string;
  remediationPlan: string;
}

export interface IncidentDto {
  id: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  status: IncidentStatus;
  assignedTeam: string;
  containmentAction?: string;
  createdAt: string;
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  severity: ThreatSeverity;
  assignedTeam: string;
}

export interface SecurityMetricsDto {
  aggregateRiskScore: number;
  totalThreatsDetected: number;
  mitigatedThreatsCount: number;
  openVulnerabilitiesCount: number;
  activeIncidentsCount: number;
  calculatedAt: string;
}

export interface SecurityOverviewDto {
  metrics: SecurityMetricsDto;
  recentEvents: SecurityEventDto[];
  activeThreats: ThreatDto[];
  openVulnerabilities: VulnerabilityDto[];
  recentIncidents: IncidentDto[];
}

// Phase 27: Data Intelligence Platform Interfaces
export interface DataSourceDto {
  id: string;
  name: string;
  sourceType: DataSourceType;
  connectionDetails: Record<string, any>;
  rowCount: number;
  fileSizeKb: number;
  createdAt: string;
}

export interface CreateDataSourceDto {
  name: string;
  sourceType: DataSourceType;
  connectionDetails: Record<string, any>;
  rowCount: number;
  fileSizeKb: number;
}

export interface AnalyticsJobDto {
  id: string;
  sourceId: string;
  jobName: string;
  status: AnalyticsJobStatus;
  executionTimeMs: number;
  processedRowsCount: number;
  outputDetails: Record<string, any>;
  createdAt: string;
}

export interface CreateAnalyticsJobDto {
  sourceId: string;
  jobName: string;
}

export interface DataInsightDto {
  id: string;
  title: string;
  summary: string;
  insightType: InsightType;
  confidenceScore: number;
  anomalyDetected: boolean;
  historicalTrendDetails: Record<string, any>;
  createdAt: string;
}

export interface CreateDataInsightDto {
  title: string;
  summary: string;
  insightType: InsightType;
  confidenceScore: number;
  anomalyDetected: boolean;
  historicalTrendDetails: Record<string, any>;
}

export interface QualityReportDto {
  id: string;
  sourceId: string;
  completenessPercentage: number;
  duplicateCount: number;
  nullValueCount: number;
  rating: QualityRating;
  runAt: string;
}

export interface CreateQualityReportDto {
  sourceId: string;
  completenessPercentage: number;
  duplicateCount: number;
  nullValueCount: number;
  rating: QualityRating;
}

export interface DataMetricsDto {
  totalIngestedRows: number;
  activeJobsCount: number;
  generatedInsightsCount: number;
  averageQualityScore: number;
  totalDataSourcesCount: number;
  calculatedAt: string;
}

export interface DataOverviewDto {
  metrics: DataMetricsDto;
  dataSources: DataSourceDto[];
  analyticsJobs: AnalyticsJobDto[];
  insights: DataInsightDto[];
  qualityReports: QualityReportDto[];
}

// Phase 28: Platform Integration Interfaces
export interface PlatformEventDto {
  id: string;
  sourceModule: string;
  eventName: string;
  severity: PlatformEventSeverity;
  payload: Record<string, any>;
  timestamp: string;
}

export interface CreatePlatformEventDto {
  sourceModule: string;
  eventName: string;
  severity: PlatformEventSeverity;
  payload: Record<string, any>;
}

export interface UnifiedContextDto {
  id: string;
  userId: string;
  contextKey: string;
  contextValue: Record<string, any>;
  updatedAt: string;
}

export interface CreateUnifiedContextDto {
  contextKey: string;
  contextValue: Record<string, any>;
}

export interface WorkflowExecutionDto {
  id: string;
  userId: string;
  workflowName: string;
  status: CrossModuleWorkflowStatus;
  triggerEvent: string;
  executedSteps: Array<{
    stepNumber: number;
    moduleName: string;
    actionTaken: string;
    status: OrchestrationStepStatus;
    resultSummary?: string;
  }>;
  createdAt: string;
  completedAt?: string;
}

export interface CreateWorkflowExecutionDto {
  workflowName: string;
  triggerEvent: string;
  steps: Array<{
    stepNumber: number;
    moduleName: string;
    actionTaken: string;
  }>;
}

export interface GlobalSearchResultDto {
  type: 'concept' | 'job' | 'insight' | 'threat' | 'source';
  id: string;
  title: string;
  subtitle: string;
  relevanceScore: number;
}

export interface PlatformHealthDto {
  status: 'healthy' | 'degraded' | 'critical';
  uptimeSeconds: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  moduleHealth: Record<string, 'healthy' | 'degraded' | 'failed'>;
  activeWorkflowsCount: number;
  totalErrorsLogged: number;
}

export interface PlatformOverviewDto {
  metrics: {
    totalEventsCount: number;
    activeWorkflowsCount: number;
    unifiedContextKeysCount: number;
    aggregateRiskScore: number;
    systemUptimeHours: number;
  };
  recentEvents: PlatformEventDto[];
  activeWorkflows: WorkflowExecutionDto[];
  contextKeys: string[];
}

// Phase 29: Autonomous Agent Ecosystem Interfaces
export interface EcosystemAgentDto {
  id: string;
  creatorUserId: string;
  agentName: string;
  agentType: EcosystemAgentType;
  status: EcosystemAgentStatus;
  capabilities: string[];
  performanceMetrics: {
    successRate: number;
    tasksCompleted: number;
    averageResponseTimeMs: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEcosystemAgentDto {
  agentName: string;
  agentType: EcosystemAgentType;
  capabilities: string[];
}

export interface EcosystemAgentTaskDto {
  id: string;
  assignedAgentId: string;
  taskDescription: string;
  status: AgentTaskStatus;
  inputParams: Record<string, any>;
  outputResult?: Record<string, any>;
  errorSummary?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CreateEcosystemAgentTaskDto {
  assignedAgentId: string;
  taskDescription: string;
  inputParams: Record<string, any>;
}

export interface EcosystemAgentMemoryDto {
  id: string;
  agentId: string;
  memoryKey: string;
  memoryValue: string;
  embeddingVector?: number[];
  createdAt: string;
}

export interface CreateEcosystemAgentMemoryDto {
  agentId: string;
  memoryKey: string;
  memoryValue: string;
}

export interface AgentInteractionDto {
  id: string;
  sourceAgentId: string;
  targetAgentId: string;
  messageType: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface CreateAgentInteractionDto {
  sourceAgentId: string;
  targetAgentId: string;
  messageType: string;
  payload: Record<string, any>;
}

export interface AgentMetricsDto {
  activeAgentsCount: number;
  totalTasksDelegated: number;
  averageSuccessRate: number;
  totalMemoriesCount: number;
  totalInteractionsCount: number;
  recordedAt: string;
}

export interface AgentOverviewDto {
  metrics: AgentMetricsDto;
  agentsList: EcosystemAgentDto[];
  recentTasks: EcosystemAgentTaskDto[];
  recentInteractions: AgentInteractionDto[];
}



