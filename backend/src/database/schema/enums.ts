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
  KnowledgeNodeType.THEORY,
  KnowledgeNodeType.ALGORITHM,
  KnowledgeNodeType.DATASET,
  KnowledgeNodeType.BENCHMARK,
  KnowledgeNodeType.THEOREM,
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

// Phase 14 pgEnums
export const marketplaceCategoryEnum = pgEnum('marketplace_category', [
  MarketplaceCategory.CAREER,
  MarketplaceCategory.CODING,
  MarketplaceCategory.LEARNING,
  MarketplaceCategory.RESEARCH,
  MarketplaceCategory.HIRING,
  MarketplaceCategory.PRODUCTIVITY,
  MarketplaceCategory.ENTERPRISE,
  MarketplaceCategory.ANALYTICS,
]);

export const pricingModelEnum = pgEnum('pricing_model', [
  PricingModel.FREE,
  PricingModel.FREEMIUM,
  PricingModel.PAID_ONE_TIME,
  PricingModel.SUBSCRIPTION,
]);

export const agentVerificationStatusEnum = pgEnum('agent_verification_status', [
  AgentVerificationStatus.UNVERIFIED,
  AgentVerificationStatus.COMMUNITY,
  AgentVerificationStatus.VERIFIED,
  AgentVerificationStatus.OFFICIAL_FEATURED,
  AgentVerificationStatus.ENTERPRISE_APPROVED,
]);

export const pluginTypeEnum = pgEnum('plugin_type', [
  PluginType.AI_TOOL,
  PluginType.INTEGRATION,
  PluginType.WORKFLOW_EXTENSION,
  PluginType.ANALYTICS_EXTENSION,
  PluginType.ENTERPRISE_EXTENSION,
]);

export const pluginPermissionEnum = pgEnum('plugin_permission', [
  PluginPermission.READ_WORKSPACE,
  PluginPermission.WRITE_WORKSPACE,
  PluginPermission.NETWORK_ACCESS,
  PluginPermission.EXECUTE_CODE,
  PluginPermission.ACCESS_MEMORY,
  PluginPermission.DATABASE_ACCESS,
  PluginPermission.WEBHOOK_SEND,
]);

export const integrationProviderEnum = pgEnum('integration_provider', [
  IntegrationProvider.GITHUB,
  IntegrationProvider.GITLAB,
  IntegrationProvider.JIRA,
  IntegrationProvider.NOTION,
  IntegrationProvider.SLACK,
  IntegrationProvider.DISCORD,
  IntegrationProvider.GOOGLE_DRIVE,
  IntegrationProvider.GOOGLE_CALENDAR,
  IntegrationProvider.MS_TEAMS,
  IntegrationProvider.LINKEDIN,
]);

export const integrationStatusEnum = pgEnum('integration_status', [
  IntegrationStatus.CONNECTED,
  IntegrationStatus.DISCONNECTED,
  IntegrationStatus.SYNCING,
  IntegrationStatus.ERROR,
]);

export const workflowCategoryEnum = pgEnum('workflow_category', [
  WorkflowCategory.INTERVIEW_PREP,
  WorkflowCategory.PLACEMENT_READINESS,
  WorkflowCategory.CAREER_PLANNING,
  WorkflowCategory.LEARNING_ROADMAP,
  WorkflowCategory.SPRINT_PLANNING,
  WorkflowCategory.SECURITY_AUDIT,
  WorkflowCategory.DEVOPS_AUTOMATION,
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.CANCELED,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.EXPIRED,
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  TransactionType.AGENT_PURCHASE,
  TransactionType.PLUGIN_PURCHASE,
  TransactionType.SUBSCRIPTION_RENEWAL,
  TransactionType.CREATOR_PAYOUT,
  TransactionType.API_USAGE_CHARGE,
]);

export const webhookEventEnum = pgEnum('webhook_event', [
  WebhookEvent.AGENT_EXECUTED,
  WebhookEvent.WORKFLOW_TRIGGERED,
  WebhookEvent.TASK_COMPLETED,
  WebhookEvent.JOB_APPLIED,
  WebhookEvent.CERT_ISSUED,
  WebhookEvent.PAYMENT_SUCCEEDED,
]);

// ==========================================
// PHASE 15: AI OPERATING SYSTEM pgEnums
// ==========================================

export const agentCloudStateEnum = pgEnum('agent_cloud_state', [
  AgentCloudState.CREATED,
  AgentCloudState.QUEUED,
  AgentCloudState.RUNNING,
  AgentCloudState.PAUSED,
  AgentCloudState.WAITING,
  AgentCloudState.FAILED,
  AgentCloudState.COMPLETED,
  AgentCloudState.TERMINATED,
]);

export const distributedWorkflowTypeEnum = pgEnum('distributed_workflow_type', [
  DistributedWorkflowType.CAREER_WORKFLOW,
  DistributedWorkflowType.LEARNING_WORKFLOW,
  DistributedWorkflowType.HIRING_WORKFLOW,
  DistributedWorkflowType.RESEARCH_WORKFLOW,
  DistributedWorkflowType.PROJECT_WORKFLOW,
  DistributedWorkflowType.ENTERPRISE_WORKFLOW,
]);

export const workflowRunStatusEnum = pgEnum('workflow_run_status', [
  WorkflowRunStatus.PENDING,
  WorkflowRunStatus.RUNNING,
  WorkflowRunStatus.PAUSED,
  WorkflowRunStatus.FAILED,
  WorkflowRunStatus.COMPLETED,
  WorkflowRunStatus.CANCELLED,
]);

