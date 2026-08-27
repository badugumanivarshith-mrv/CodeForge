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

export interface LessonDto {
  id: string;
  topicId: string;
  sequence: number;
  slug: string;
  title: string;
  description: string | null;
  readTimeMinutes: number;
  status: ContentStatus;
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

// Quiz Domain Types
export interface QuizOptionDto {
  id: string;
  sequence: number;
  optionText: string;
  isCorrect?: boolean;
}

export interface QuizQuestionDto {
  id: string;
  quizId: string;
  sequence: number;
  questionType: QuestionType;
  questionMdx: string;
  codeSnippet: string | null;
  explanationMdx: string | null;
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
  testCaseId: string;
  status: SubmissionStatus;
  actualOutput: string | null;
  executionTimeMs: number;
  memoryKb: number;
  errorMessage?: string | null;
}

export interface SubmissionDto {
  id: string;
  userId: string;
  problemId: string;
  languageId: LanguageId;
  sourceCode: string;
  status: SubmissionStatus;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  passedTestCases: number;
  totalTestCases: number;
  compileOutput: string | null;
  createdAt: string;
  testResults?: SubmissionTestCaseResultDto[];
}

// Progress & Mastery Types
export interface TopicMasteryDto {
  id: string;
  userId: string;
  topicId: string;
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
