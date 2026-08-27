export enum UserRole {
  STUDENT = 'student',
  EDUCATOR = 'educator',
  ADMIN = 'admin',
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
  RUNTIME_ERROR = 'runtime_error',
  COMPILATION_ERROR = 'compilation_error',
  INTERNAL_ERROR = 'internal_error',
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