export const workflowStepStatusEnum = pgEnum('workflow_step_status', [
  WorkflowStepStatus.PENDING,
  WorkflowStepStatus.RUNNING,
  WorkflowStepStatus.SKIPPED,
  WorkflowStepStatus.FAILED,
  WorkflowStepStatus.COMPLETED,
]);

export const globalEventTypeEnum = pgEnum('global_event_type', [
  GlobalEventType.USER_ACTION,
  GlobalEventType.PROJECT_UPDATED,
  GlobalEventType.COURSE_COMPLETED,
  GlobalEventType.ASSESSMENT_COMPLETED,
  GlobalEventType.JOB_APPLIED,
  GlobalEventType.INTERVIEW_SCHEDULED,
  GlobalEventType.CERTIFICATION_EARNED,
  GlobalEventType.WORKFLOW_COMPLETED,
  GlobalEventType.AGENT_COMPLETED,
  GlobalEventType.PLUGIN_INSTALLED,
]);

export const workforceAgentRoleEnum = pgEnum('workforce_agent_role', [
  WorkforceAgentRole.CAREER_AGENT,
  WorkforceAgentRole.RESEARCH_AGENT,
  WorkforceAgentRole.RECRUITER_AGENT,
  WorkforceAgentRole.FACULTY_AGENT,
  WorkforceAgentRole.MENTOR_AGENT,
  WorkforceAgentRole.ANALYTICS_AGENT,
  WorkforceAgentRole.PROJECT_MANAGER_AGENT,
  WorkforceAgentRole.EXECUTIVE_AGENT,
]);

export const taskOSPriorityEnum = pgEnum('task_os_priority', [
  TaskOSPriority.CRITICAL,
  TaskOSPriority.HIGH,
  TaskOSPriority.MEDIUM,
  TaskOSPriority.LOW,
]);

export const taskOSStatusEnum = pgEnum('task_os_status', [
  TaskOSStatus.BACKLOG,
  TaskOSStatus.TODO,
  TaskOSStatus.IN_PROGRESS,
  TaskOSStatus.IN_REVIEW,
  TaskOSStatus.DONE,
  TaskOSStatus.BLOCKED,
]);

export const memoryFabricTypeEnum = pgEnum('memory_fabric_type', [
  MemoryFabricType.CROSS_AGENT,
  MemoryFabricType.ORGANIZATIONAL,
  MemoryFabricType.TEAM,
  MemoryFabricType.LONG_TERM,
  MemoryFabricType.EPISODIC,
  MemoryFabricType.SEMANTIC,
]);

export const knowledgeGraphDomainEnum = pgEnum('knowledge_graph_domain', [
  KnowledgeGraphDomain.GLOBAL,
  KnowledgeGraphDomain.CAREER,
  KnowledgeGraphDomain.LEARNING,
  KnowledgeGraphDomain.ENTERPRISE,
  KnowledgeGraphDomain.RESEARCH,
]);

export const decisionCenterStatusEnum = pgEnum('decision_center_status', [
  DecisionCenterStatus.DRAFT,
  DecisionCenterStatus.ANALYZING,
  DecisionCenterStatus.RECOMMENDED,
  DecisionCenterStatus.APPROVED,
  DecisionCenterStatus.EXECUTED,
  DecisionCenterStatus.DISMISSED,
]);

export const telemetryMetricTypeEnum = pgEnum('telemetry_metric_type', [
  TelemetryMetricType.EXECUTION_TIME,
  TelemetryMetricType.TOKEN_USAGE,
  TelemetryMetricType.ERROR_RATE,
  TelemetryMetricType.CPU_UTILIZATION,
  TelemetryMetricType.MEMORY_USAGE,
  TelemetryMetricType.COST_USD,
]);

// ==========================================
// PHASE 16: GLOBAL AI ECOSYSTEM pgEnums
// ==========================================

export const globalNodeTypeEnum = pgEnum('global_node_type', [
  GlobalNodeType.USER,
  GlobalNodeType.ORGANIZATION,
  GlobalNodeType.UNIVERSITY,
  GlobalNodeType.AGENT,
  GlobalNodeType.TALENT,
  GlobalNodeType.RESEARCH_LAB,
  GlobalNodeType.STARTUP,
]);

export const globalEdgeTypeEnum = pgEnum('global_edge_type', [
  GlobalEdgeType.COLLABORATES_WITH,
  GlobalEdgeType.EMPLOYS,
  GlobalEdgeType.AFFILIATED_WITH,
  GlobalEdgeType.CITES,
  GlobalEdgeType.MENTORS,
  GlobalEdgeType.INVESTS_IN,
  GlobalEdgeType.DEPLOYS,
]);

export const verificationStatusEnum = pgEnum('verification_status', [
  VerificationStatus.PENDING,
  VerificationStatus.VERIFIED,
  VerificationStatus.REJECTED,
  VerificationStatus.EXPIRED,
]);

export const publicationStatusEnum = pgEnum('publication_status', [
  PublicationStatus.DRAFT,
  PublicationStatus.SUBMITTED,
  PublicationStatus.PEER_REVIEWED,
  PublicationStatus.PUBLISHED,
  PublicationStatus.ARCHIVED,
]);

