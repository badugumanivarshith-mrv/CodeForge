import { pgEnum } from 'drizzle-orm/pg-core';
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
  ContestStatus,
  NotificationType,
  AIInteractionType,
  MasteryLevel,
  MistakeCategory,
  XPTransactionType,
  ContentStatus,
} from '@codeforge/shared';

export const userRoleEnum = pgEnum('user_role', [
  UserRole.STUDENT,
  UserRole.EDUCATOR,
  UserRole.ADMIN,
]);

export const userStatusEnum = pgEnum('user_status', [
  UserStatus.ACTIVE,
  UserStatus.SUSPENDED,
  UserStatus.PENDING_VERIFICATION,
]);

export const languageIdEnum = pgEnum('language_id', [
  LanguageId.PYTHON,
  LanguageId.JAVA,
  LanguageId.C,
  LanguageId.CPP,
  LanguageId.JAVASCRIPT,
  LanguageId.TYPESCRIPT,
]);

export const topicDifficultyEnum = pgEnum('topic_difficulty', [
  TopicDifficulty.BEGINNER,
  TopicDifficulty.INTERMEDIATE,
  TopicDifficulty.ADVANCED,
]);

export const quizDifficultyEnum = pgEnum('quiz_difficulty', [
  QuizDifficulty.EASY,
  QuizDifficulty.MEDIUM,
  QuizDifficulty.DIFFICULT,
]);

export const questionTypeEnum = pgEnum('question_type', [
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.TRUE_FALSE,
  QuestionType.CODE_COMPREHENSION,
  QuestionType.OUTPUT_PREDICTION,
]);

export const problemDifficultyEnum = pgEnum('problem_difficulty', [
  ProblemDifficulty.EASY,
  ProblemDifficulty.MEDIUM,
  ProblemDifficulty.DIFFICULT,
]);

export const assignmentDifficultyEnum = pgEnum('assignment_difficulty', [
  AssignmentDifficulty.MEDIUM,
  AssignmentDifficulty.DIFFICULT,
]);

export const submissionStatusEnum = pgEnum('submission_status', [
  SubmissionStatus.QUEUED,
  SubmissionStatus.COMPILING,
  SubmissionStatus.RUNNING,
  SubmissionStatus.ACCEPTED,
  SubmissionStatus.WRONG_ANSWER,
  SubmissionStatus.TIME_LIMIT_EXCEEDED,
  SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
  SubmissionStatus.RUNTIME_ERROR,
  SubmissionStatus.COMPILATION_ERROR,
  SubmissionStatus.INTERNAL_ERROR,
]);

export const assignmentStatusEnum = pgEnum('assignment_status', [
  AssignmentStatus.DRAFT,
  AssignmentStatus.SUBMITTED,
  AssignmentStatus.IN_REVIEW,
  AssignmentStatus.GRADED,
]);

export const achievementTypeEnum = pgEnum('achievement_type', [
  AchievementType.STREAK,
  AchievementType.PROBLEM_COUNT,
  AchievementType.XP_MILESTONE,
  AchievementType.TOPIC_MASTERY,
  AchievementType.POLYGLOT,
  AchievementType.SPECIAL,
]);

export const projectStatusEnum = pgEnum('project_status', [
  ProjectStatus.DRAFT,
  ProjectStatus.PUBLISHED,
  ProjectStatus.ARCHIVED,
]);

export const contestStatusEnum = pgEnum('contest_status', [
  ContestStatus.UPCOMING,
  ContestStatus.ACTIVE,
  ContestStatus.COMPLETED,
  ContestStatus.CANCELLED,
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  NotificationType.SYSTEM,
  NotificationType.ACHIEVEMENT_UNLOCKED,
  NotificationType.STREAK_WARNING,
  NotificationType.LEVEL_UP,
  NotificationType.FEEDBACK_RECEIVED,
]);

export const aiInteractionTypeEnum = pgEnum('ai_interaction_type', [
  AIInteractionType.SOCRATIC_HINT,
  AIInteractionType.ERROR_DEBUG,
  AIInteractionType.CODE_REVIEW,
  AIInteractionType.COACH_ADVICE,
  AIInteractionType.INTERVIEW_PREP,
]);

export const masteryLevelEnum = pgEnum('mastery_level', [
  MasteryLevel.NOVICE,
  MasteryLevel.PROFICIENT,
  MasteryLevel.MASTERED,
]);

export const mistakeCategoryEnum = pgEnum('mistake_category', [
  MistakeCategory.SYNTAX,
  MistakeCategory.BOUNDARY_CONDITION,
  MistakeCategory.INFINITE_LOOP,
  MistakeCategory.TYPE_MISMATCH,
  MistakeCategory.NULL_POINTER,
  MistakeCategory.MEMORY_LEAK,
  MistakeCategory.CONCURRENCY,
  MistakeCategory.LOGIC_FAULT,
]);

export const xpTransactionTypeEnum = pgEnum('xp_transaction_type', [
  XPTransactionType.LESSON_COMPLETE,
  XPTransactionType.QUIZ_PASS,
  XPTransactionType.PROBLEM_SOLVED,
  XPTransactionType.ASSIGNMENT_COMPLETED,
  XPTransactionType.STREAK_BONUS,
  XPTransactionType.ACHIEVEMENT_UNLOCKED,
  XPTransactionType.ADMIN_ADJUSTMENT,
]);

export const contentStatusEnum = pgEnum('content_status', [
  ContentStatus.DRAFT,
  ContentStatus.STAGED,
  ContentStatus.PUBLISHED,
]);
