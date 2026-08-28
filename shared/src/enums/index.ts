export enum UserRole {
  STUDENT = 'student',
  EDUCATOR = 'educator',
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum LanguageId {
  PYTHON = 'python',
  JAVA = 'java',
  C = 'c',
  CPP = 'cpp',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  GO = 'go',
  RUST = 'rust',
}

export enum TopicDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  CODE_COMPREHENSION = 'code_comprehension',
  OUTPUT_PREDICTION = 'output_prediction',
}

export enum ProblemDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
  HARD = 'difficult',
}

export enum AssignmentDifficulty {
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
}

export enum SubmissionStatus {
  QUEUED = 'queued',
  COMPILING = 'compiling',
  RUNNING = 'running',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded',
  OUTPUT_LIMIT_EXCEEDED = 'output_limit_exceeded',
  RUNTIME_ERROR = 'runtime_error',
  COMPILATION_ERROR = 'compilation_error',
  INTERNAL_ERROR = 'internal_error',
}

export enum JudgeVerdict {
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  OUTPUT_LIMIT_EXCEEDED = 'OUTPUT_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export enum AssignmentStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  GRADED = 'graded',
}

export enum AchievementType {
  STREAK = 'streak',
  PROBLEM_COUNT = 'problem_count',
  XP_MILESTONE = 'xp_milestone',
  TOPIC_MASTERY = 'topic_mastery',
  POLYGLOT = 'polyglot',
  SPECIAL = 'special',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ContestStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  SYSTEM = 'system',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  STREAK_WARNING = 'streak_warning',
  LEVEL_UP = 'level_up',
  FEEDBACK_RECEIVED = 'feedback_received',
}

export enum AIInteractionType {
  SOCRATIC_HINT = 'socratic_hint',
  ERROR_DEBUG = 'error_debug',
  CODE_REVIEW = 'code_review',
  COACH_ADVICE = 'coach_advice',
  INTERVIEW_PREP = 'interview_prep',
}

export enum MasteryLevel {
  NOVICE = 'novice',
  PROFICIENT = 'proficient',
  MASTERED = 'mastered',
}

export enum MistakeCategory {
  SYNTAX = 'syntax',
  BOUNDARY_CONDITION = 'boundary_condition',
  INFINITE_LOOP = 'infinite_loop',
  TYPE_MISMATCH = 'type_mismatch',
  NULL_POINTER = 'null_pointer',
  MEMORY_LEAK = 'memory_leak',
  CONCURRENCY = 'concurrency',
  LOGIC_FAULT = 'logic_fault',
}

export enum HintTier {
  CONCEPT = 1,
  APPROACH = 2,
  PSEUDOCODE = 3,
}

export enum XPTransactionType {
  LESSON_COMPLETE = 'lesson_complete',
  QUIZ_PASS = 'quiz_pass',
  PROBLEM_SOLVED = 'problem_solved',
  ASSIGNMENT_COMPLETED = 'assignment_completed',
  STREAK_BONUS = 'streak_bonus',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

export enum ContentStatus {
  DRAFT = 'draft',
  STAGED = 'staged',
  PUBLISHED = 'published',
}

export enum AssessmentType {
  DIAGNOSTIC = 'diagnostic',
  TOPIC_MASTERY = 'topic_mastery',
  SKILL_BENCHMARK = 'skill_benchmark',
  CODING_CHALLENGE = 'coding_challenge',
  MOCK_INTERVIEW = 'mock_interview',
}

export enum AssessmentSessionStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  EXPIRED = 'expired',
}

export enum AssessmentQuestionType {
  MCQ = 'mcq',
  MULTIPLE_SELECT = 'multiple_select',
  CODE_COMPLETION = 'code_completion',
  DEBUGGING = 'debugging',
  OUTPUT_PREDICTION = 'output_prediction',
  CODING_PROBLEM = 'coding_problem',
  COMPLEXITY_ANALYSIS = 'complexity_analysis',
  CONCEPTUAL = 'conceptual',
  CODE_REVIEW = 'code_review',
}

export enum ContestState {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  LIVE = 'live',
  ENDED = 'ended',
  ARCHIVED = 'archived',
}

export enum LeaderboardTimeframe {
  GLOBAL = 'global',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CONTEST = 'contest',
}

export enum RatingReferenceType {
  ASSESSMENT = 'assessment',
  CONTEST = 'contest',
  PROBLEM = 'problem',
}

export enum StudyGroupRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum ForumTargetType {
  POST = 'post',
  ANSWER = 'answer',
}

export enum ForumVoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

export enum CareerRole {
  FRONTEND_DEVELOPER = 'frontend_developer',
  BACKEND_DEVELOPER = 'backend_developer',
  FULLSTACK_DEVELOPER = 'fullstack_developer',
  DEVOPS_ENGINEER = 'devops_engineer',
  CLOUD_ENGINEER = 'cloud_engineer',
  AI_ENGINEER = 'ai_engineer',
  DATA_SCIENTIST = 'data_scientist',
  CYBERSECURITY_ENGINEER = 'cybersecurity_engineer',
  MOBILE_DEVELOPER = 'mobile_developer',
}

export enum InterviewType {
  BEHAVIORAL = 'behavioral',
  TECHNICAL = 'technical',
  CODING = 'coding',
  SYSTEM_DESIGN = 'system_design',
  MIXED = 'mixed',
}

export enum InterviewStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ActivityType {
  ASSESSMENT_COMPLETED = 'assessment_completed',
  CONTEST_PARTICIPATION = 'contest_participation',
  CONTEST_WIN = 'contest_win',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  PROJECT_PUBLISHED = 'project_published',
  SKILL_PROMOTED = 'skill_promoted',
  INTERVIEW_COMPLETED = 'interview_completed',
  FORUM_ACCEPTED_ANSWER = 'forum_accepted_answer',
  JOB_APPLICATION_SUBMITTED = 'job_application_submitted',
  HIRED = 'hired',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract',
}

export enum WorkplaceType {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ON_SITE = 'on_site',
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
}

export { JobStatus as JobPostingStatus };


export enum ApplicationStage {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  TECHNICAL_ROUND = 'technical_round',
  HR_ROUND = 'hr_round',
  OFFER = 'offer',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export enum MatchCategory {
  STRONG_MATCH = 'strong_match',
  GOOD_MATCH = 'good_match',
  PARTIAL_MATCH = 'partial_match',
  WEAK_MATCH = 'weak_match',
}

export enum ReferralStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export enum HiringInterviewType {
  SCREENING = 'screening',
  TECHNICAL = 'technical',
  SYSTEM_DESIGN = 'system_design',
  BEHAVIORAL = 'behavioral',
  HR = 'hr',
}

export enum HiringInterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum OfferRecommendation {
  STRONG_HIRE = 'strong_hire',
  HIRE = 'hire',
  LEAN_HIRE = 'lean_hire',
  LEAN_NO_HIRE = 'lean_no_hire',
  NO_HIRE = 'no_hire',
}