export const digitalTwinTypeEnum = pgEnum('digital_twin_type', [
  DigitalTwinType.USER_TWIN,
  DigitalTwinType.CAREER_TWIN,
  DigitalTwinType.LEARNING_TWIN,
  DigitalTwinType.ENTERPRISE_TWIN,
  DigitalTwinType.ORGANIZATION_TWIN,
  DigitalTwinType.AGENT_TWIN,
]);

export const reputationTierEnum = pgEnum('reputation_tier', [
  ReputationTier.NOVICE,
  ReputationTier.CONTRIBUTOR,
  ReputationTier.EXPERT,
  ReputationTier.MASTER,
  ReputationTier.FELLOW,
  ReputationTier.LUMINARY,
]);

export const ventureStageEnum = pgEnum('venture_stage', [
  VentureStage.IDEA,
  VentureStage.PROTOTYPE,
  VentureStage.MVP,
  VentureStage.SEED,
  VentureStage.SERIES_A,
  VentureStage.ENTERPRISE,
]);

export const superintelligenceScopeEnum = pgEnum('superintelligence_scope', [
  SuperintelligenceScope.ECOSYSTEM,
  SuperintelligenceScope.STRATEGIC,
  SuperintelligenceScope.TALENT,
  SuperintelligenceScope.RESEARCH,
  SuperintelligenceScope.VENTURE,
  SuperintelligenceScope.RISK,
]);

export const trendCategoryEnum = pgEnum('trend_category', [
  TrendCategory.SKILL_DEMAND,
  TrendCategory.EMERGING_TECH,
  TrendCategory.HIRING_VELOCITY,
  TrendCategory.RESEARCH_BREAKTHROUGH,
  TrendCategory.STARTUP_TREND,
]);

export const ecosystemEventCategoryEnum = pgEnum('ecosystem_event_category', [
  EcosystemEventCategory.CONSENSUS_REACHED,
  EcosystemEventCategory.TWIN_SIMULATION,
  EcosystemEventCategory.SKILL_VERIFIED,
  EcosystemEventCategory.VENTURE_LAUNCHED,
  EcosystemEventCategory.RESEARCH_PUBLISHED,
]);

// Phase 17: Planetary Intelligence pgEnums
export const planetaryTwinTypeEnum = pgEnum('planetary_twin_type', [
  PlanetaryTwinType.GLOBAL_ECONOMY,
  PlanetaryTwinType.EDUCATION,
  PlanetaryTwinType.WORKFORCE,
  PlanetaryTwinType.RESEARCH,
  PlanetaryTwinType.ENTERPRISE,
  PlanetaryTwinType.INNOVATION,
]);

export const civilizationHealthTierEnum = pgEnum('civilization_health_tier', [
  CivilizationHealthTier.PRISTINE,
  CivilizationHealthTier.ADVANCING,
  CivilizationHealthTier.STABLE,
  CivilizationHealthTier.AT_RISK,
  CivilizationHealthTier.CRITICAL,
]);

export const governanceCouncilTypeEnum = pgEnum('governance_council_type', [
  GovernanceCouncilType.ETHICAL_AI,
  GovernanceCouncilType.SECURITY_COMPLIANCE,
  GovernanceCouncilType.DATA_SOVEREIGNTY,
  GovernanceCouncilType.RESEARCH_INTEGRITY,
  GovernanceCouncilType.ECONOMIC_STABILITY,
]);

export const policyStatusEnum = pgEnum('policy_status', [
  PolicyStatus.PROPOSED,
  PolicyStatus.SIMULATED,
  PolicyStatus.ACTIVE,
  PolicyStatus.REVISED,
  PolicyStatus.DEPRECATED,
]);

export const innovationDomainEnum = pgEnum('innovation_domain', [
  InnovationDomain.AI_REASONING,
  InnovationDomain.QUANTUM_COMPUTE,
  InnovationDomain.AUTONOMOUS_SYSTEMS,
  InnovationDomain.CLEANTECH,
  InnovationDomain.BIOTECH,
  InnovationDomain.CYBERSECURITY,
  InnovationDomain.DISTRIBUTED_SYSTEMS,
]);

export const federationProtocolEnum = pgEnum('federation_protocol', [
  FederationProtocol.MULTI_AGENT_CONSENSUS,
  FederationProtocol.SECURE_RPC,
  FederationProtocol.DECENTRALIZED_KNOWLEDGE,
  FederationProtocol.CROSS_CLUSTER_REPLICATION,
]);

export const agentFederationStatusEnum = pgEnum('agent_federation_status', [
  AgentFederationStatus.ONLINE,
  AgentFederationStatus.NEGOTIATING,
  AgentFederationStatus.SYNCING,
  AgentFederationStatus.DELEGATING,
  AgentFederationStatus.ISOLATED,
]);

export const economicSignalTypeEnum = pgEnum('economic_signal_type', [
  EconomicSignalType.TALENT_INFLOW,
  EconomicSignalType.SKILL_PREMIUM,
  EconomicSignalType.COMPUTE_DEMAND,
  EconomicSignalType.STARTUP_CAPITAL,
  EconomicSignalType.CREATOR_YIELD,
]);

export const foresightHorizonEnum = pgEnum('foresight_horizon', [
  ForesightHorizon.ONE_YEAR,
  ForesightHorizon.FIVE_YEAR,
  ForesightHorizon.TEN_YEAR,
]);

