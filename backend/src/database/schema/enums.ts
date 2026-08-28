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
} from '@codeforge/shared';

export const userRoleEnum = pgEnum('user_role', [
  UserRole.STUDENT,
  UserRole.EDUCATOR,
  UserRole.ADMIN,
  UserRole.RECRUITER,
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
  LanguageId.GO,
  LanguageId.RUST,
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
  SubmissionStatus.OUTPUT_LIMIT_EXCEEDED,
  SubmissionStatus.RUNTIME_ERROR,
  SubmissionStatus.COMPILATION_ERROR,
  SubmissionStatus.INTERNAL_ERROR,
]);

export const judgeVerdictEnum = pgEnum('judge_verdict', [
  JudgeVerdict.ACCEPTED,
  JudgeVerdict.WRONG_ANSWER,
  JudgeVerdict.COMPILATION_ERROR,
  JudgeVerdict.RUNTIME_ERROR,
  JudgeVerdict.TIME_LIMIT_EXCEEDED,
  JudgeVerdict.MEMORY_LIMIT_EXCEEDED,
  JudgeVerdict.OUTPUT_LIMIT_EXCEEDED,
  JudgeVerdict.INTERNAL_ERROR,
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

export const assessmentTypeEnum = pgEnum('assessment_type', [
  AssessmentType.DIAGNOSTIC,
  AssessmentType.TOPIC_MASTERY,
  AssessmentType.SKILL_BENCHMARK,
  AssessmentType.CODING_CHALLENGE,
  AssessmentType.MOCK_INTERVIEW,
]);

export const assessmentSessionStatusEnum = pgEnum('assessment_session_status', [
  AssessmentSessionStatus.NOT_STARTED,
  AssessmentSessionStatus.IN_PROGRESS,
  AssessmentSessionStatus.PAUSED,
  AssessmentSessionStatus.COMPLETED,
  AssessmentSessionStatus.ABANDONED,
  AssessmentSessionStatus.EXPIRED,
]);

export const assessmentQuestionTypeEnum = pgEnum('assessment_question_type', [
  AssessmentQuestionType.MCQ,
  AssessmentQuestionType.MULTIPLE_SELECT,
  AssessmentQuestionType.CODE_COMPLETION,
  AssessmentQuestionType.DEBUGGING,
  AssessmentQuestionType.OUTPUT_PREDICTION,
  AssessmentQuestionType.CODING_PROBLEM,
  AssessmentQuestionType.COMPLEXITY_ANALYSIS,
  AssessmentQuestionType.CONCEPTUAL,
  AssessmentQuestionType.CODE_REVIEW,
]);

export const contestStateEnum = pgEnum('contest_state', [
  ContestState.DRAFT,
  ContestState.UPCOMING,
  ContestState.LIVE,
  ContestState.ENDED,
  ContestState.ARCHIVED,
]);

export const leaderboardTimeframeEnum = pgEnum('leaderboard_timeframe', [
  LeaderboardTimeframe.GLOBAL,
  LeaderboardTimeframe.WEEKLY,
  LeaderboardTimeframe.MONTHLY,
  LeaderboardTimeframe.CONTEST,
]);

export const ratingReferenceTypeEnum = pgEnum('rating_reference_type', [
  RatingReferenceType.ASSESSMENT,
  RatingReferenceType.CONTEST,
  RatingReferenceType.PROBLEM,
]);

export const studyGroupRoleEnum = pgEnum('study_group_role', [
  StudyGroupRole.OWNER,
  StudyGroupRole.ADMIN,
  StudyGroupRole.MEMBER,
]);

export const forumTargetTypeEnum = pgEnum('forum_target_type', [
  ForumTargetType.POST,
  ForumTargetType.ANSWER,
]);

export const forumVoteTypeEnum = pgEnum('forum_vote_type', [
  ForumVoteType.UPVOTE,
  ForumVoteType.DOWNVOTE,
]);

export const careerRoleEnum = pgEnum('career_role', [
  CareerRole.FRONTEND_DEVELOPER,
  CareerRole.BACKEND_DEVELOPER,
  CareerRole.FULLSTACK_DEVELOPER,
  CareerRole.DEVOPS_ENGINEER,
  CareerRole.CLOUD_ENGINEER,
  CareerRole.AI_ENGINEER,
  CareerRole.DATA_SCIENTIST,
  CareerRole.CYBERSECURITY_ENGINEER,
  CareerRole.MOBILE_DEVELOPER,
]);

export const interviewTypeEnum = pgEnum('interview_type', [
  InterviewType.BEHAVIORAL,
  InterviewType.TECHNICAL,
  InterviewType.CODING,
  InterviewType.SYSTEM_DESIGN,
  InterviewType.MIXED,
]);

export const interviewStatusEnum = pgEnum('interview_status', [
  InterviewStatus.IN_PROGRESS,
  InterviewStatus.COMPLETED,
  InterviewStatus.CANCELLED,
]);

export const activityTypeEnum = pgEnum('activity_type', [
  ActivityType.ASSESSMENT_COMPLETED,
  ActivityType.CONTEST_PARTICIPATION,
  ActivityType.CONTEST_WIN,
  ActivityType.ACHIEVEMENT_UNLOCKED,
  ActivityType.PROJECT_PUBLISHED,
  ActivityType.SKILL_PROMOTED,
  ActivityType.INTERVIEW_COMPLETED,
  ActivityType.FORUM_ACCEPTED_ANSWER,
  ActivityType.JOB_APPLICATION_SUBMITTED,
  ActivityType.HIRED,
]);

export const jobTypeEnum = pgEnum('job_type', [
  JobType.FULL_TIME,
  JobType.PART_TIME,
  JobType.INTERNSHIP,
  JobType.CONTRACT,
]);

export const workplaceTypeEnum = pgEnum('workplace_type', [
  WorkplaceType.REMOTE,
  WorkplaceType.HYBRID,
  WorkplaceType.ON_SITE,
]);

export const jobStatusEnum = pgEnum('job_status', [
  JobStatus.DRAFT,
  JobStatus.ACTIVE,
  JobStatus.PAUSED,
  JobStatus.CLOSED,
]);

export const applicationStageEnum = pgEnum('application_stage', [
  ApplicationStage.APPLIED,
  ApplicationStage.SCREENING,
  ApplicationStage.INTERVIEW,
  ApplicationStage.TECHNICAL_ROUND,
  ApplicationStage.HR_ROUND,
  ApplicationStage.OFFER,
  ApplicationStage.REJECTED,
  ApplicationStage.HIRED,
]);

export const matchCategoryEnum = pgEnum('match_category', [
  MatchCategory.STRONG_MATCH,
  MatchCategory.GOOD_MATCH,
  MatchCategory.PARTIAL_MATCH,
  MatchCategory.WEAK_MATCH,
]);

export const referralStatusEnum = pgEnum('referral_status', [
  ReferralStatus.PENDING,
  ReferralStatus.ACCEPTED,
  ReferralStatus.REJECTED,
  ReferralStatus.HIRED,
]);

export const hiringInterviewTypeEnum = pgEnum('hiring_interview_type', [
  HiringInterviewType.SCREENING,
  HiringInterviewType.TECHNICAL,
  HiringInterviewType.SYSTEM_DESIGN,
  HiringInterviewType.BEHAVIORAL,
  HiringInterviewType.HR,
]);

export const hiringInterviewStatusEnum = pgEnum('hiring_interview_status', [
  HiringInterviewStatus.SCHEDULED,
  HiringInterviewStatus.COMPLETED,
  HiringInterviewStatus.CANCELLED,
  HiringInterviewStatus.NO_SHOW,
]);

export const offerRecommendationEnum = pgEnum('offer_recommendation', [
  OfferRecommendation.STRONG_HIRE,
  OfferRecommendation.HIRE,
  OfferRecommendation.LEAN_HIRE,
  OfferRecommendation.LEAN_NO_HIRE,
  OfferRecommendation.NO_HIRE,
]);

export const orgMemberRoleEnum = pgEnum('org_member_role', [
  OrgMemberRole.OWNER,
  OrgMemberRole.ADMIN,
  OrgMemberRole.MANAGER,
  OrgMemberRole.FACULTY,
  OrgMemberRole.MENTOR,
  OrgMemberRole.STUDENT,
  OrgMemberRole.RECRUITER,
  OrgMemberRole.MEMBER,
]);

export const orgPlanEnum = pgEnum('org_plan', [
  OrgPlan.STARTER,
  OrgPlan.PROFESSIONAL,
  OrgPlan.ENTERPRISE,
  OrgPlan.UNIVERSITY,
]);

export const cohortStatusEnum = pgEnum('cohort_status', [
  CohortStatus.UPCOMING,
  CohortStatus.ACTIVE,
  CohortStatus.COMPLETED,
  CohortStatus.ARCHIVED,
]);

export const courseLevelEnum = pgEnum('course_level', [
  CourseLevel.BEGINNER,
  CourseLevel.INTERMEDIATE,
  CourseLevel.ADVANCED,
]);

export const courseStatusEnum = pgEnum('course_status', [
  CourseStatus.DRAFT,
  CourseStatus.PUBLISHED,
  CourseStatus.ARCHIVED,
]);

export const courseEnrollmentStatusEnum = pgEnum('course_enrollment_status', [
  CourseEnrollmentStatus.ENROLLED,
  CourseEnrollmentStatus.IN_PROGRESS,
  CourseEnrollmentStatus.COMPLETED,
  CourseEnrollmentStatus.DROPPED,
]);

export const mentorSessionStatusEnum = pgEnum('mentor_session_status', [
  MentorSessionStatus.SCHEDULED,
  MentorSessionStatus.COMPLETED,
  MentorSessionStatus.CANCELLED,
  MentorSessionStatus.NO_SHOW,
]);

export const studentPlacementStatusEnum = pgEnum('student_placement_status', [
  StudentPlacementStatus.UNPLACED,
  StudentPlacementStatus.IN_PROCESS,
  StudentPlacementStatus.PLACED,
  StudentPlacementStatus.OPTED_OUT,
]);

export const certificationStatusEnum = pgEnum('certification_status', [
  CertificationStatus.ACTIVE,
  CertificationStatus.EXPIRED,
  CertificationStatus.REVOKED,
]);

export const riskLevelEnum = pgEnum('risk_level', [
  RiskLevel.LOW,
  RiskLevel.MEDIUM,
  RiskLevel.HIGH,
  RiskLevel.CRITICAL,
]);

export const recommendationCategoryEnum = pgEnum('recommendation_category', [
  RecommendationCategory.CURRICULUM,
  RecommendationCategory.STUDENT_INTERVENTION,
  RecommendationCategory.FACULTY_ALLOCATION,
  RecommendationCategory.PLACEMENT_PIPELINE,
  RecommendationCategory.RESOURCE_SCALING,
]);

// Phase 12: AI Career Operating System (Career OS) pgEnums
export const skillDemandCategoryEnum = pgEnum('skill_demand_category', [
  SkillDemandCategory.EXPLODING,
  SkillDemandCategory.GROWING,
  SkillDemandCategory.STABLE,
  SkillDemandCategory.DECLINING,
  SkillDemandCategory.OBSOLETE,
]);

export const forecastHorizonEnum = pgEnum('forecast_horizon', [
  ForecastHorizon.MONTHS_6,
  ForecastHorizon.YEAR_1,
  ForecastHorizon.YEARS_3,
  ForecastHorizon.YEARS_5,
]);

export const careerGoalTypeEnum = pgEnum('career_goal_type', [
  CareerGoalType.SHORT_TERM,
  CareerGoalType.MID_TERM,
  CareerGoalType.LONG_TERM,
  CareerGoalType.PROMOTION,
  CareerGoalType.SALARY,
  CareerGoalType.LEARNING,
  CareerGoalType.LEADERSHIP,
]);

export const careerGoalStatusEnum = pgEnum('career_goal_status', [
  CareerGoalStatus.IN_PROGRESS,
  CareerGoalStatus.ACHIEVED,
  CareerGoalStatus.PAUSED,
  CareerGoalStatus.ABANDONED,
]);

export const careerEventTypeEnum = pgEnum('career_event_type', [
  CareerEventType.PROMOTION,
  CareerEventType.CERTIFICATION,
  CareerEventType.INTERVIEW,
  CareerEventType.JOB_CHANGE,
  CareerEventType.LEARNING_ACHIEVEMENT,
  CareerEventType.CONTEST_ACHIEVEMENT,
  CareerEventType.PLACEMENT_MILESTONE,
  CareerEventType.ASSESSMENT,
  CareerEventType.SALARY_UPDATE,
]);

export const networkRelationTypeEnum = pgEnum('network_relation_type', [
  NetworkRelationType.MENTOR,
  NetworkRelationType.RECRUITER,
  NetworkRelationType.HIRING_MANAGER,
  NetworkRelationType.ALUMNI,
  NetworkRelationType.PEER_ENGINEER,
  NetworkRelationType.COLLABORATOR,
]);

export const coachingFrequencyEnum = pgEnum('coaching_frequency', [
  CoachingFrequency.WEEKLY,
  CoachingFrequency.MONTHLY,
  CoachingFrequency.QUARTERLY,
]);

export const careerRiskAlertLevelEnum = pgEnum('career_risk_alert_level', [
  CareerRiskAlertLevel.LOW,
  CareerRiskAlertLevel.MEDIUM,
  CareerRiskAlertLevel.HIGH,
  CareerRiskAlertLevel.CRITICAL,
]);

// Phase 13: Agentic AI Workspace pgEnums
export const agentTypeEnum = pgEnum('agent_type', [
  AgentType.CAREER_AGENT,
  AgentType.CODING_AGENT,
  AgentType.RESEARCH_AGENT,
  AgentType.LEARNING_AGENT,
  AgentType.PLACEMENT_AGENT,
  AgentType.INTERVIEW_AGENT,
  AgentType.MENTOR_AGENT,
  AgentType.EXECUTIVE_ANALYTICS_AGENT,
]);

export const agentStatusEnum = pgEnum('agent_status', [
  AgentStatus.IDLE,
  AgentStatus.PLANNING,
  AgentStatus.EXECUTING,
  AgentStatus.WAITING,
  AgentStatus.COMPLETED,
  AgentStatus.PAUSED,
  AgentStatus.FAILED,
]);

export const agentTaskPriorityEnum = pgEnum('agent_task_priority', [
  AgentTaskPriority.LOW,
  AgentTaskPriority.MEDIUM,
  AgentTaskPriority.HIGH,
  AgentTaskPriority.CRITICAL,
]);

export const workflowStatusEnum = pgEnum('workflow_status', [
  WorkflowStatus.ACTIVE,
  WorkflowStatus.PAUSED,
  WorkflowStatus.RUNNING,
  WorkflowStatus.COMPLETED,
  WorkflowStatus.CANCELLED,
]);

export const workflowTriggerTypeEnum = pgEnum('workflow_trigger_type', [
  WorkflowTriggerType.MANUAL,
  WorkflowTriggerType.SCHEDULED_CRON,
  WorkflowTriggerType.EVENT_DRIVEN,
  WorkflowTriggerType.GOAL_BASED,
]);

export const memoryTypeEnum = pgEnum('memory_type', [
  MemoryType.LONG_TERM,
  MemoryType.EPISODIC,
  MemoryType.SEMANTIC,
  MemoryType.CAREER,
  MemoryType.LEARNING,
]);

export const knowledgeNodeTypeEnum = pgEnum('knowledge_node_type', [
  KnowledgeNodeType.CONCEPT,
  KnowledgeNodeType.SKILL,
  KnowledgeNodeType.PROJECT,
  KnowledgeNodeType.COMPANY,
  KnowledgeNodeType.ROLE,
  KnowledgeNodeType.CERTIFICATION,
  KnowledgeNodeType.RESEARCH_PAPER,
]);

export const knowledgeRelationTypeEnum = pgEnum('knowledge_relation_type', [
  KnowledgeRelationType.REQUIRES,
  KnowledgeRelationType.ENABLES,
  KnowledgeRelationType.COMPLEMENTS,
  KnowledgeRelationType.APPLIED_IN,
  KnowledgeRelationType.HIRED_FOR,
  KnowledgeRelationType.AUTHORED_IN,
]);

export const documentTypeEnum = pgEnum('document_type', [
  DocumentType.RESUME,
  DocumentType.RESEARCH_PAPER,
  DocumentType.COURSE_MATERIAL,
  DocumentType.INTERVIEW_NOTES,
  DocumentType.ENTERPRISE_REPORT,
]);

export const decisionTypeEnum = pgEnum('decision_type', [
  DecisionType.CAREER_TRANSITION,
  DecisionType.JOB_OFFER_EVALUATION,
  DecisionType.LEARNING_ROI,
  DecisionType.SALARY_NEGOTIATION,
  DecisionType.SKILL_UPGRADE,
]);