export const planetaryEventCategoryEnum = pgEnum('planetary_event_category', [
  PlanetaryEventCategory.CIVILIZATION_PULSE,
  PlanetaryEventCategory.POLICY_ENACTED,
  PlanetaryEventCategory.TWIN_CALIBRATED,
  PlanetaryEventCategory.INNOVATION_PATENTED,
  PlanetaryEventCategory.FEDERATION_FORMED,
  PlanetaryEventCategory.FORESIGHT_UPDATED,
]);

// Phase 18 Cognitive OS & Autonomous Superintelligence Core pgEnums
export const cognitiveGoalStatusEnum = pgEnum('cognitive_goal_status', [
  CognitiveGoalStatus.PENDING,
  CognitiveGoalStatus.PLANNING,
  CognitiveGoalStatus.EXECUTING,
  CognitiveGoalStatus.EVALUATING,
  CognitiveGoalStatus.COMPLETED,
  CognitiveGoalStatus.FAILED,
  CognitiveGoalStatus.ABANDONED,
]);

export const reasoningStrategyEnum = pgEnum('reasoning_strategy', [
  ReasoningStrategy.DEDUCTIVE,
  ReasoningStrategy.INDUCTIVE,
  ReasoningStrategy.ABDUCTIVE,
  ReasoningStrategy.ANALOGICAL,
  ReasoningStrategy.DIALECTIC,
  ReasoningStrategy.FIRST_PRINCIPLES,
  ReasoningStrategy.MONTE_CARLO_TREE,
]);

export const cognitiveMemoryTypeEnum = pgEnum('cognitive_memory_type', [
  CognitiveMemoryType.WORKING,
  CognitiveMemoryType.EPISODIC,
  CognitiveMemoryType.SEMANTIC,
  CognitiveMemoryType.PROCEDURAL,
  CognitiveMemoryType.STRATEGIC,
]);

export const agentCouncilTypeEnum = pgEnum('agent_council_type', [
  AgentCouncilType.ENGINEERING_COUNCIL,
  AgentCouncilType.RESEARCH_COUNCIL,
  AgentCouncilType.CAREER_COUNCIL,
  AgentCouncilType.EDUCATION_COUNCIL,
  AgentCouncilType.EXECUTIVE_COUNCIL,
]);

export const consensusStatusEnum = pgEnum('consensus_status', [
  ConsensusStatus.DELIBERATING,
  ConsensusStatus.CONVERGED,
  ConsensusStatus.DEADLOCKED,
  ConsensusStatus.OVERRIDDEN,
  ConsensusStatus.RATIFIED,
]);

export const predictionHorizonEnum = pgEnum('prediction_horizon', [
  PredictionHorizon.SEVEN_DAYS,
  PredictionHorizon.THIRTY_DAYS,
  PredictionHorizon.NINETY_DAYS,
  PredictionHorizon.ONE_YEAR,
  PredictionHorizon.THREE_YEARS,
  PredictionHorizon.FIVE_YEARS,
]);

export const executionLoopStateEnum = pgEnum('execution_loop_state', [
  ExecutionLoopState.EXECUTE,
  ExecutionLoopState.OBSERVE,
  ExecutionLoopState.REFLECT,
  ExecutionLoopState.IMPROVE,
  ExecutionLoopState.RETRY,
  ExecutionLoopState.TERMINATED,
]);

export const selfImprovementDomainEnum = pgEnum('self_improvement_domain', [
  SelfImprovementDomain.AGENT_WEIGHTS,
  SelfImprovementDomain.PROMPT_TOPOLOGY,
  SelfImprovementDomain.WORKFLOW_ROUTING,
  SelfImprovementDomain.KNOWLEDGE_INDEX,
  SelfImprovementDomain.LATENCY_TUNING,
]);

export const metacognitionConfidenceEnum = pgEnum('metacognition_confidence', [
  MetacognitionConfidence.VERY_LOW,
  MetacognitionConfidence.LOW,
  MetacognitionConfidence.MODERATE,
  MetacognitionConfidence.HIGH,
  MetacognitionConfidence.CERTAIN,
]);

export const strategicPriorityEnum = pgEnum('strategic_priority', [
  StrategicPriority.CRITICAL,
  StrategicPriority.HIGH,
  StrategicPriority.MEDIUM,
  StrategicPriority.LOW,
  StrategicPriority.EXPLORATORY,
]);

// Phase 19 Autonomous Enterprise Civilization & AI Workforce pgEnums
export const organizationCivilizationTypeEnum = pgEnum('organization_civilization_type', [
  OrganizationCivilizationType.ENTERPRISE,
  OrganizationCivilizationType.STARTUP,
  OrganizationCivilizationType.RESEARCH_LAB,
  OrganizationCivilizationType.VENTURE_STUDIO,
  OrganizationCivilizationType.DAO,
  OrganizationCivilizationType.CIVILIZATION_NODE,
]);

export const digitalEmployeeRoleEnum = pgEnum('digital_employee_role', [
  DigitalEmployeeRole.AI_ENGINEER,
  DigitalEmployeeRole.AI_RESEARCHER,
  DigitalEmployeeRole.AI_PRODUCT_MANAGER,
  DigitalEmployeeRole.AI_DESIGNER,
  DigitalEmployeeRole.AI_ANALYST,
  DigitalEmployeeRole.AI_EXECUTIVE,
]);

export const employeeEmploymentStatusEnum = pgEnum('employee_employment_status', [
  EmployeeEmploymentStatus.ACTIVE,
  EmployeeEmploymentStatus.PROVISIONING,
  EmployeeEmploymentStatus.REALLOCATED,
  EmployeeEmploymentStatus.BENCH,
  EmployeeEmploymentStatus.DECOMMISSIONED,
]);

export const companyStageEnum = pgEnum('company_stage', [
  CompanyStage.IDEATION,
  CompanyStage.PRE_SEED,
  CompanyStage.SEED,
  CompanyStage.SERIES_A,
  CompanyStage.GROWTH,
  CompanyStage.EXPANSION,
  CompanyStage.AUTONOMOUS,
]);

export const productLifecycleStageEnum = pgEnum('product_lifecycle_stage', [
  ProductLifecycleStage.DISCOVERY,
  ProductLifecycleStage.VALIDATION,
  ProductLifecycleStage.ALPHA,
  ProductLifecycleStage.BETA,
  ProductLifecycleStage.GENERAL_AVAILABILITY,
  ProductLifecycleStage.DEPRECATED,
]);

export const enterpriseFederationTypeEnum = pgEnum('enterprise_federation_type', [
  EnterpriseFederationType.RESOURCE_SHARING,
  EnterpriseFederationType.TALENT_EXCHANGE,
  EnterpriseFederationType.JOINT_VENTURE,
  EnterpriseFederationType.RESEARCH_CONSORTIUM,
  EnterpriseFederationType.STRATEGIC_ALLIANCE,
]);

export const investmentReadinessTierEnum = pgEnum('investment_readiness_tier', [
  InvestmentReadinessTier.TIER_1_EXEMPLARY,
  InvestmentReadinessTier.TIER_2_INVESTABLE,
  InvestmentReadinessTier.TIER_3_INCUBATING,
  InvestmentReadinessTier.TIER_4_NEEDS_VALIDATION,
]);

export const executionNetworkTaskPriorityEnum = pgEnum('execution_network_task_priority', [
  ExecutionNetworkTaskPriority.CRITICAL_PATH,
  ExecutionNetworkTaskPriority.HIGH,
  ExecutionNetworkTaskPriority.NORMAL,
  ExecutionNetworkTaskPriority.SPECULATIVE,
]);

export const executionNetworkTaskStatusEnum = pgEnum('execution_network_task_status', [
  ExecutionNetworkTaskStatus.QUEUED,
  ExecutionNetworkTaskStatus.DELEGATED,
  ExecutionNetworkTaskStatus.EXECUTING,
  ExecutionNetworkTaskStatus.VERIFYING,
  ExecutionNetworkTaskStatus.COMPLETED,
  ExecutionNetworkTaskStatus.FAILED,
]);

export const economicSimulationScenarioEnum = pgEnum('economic_simulation_scenario', [
  EconomicSimulationScenario.BULL_MARKET,
  EconomicSimulationScenario.BEAR_MARKET,
  EconomicSimulationScenario.DISRUPTIVE_SHOCK,
  EconomicSimulationScenario.RESOURCE_SCARCITY,
  EconomicSimulationScenario.EQUILIBRIUM,
]);

// Phase 20 Autonomous Startup Builder & Venture Creation pgEnums
export const startupStageEnum = pgEnum('startup_stage', [
  StartupStage.IDEATION,
  StartupStage.VALIDATION,
  StartupStage.PROTOTYPE,
  StartupStage.MVP,
  StartupStage.GROWTH,
  StartupStage.SCALE,
]);

export const startupCategoryEnum = pgEnum('startup_category', [
  StartupCategory.AI_DEVTOOLS,
  StartupCategory.ENTERPRISE_INFRA,
  StartupCategory.FINTECH,
  StartupCategory.CYBERSECURITY,
  StartupCategory.CYBERSECURITY_AI,
  StartupCategory.HEALTH_AI,
  StartupCategory.AUTONOMOUS_AGENTS,
  StartupCategory.DEVELOPER_PLATFORM,
  StartupCategory.KNOWLEDGE_TECH,
  StartupCategory.DATA_INTELLIGENCE,
]);

export const marketRiskLevelEnum = pgEnum('market_risk_level', [
  MarketRiskLevel.LOW,
  MarketRiskLevel.MODERATE,
  MarketRiskLevel.HIGH,
  MarketRiskLevel.CRITICAL,
]);

export const incubationPhaseEnum = pgEnum('incubation_phase', [
  IncubationPhase.IDEA,
  IncubationPhase.CONCEPT,
  IncubationPhase.VALIDATION,
  IncubationPhase.PROTOTYPE,
  IncubationPhase.MVP,
  IncubationPhase.GROWTH,
  IncubationPhase.SCALE,
]);

export const customerPersonaTypeEnum = pgEnum('customer_persona_type', [
  CustomerPersonaType.ENTERPRISE_ARCHITECT,
  CustomerPersonaType.STARTUP_CTO,
  CustomerPersonaType.INDIE_DEVELOPER,
  CustomerPersonaType.DEVSECOPS_LEAD,
  CustomerPersonaType.RESEARCH_SCIENTIST,
  CustomerPersonaType.SECURITY_OFFICER,
  CustomerPersonaType.ENGINEERING_VP,
]);

export const growthChannelEnum = pgEnum('growth_channel', [
  GrowthChannel.PRODUCT_LED,
  GrowthChannel.COMMUNITY,
  GrowthChannel.DIRECT_SALES,
  GrowthChannel.DEVELOPER_ECOSYSTEM,
  GrowthChannel.PARTNERSHIPS,
  GrowthChannel.VIRAL_REFERRAL,
]);

export const ventureHealthStatusEnum = pgEnum('venture_health_status', [
  VentureHealthStatus.THRIVING,
  VentureHealthStatus.ON_TRACK,
  VentureHealthStatus.NEEDS_ATTENTION,
  VentureHealthStatus.PIVOT_REQUIRED,
  VentureHealthStatus.DISTRESSED,
]);

export const startupFundingStageEnum = pgEnum('startup_funding_stage', [
  StartupFundingStage.PRE_SEED,
  StartupFundingStage.SEED,
  StartupFundingStage.SERIES_A,
  StartupFundingStage.SERIES_B,
  StartupFundingStage.SERIES_C,
  StartupFundingStage.GROWTH,
]);

export const investorTypeEnum = pgEnum('investor_type', [
  InvestorType.ANGEL,
  InvestorType.VENTURE_CAPITAL,
  InvestorType.SOVEREIGN_FUND,
  InvestorType.CORPORATE_VC,
  InvestorType.SYNDICATE,
]);

export const startupEventTypeEnum = pgEnum('startup_event_type', [
  StartupEventType.IDEA_CREATED,
  StartupEventType.CREATED,
  StartupEventType.MARKET_VALIDATED,
  StartupEventType.MVP_LAUNCHED,
  StartupEventType.PMF_ACHIEVED,
  StartupEventType.FUNDING_ROUND_OPENED,
  StartupEventType.FUNDING_CLOSED,
  StartupEventType.PIVOT_EXECUTED,
  StartupEventType.PIVOT,
  StartupEventType.STAGE_TRANSITION,
  StartupEventType.SCALE_MILESTONE,
]);

// Phase 21: Venture Capital Intelligence & Autonomous Investment Network
export const dealStageEnum = pgEnum('deal_stage', [
  DealStage.INBOX,
  DealStage.SCREENING,
  DealStage.FIRST_CALL,
  DealStage.DUE_DILIGENCE,
  DealStage.PARTNER_MEETING,
  DealStage.TERM_SHEET,
  DealStage.LEGAL_CLOSING,
  DealStage.PASSED,
  DealStage.INVESTED,
  DealStage.LOST,
]);

export const dealPriorityEnum = pgEnum('deal_priority', [
  DealPriority.LOW,
  DealPriority.MEDIUM,
  DealPriority.HIGH,
  DealPriority.URGENT,
  DealPriority.HYPER_PRIORITY,
]);

export const diligenceCategoryEnum = pgEnum('diligence_category', [
  DiligenceCategory.TEAM_EVALUATION,
  DiligenceCategory.PRODUCT_DEFENSIBILITY,
  DiligenceCategory.MARKET_VALIDATION,
  DiligenceCategory.TECH_ARCHITECTURE,
  DiligenceCategory.FINANCIAL_MODEL,
  DiligenceCategory.LEGAL_RISK,
]);

export const diligenceRiskSeverityEnum = pgEnum('diligence_risk_severity', [
  DiligenceRiskSeverity.LOW,
  DiligenceRiskSeverity.MODERATE,
  DiligenceRiskSeverity.HIGH,
  DiligenceRiskSeverity.CRITICAL,
]);

export const investmentRecommendationEnum = pgEnum('investment_recommendation', [
  InvestmentRecommendation.STRONG_INVEST,
  InvestmentRecommendation.INVEST,
  InvestmentRecommendation.NEUTRAL,
  InvestmentRecommendation.PASS,
  InvestmentRecommendation.STRONG_PASS,
]);

export const committeeTypeEnum = pgEnum('committee_type', [
  CommitteeType.PARTNER_COMMITTEE,
  CommitteeType.TECHNICAL_COMMITTEE,
  CommitteeType.MARKET_COMMITTEE,
  CommitteeType.FINANCIAL_COMMITTEE,
]);

export const committeeVoteTypeEnum = pgEnum('committee_vote_type', [
  CommitteeVoteType.YES,
  CommitteeVoteType.NO,
  CommitteeVoteType.ABSTAIN,
  CommitteeVoteType.CONDITIONAL_YES,
]);

export const fundTypeEnum = pgEnum('fund_type', [
  FundType.VENTURE_FUND,
  FundType.ANGEL_SYNDICATE,
  FundType.ACCELERATOR_FUND,
  FundType.GROWTH_EQUITY,
  FundType.OPPORTUNITY_FUND,
]);

export const fundStatusEnum = pgEnum('fund_status', [
  FundStatus.FUNDRAISING,
  FundStatus.ACTIVELY_DEPLOYING,
  FundStatus.HARVESTING,
  FundStatus.FULLY_DEPLOYED,
  FundStatus.CLOSED,
]);

export const exitTypeEnum = pgEnum('exit_type', [
  ExitType.IPO,
  ExitType.STRATEGIC_ACQUISITION,
  ExitType.SECONDARY_SALE,
  ExitType.BUYBACK,
  ExitType.TOKEN_LIQUIDITY,
]);

export const exitStatusEnum = pgEnum('exit_status', [
  ExitStatus.PROPOSED,
  ExitStatus.SIMULATED,
  ExitStatus.NEGOTIATING,
  ExitStatus.IN_ESCROW,
  ExitStatus.COMPLETED,
  ExitStatus.ABORTED,
]);

export const allocationStrategyEnum = pgEnum('allocation_strategy', [
  AllocationStrategy.CONVICTION_WEIGHTED,
  AllocationStrategy.EQUAL_WEIGHTED,
  AllocationStrategy.BARBELL_STRATEGY,
  AllocationStrategy.STAGE_GRADUATED,
  AllocationStrategy.DYNAMIC_RESERVE,
  AllocationStrategy.BALANCED,
  AllocationStrategy.GROWTH_FOCUSED,
  AllocationStrategy.RESERVE_HEAVY,
]);

export const syndicateRoleEnum = pgEnum('syndicate_role', [
  SyndicateRole.LEAD_INVESTOR,
  SyndicateRole.CO_INVESTOR,
  SyndicateRole.SYNDICATE_LP,
  SyndicateRole.STRATEGIC_PARTNER,
  SyndicateRole.OBSERVER,
  SyndicateRole.CO_LEAD,
  SyndicateRole.PARTICIPANT,
]);

// ============================================================================
// Phase 22: Autonomous Research University & Scientific Knowledge Civilization pgEnums
// ============================================================================

export const academicDepartmentEnum = pgEnum('academic_department', [
  AcademicDepartment.COMPUTER_SCIENCE,
  AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
  AcademicDepartment.ENGINEERING,
  AcademicDepartment.MATHEMATICS,
  AcademicDepartment.BUSINESS,
  AcademicDepartment.ECONOMICS,
  AcademicDepartment.HEALTHCARE,
  AcademicDepartment.SOCIAL_SCIENCES,
]);

export const researchProgramStatusEnum = pgEnum('research_program_status', [
  ResearchProgramStatus.PROPOSED,
  ResearchProgramStatus.ACTIVE,
  ResearchProgramStatus.PEER_REVIEW,
  ResearchProgramStatus.PUBLISHED,
  ResearchProgramStatus.ARCHIVED,
]);

export const labTypeEnum = pgEnum('lab_type', [
  LabType.AI_RESEARCH_LAB,
  LabType.SYSTEMS_LAB,
  LabType.DATA_SCIENCE_LAB,
  LabType.ROBOTICS_LAB,
  LabType.FUTURE_TECHNOLOGIES_LAB,
]);

export const labStatusEnum = pgEnum('lab_status', [
  LabStatus.OPERATIONAL,
  LabStatus.MAINTENANCE,
  LabStatus.UPGRADING,
  LabStatus.OFFLINE,
]);

export const experimentStatusEnum = pgEnum('experiment_status', [
  ExperimentStatus.QUEUED,
  ExperimentStatus.RUNNING,
  ExperimentStatus.COMPLETED,
  ExperimentStatus.FAILED,
  ExperimentStatus.VERIFIED,
]);

export const hypothesisStatusEnum = pgEnum('hypothesis_status', [
  HypothesisStatus.FORMULATED,
  HypothesisStatus.TESTING,
  HypothesisStatus.VALIDATED,
  HypothesisStatus.REFUTED,
]);

export const discoverySignificanceEnum = pgEnum('discovery_significance', [
  DiscoverySignificance.INCREMENTAL,
  DiscoverySignificance.MODERATE,
  DiscoverySignificance.MAJOR,
  DiscoverySignificance.BREAKTHROUGH,
  DiscoverySignificance.PARADIGM_SHIFTING,
]);

export const publicationTypeEnum = pgEnum('publication_type', [
  PublicationType.RESEARCH_PAPER,
  PublicationType.TECHNICAL_REPORT,
  PublicationType.WHITE_PAPER,
  PublicationType.SURVEY_PAPER,
]);

export const peerReviewRoleEnum = pgEnum('peer_review_role', [
  PeerReviewRole.METHOD_REVIEWER,
  PeerReviewRole.STATISTICAL_REVIEWER,
  PeerReviewRole.DOMAIN_REVIEWER,
  PeerReviewRole.ETHICS_REVIEWER,
]);

export const peerReviewVerdictEnum = pgEnum('peer_review_verdict', [
  PeerReviewVerdict.ACCEPT,
  PeerReviewVerdict.MINOR_REVISION,
  PeerReviewVerdict.MAJOR_REVISION,
  PeerReviewVerdict.REJECT,
]);

export const grantTypeEnum = pgEnum('grant_type', [
  GrantType.GOVERNMENT_GRANT,
  GrantType.UNIVERSITY_GRANT,
  GrantType.INDUSTRY_GRANT,
  GrantType.FOUNDATION_GRANT,
]);

export const grantStatusEnum = pgEnum('grant_status', [
  GrantStatus.OPEN,
  GrantStatus.APPLIED,
  GrantStatus.AWARDED,
  GrantStatus.REJECTED,
  GrantStatus.CLOSED,
]);

// Phase 23: Autonomous Software Factory pgEnums
export const softwareProjectTypeEnum = pgEnum('software_project_type', [
  SoftwareProjectType.WEB_APP,
  SoftwareProjectType.MOBILE_APP,
  SoftwareProjectType.LIBRARY,
  SoftwareProjectType.API_SERVICE,
  SoftwareProjectType.CLI_TOOL,
  SoftwareProjectType.MICROSERVICE,
]);

export const softwareProjectStatusEnum = pgEnum('software_project_status', [
  SoftwareProjectStatus.PLANNING,
  SoftwareProjectStatus.GENERATING,
  SoftwareProjectStatus.TESTING,
  SoftwareProjectStatus.DEPLOYED,
  SoftwareProjectStatus.ARCHIVED,
]);

export const engineeringTaskTypeEnum = pgEnum('engineering_task_type', [
  EngineeringTaskType.REQUIREMENTS,
  EngineeringTaskType.ARCHITECTURE,
  EngineeringTaskType.CODING,
  EngineeringTaskType.TESTING,
  EngineeringTaskType.REFACTORING,
]);

export const engineeringTaskStatusEnum = pgEnum('engineering_task_status', [
  EngineeringTaskStatus.BACKLOG,
  EngineeringTaskStatus.IN_PROGRESS,
  EngineeringTaskStatus.REVIEW,
  EngineeringTaskStatus.COMPLETED,
  EngineeringTaskStatus.FAILED,
]);

export const artifactTypeEnum = pgEnum('artifact_type', [
  ArtifactType.SOURCE_CODE,
  ArtifactType.CONFIGURATION,
  ArtifactType.DOCUMENTATION,
  ArtifactType.TEST_SUITE,
  ArtifactType.BUILD_PACKAGE,
]);

export const blueprintComplexityEnum = pgEnum('blueprint_complexity', [
  BlueprintComplexity.SIMPLE,
  BlueprintComplexity.MEDIUM,
  BlueprintComplexity.COMPLEX,
  BlueprintComplexity.ENTERPRISE,
]);

// Phase 24: Autonomous AI Cloud Platform pgEnums
export const clusterRegionEnum = pgEnum('cluster_region', [
  ClusterRegion.US_EAST,
  ClusterRegion.US_WEST,
  ClusterRegion.EU_WEST,
  ClusterRegion.AP_EAST,
]);

export const clusterStatusEnum = pgEnum('cluster_status', [
  ClusterStatus.HEALTHY,
  ClusterStatus.DEGRADED,
  ClusterStatus.CRITICAL,
  ClusterStatus.MAINTENANCE,
]);

export const computeNodeTypeEnum = pgEnum('compute_node_type', [
  ComputeNodeType.GPU_H100,
  ComputeNodeType.GPU_A100,
  ComputeNodeType.TPU_V5,
  ComputeNodeType.CPU_HIGHMEM,
]);

export const computeNodeStatusEnum = pgEnum('compute_node_status', [
  ComputeNodeStatus.IDLE,
  ComputeNodeStatus.BUSY,
  ComputeNodeStatus.OFFLINE,
  ComputeNodeStatus.PROVISIONING,
]);

export const deploymentStatusEnum = pgEnum('deployment_status', [
  DeploymentStatus.QUEUED,
  DeploymentStatus.SCHEDULING,
  DeploymentStatus.RUNNING,
  DeploymentStatus.COMPLETED,
  DeploymentStatus.FAILED,
]);

export const workloadTypeEnum = pgEnum('workload_type', [
  WorkloadType.INFERENCE,
  WorkloadType.TRAINING,
  WorkloadType.FINE_TUNING,
  WorkloadType.AGENT_FLEET,
]);

export const assetTypeEnum = pgEnum('asset_type', [
  AssetType.IMAGE,
  AssetType.DOCUMENT,
  AssetType.VIDEO,
  AssetType.AUDIO,
]);

export const analysisStatusEnum = pgEnum('analysis_status', [
  AnalysisStatus.PENDING,
  AnalysisStatus.PROCESSING,
  AnalysisStatus.SUCCESS,
  AnalysisStatus.FAILED,
]);

export const reasoningComplexityEnum = pgEnum('reasoning_complexity', [
  ReasoningComplexity.BASIC,
  ReasoningComplexity.COGNITIVE,
  ReasoningComplexity.CROSS_MEDIA,
  ReasoningComplexity.HYPOTHESIS_GEN,
]);

export const threatSeverityEnum = pgEnum('threat_severity', [
  ThreatSeverity.LOW,
  ThreatSeverity.MEDIUM,
  ThreatSeverity.HIGH,
  ThreatSeverity.CRITICAL,
]);

export const threatStatusEnum = pgEnum('threat_status', [
  ThreatStatus.ACTIVE,
  ThreatStatus.INVESTIGATING,
  ThreatStatus.MITIGATED,
  ThreatStatus.FALSE_POSITIVE,
]);

export const vulnerabilityStatusEnum = pgEnum('vulnerability_status', [
  VulnerabilityStatus.OPEN,
  VulnerabilityStatus.PATCHED,
  VulnerabilityStatus.RISK_ACCEPTED,
  VulnerabilityStatus.REMEDIATING,
]);

export const incidentStatusEnum = pgEnum('incident_status', [
  IncidentStatus.OPEN,
  IncidentStatus.CONTAINED,
  IncidentStatus.RESOLVED,
  IncidentStatus.CLOSED,
]);

export const dataSourceTypeEnum = pgEnum('data_source_type', [
  DataSourceType.DATABASE,
  DataSourceType.FILE_UPLOAD,
  DataSourceType.API_STREAM,
  DataSourceType.CLOUD_STORAGE,
]);

export const analyticsJobStatusEnum = pgEnum('analytics_job_status', [
  AnalyticsJobStatus.PENDING,
  AnalyticsJobStatus.RUNNING,
  AnalyticsJobStatus.SUCCESS,
  AnalyticsJobStatus.FAILED,
]);

export const insightTypeEnum = pgEnum('insight_type', [
  InsightType.TREND,
  InsightType.ANOMALY,
  InsightType.KPI_MILESTONE,
  InsightType.FORECAST,
]);

export const qualityRatingEnum = pgEnum('quality_rating', [
  QualityRating.EXCELLENT,
  QualityRating.GOOD,
  QualityRating.POOR,
  QualityRating.CRITICAL,
]);





