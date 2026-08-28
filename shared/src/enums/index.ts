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

// Phase 11: Enterprise, University & LMS Enums
export enum OrgMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  FACULTY = 'faculty',
  MENTOR = 'mentor',
  STUDENT = 'student',
  RECRUITER = 'recruiter',
  MEMBER = 'member',
}

export enum OrgPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  UNIVERSITY = 'university',
}

export enum CohortStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CourseEnrollmentStatus {
  ENROLLED = 'enrolled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum MentorSessionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum StudentPlacementStatus {
  UNPLACED = 'unplaced',
  IN_PROCESS = 'in_process',
  PLACED = 'placed',
  OPTED_OUT = 'opted_out',
}

export enum CertificationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RecommendationCategory {
  CURRICULUM = 'curriculum',
  STUDENT_INTERVENTION = 'student_intervention',
  FACULTY_ALLOCATION = 'faculty_allocation',
  PLACEMENT_PIPELINE = 'placement_pipeline',
  RESOURCE_SCALING = 'resource_scaling',
}

// Phase 12: AI Career Operating System (Career OS)
export enum SkillDemandCategory {
  EXPLODING = 'exploding',
  GROWING = 'growing',
  STABLE = 'stable',
  DECLINING = 'declining',
  OBSOLETE = 'obsolete',
}

export enum ForecastHorizon {
  MONTHS_6 = '6_months',
  YEAR_1 = '1_year',
  YEARS_3 = '3_years',
  YEARS_5 = '5_years',
}

export enum CareerGoalType {
  SHORT_TERM = 'short_term',
  MID_TERM = 'mid_term',
  LONG_TERM = 'long_term',
  PROMOTION = 'promotion',
  SALARY = 'salary',
  LEARNING = 'learning',
  LEADERSHIP = 'leadership',
}

export enum CareerGoalStatus {
  IN_PROGRESS = 'in_progress',
  ACHIEVED = 'achieved',
  PAUSED = 'paused',
  ABANDONED = 'abandoned',
}

export enum CareerEventType {
  PROMOTION = 'promotion',
  CERTIFICATION = 'certification',
  INTERVIEW = 'interview',
  JOB_CHANGE = 'job_change',
  LEARNING_ACHIEVEMENT = 'learning_achievement',
  CONTEST_ACHIEVEMENT = 'contest_achievement',
  PLACEMENT_MILESTONE = 'placement_milestone',
  ASSESSMENT = 'assessment',
  SALARY_UPDATE = 'salary_update',
}

export enum NetworkRelationType {
  MENTOR = 'mentor',
  RECRUITER = 'recruiter',
  HIRING_MANAGER = 'hiring_manager',
  ALUMNI = 'alumni',
  PEER_ENGINEER = 'peer_engineer',
  COLLABORATOR = 'collaborator',
}

export enum CoachingFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum CareerRiskAlertLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Phase 13: Agentic AI Workspace & Autonomous Productivity Enums
export enum AgentType {
  CAREER_AGENT = 'career_agent',
  CODING_AGENT = 'coding_agent',
  RESEARCH_AGENT = 'research_agent',
  LEARNING_AGENT = 'learning_agent',
  PLACEMENT_AGENT = 'placement_agent',
  INTERVIEW_AGENT = 'interview_agent',
  MENTOR_AGENT = 'mentor_agent',
  EXECUTIVE_ANALYTICS_AGENT = 'executive_analytics_agent',
}

export enum AgentStatus {
  IDLE = 'idle',
  PLANNING = 'planning',
  EXECUTING = 'executing',
  WAITING = 'waiting',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  FAILED = 'failed',
}

export enum AgentTaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  RUNNING = 'running',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum WorkflowTriggerType {
  MANUAL = 'manual',
  SCHEDULED_CRON = 'scheduled_cron',
  EVENT_DRIVEN = 'event_driven',
  GOAL_BASED = 'goal_based',
}

export enum MemoryType {
  LONG_TERM = 'long_term',
  EPISODIC = 'episodic',
  SEMANTIC = 'semantic',
  CAREER = 'career',
  LEARNING = 'learning',
}

export enum KnowledgeNodeType {
  CONCEPT = 'concept',
  SKILL = 'skill',
  PROJECT = 'project',
  COMPANY = 'company',
  ROLE = 'role',
  CERTIFICATION = 'certification',
  RESEARCH_PAPER = 'research_paper',
}

export enum KnowledgeRelationType {
  REQUIRES = 'requires',
  ENABLES = 'enables',
  COMPLEMENTS = 'complements',
  APPLIED_IN = 'applied_in',
  HIRED_FOR = 'hired_for',
  AUTHORED_IN = 'authored_in',
}

export enum DocumentType {
  RESUME = 'resume',
  RESEARCH_PAPER = 'research_paper',
  COURSE_MATERIAL = 'course_material',
  INTERVIEW_NOTES = 'interview_notes',
  ENTERPRISE_REPORT = 'enterprise_report',
}

export enum DecisionType {
  CAREER_TRANSITION = 'career_transition',
  JOB_OFFER_EVALUATION = 'job_offer_evaluation',
  LEARNING_ROI = 'learning_roi',
  SALARY_NEGOTIATION = 'salary_negotiation',
  SKILL_UPGRADE = 'skill_upgrade',
}

// Phase 14: Agent Marketplace & Plugin Ecosystem Enums
export enum MarketplaceCategory {
  CAREER = 'career',
  CODING = 'coding',
  LEARNING = 'learning',
  RESEARCH = 'research',
  HIRING = 'hiring',
  PRODUCTIVITY = 'productivity',
  ENTERPRISE = 'enterprise',
  ANALYTICS = 'analytics',
}

export enum PricingModel {
  FREE = 'free',
  FREEMIUM = 'freemium',
  PAID_ONE_TIME = 'paid_one_time',
  SUBSCRIPTION = 'subscription',
}

export enum AgentVerificationStatus {
  UNVERIFIED = 'unverified',
  COMMUNITY = 'community',
  VERIFIED = 'verified',
  OFFICIAL_FEATURED = 'official_featured',
  ENTERPRISE_APPROVED = 'enterprise_approved',
}

export enum PluginType {
  AI_TOOL = 'ai_tool',
  INTEGRATION = 'integration',
  WORKFLOW_EXTENSION = 'workflow_extension',
  ANALYTICS_EXTENSION = 'analytics_extension',
  ENTERPRISE_EXTENSION = 'enterprise_extension',
}

export enum PluginPermission {
  READ_WORKSPACE = 'read_workspace',
  WRITE_WORKSPACE = 'write_workspace',
  NETWORK_ACCESS = 'network_access',
  EXECUTE_CODE = 'execute_code',
  ACCESS_MEMORY = 'access_memory',
  DATABASE_ACCESS = 'database_access',
  WEBHOOK_SEND = 'webhook_send',
}

export enum IntegrationProvider {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  JIRA = 'jira',
  NOTION = 'notion',
  SLACK = 'slack',
  DISCORD = 'discord',
  GOOGLE_DRIVE = 'google_drive',
  GOOGLE_CALENDAR = 'google_calendar',
  MS_TEAMS = 'ms_teams',
  LINKEDIN = 'linkedin',
}

export enum IntegrationStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  SYNCING = 'syncing',
  ERROR = 'error',
}

export enum WorkflowCategory {
  INTERVIEW_PREP = 'interview_prep',
  PLACEMENT_READINESS = 'placement_readiness',
  CAREER_PLANNING = 'career_planning',
  LEARNING_ROADMAP = 'learning_roadmap',
  SPRINT_PLANNING = 'sprint_planning',
  SECURITY_AUDIT = 'security_audit',
  DEVOPS_AUTOMATION = 'devops_automation',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  EXPIRED = 'expired',
}

export enum TransactionType {
  AGENT_PURCHASE = 'agent_purchase',
  PLUGIN_PURCHASE = 'plugin_purchase',
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  CREATOR_PAYOUT = 'creator_payout',
  API_USAGE_CHARGE = 'api_usage_charge',
}

export enum WebhookEvent {
  AGENT_EXECUTED = 'agent_executed',
  WORKFLOW_TRIGGERED = 'workflow_triggered',
  TASK_COMPLETED = 'task_completed',
  JOB_APPLIED = 'job_applied',
  CERT_ISSUED = 'cert_issued',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
}

// ==========================================
// PHASE 15: AI OPERATING SYSTEM ENUMS
// ==========================================

export enum AgentCloudState {
  CREATED = 'created',
  QUEUED = 'queued',
  RUNNING = 'running',
  PAUSED = 'paused',
  WAITING = 'waiting',
  FAILED = 'failed',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
}

export enum DistributedWorkflowType {
  CAREER_WORKFLOW = 'career_workflow',
  LEARNING_WORKFLOW = 'learning_workflow',
  HIRING_WORKFLOW = 'hiring_workflow',
  RESEARCH_WORKFLOW = 'research_workflow',
  PROJECT_WORKFLOW = 'project_workflow',
  ENTERPRISE_WORKFLOW = 'enterprise_workflow',
}

export enum WorkflowRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  FAILED = 'failed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum WorkflowStepStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SKIPPED = 'skipped',
  FAILED = 'failed',
  COMPLETED = 'completed',
}

export enum GlobalEventType {
  USER_ACTION = 'user_action',
  PROJECT_UPDATED = 'project_updated',
  COURSE_COMPLETED = 'course_completed',
  ASSESSMENT_COMPLETED = 'assessment_completed',
  JOB_APPLIED = 'job_applied',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  CERTIFICATION_EARNED = 'certification_earned',
  WORKFLOW_COMPLETED = 'workflow_completed',
  AGENT_COMPLETED = 'agent_completed',
  PLUGIN_INSTALLED = 'plugin_installed',
}

export enum WorkforceAgentRole {
  CAREER_AGENT = 'career_agent',
  RESEARCH_AGENT = 'research_agent',
  RECRUITER_AGENT = 'recruiter_agent',
  FACULTY_AGENT = 'faculty_agent',
  MENTOR_AGENT = 'mentor_agent',
  ANALYTICS_AGENT = 'analytics_agent',
  PROJECT_MANAGER_AGENT = 'project_manager_agent',
  EXECUTIVE_AGENT = 'executive_agent',
}

export enum TaskOSPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum TaskOSStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  BLOCKED = 'blocked',
}

export enum MemoryFabricType {
  CROSS_AGENT = 'cross_agent',
  ORGANIZATIONAL = 'organizational',
  TEAM = 'team',
  LONG_TERM = 'long_term',
  EPISODIC = 'episodic',
  SEMANTIC = 'semantic',
}

export enum KnowledgeGraphDomain {
  GLOBAL = 'global',
  CAREER = 'career',
  LEARNING = 'learning',
  ENTERPRISE = 'enterprise',
  RESEARCH = 'research',
}

export enum DecisionCenterStatus {
  DRAFT = 'draft',
  ANALYZING = 'analyzing',
  RECOMMENDED = 'recommended',
  APPROVED = 'approved',
  EXECUTED = 'executed',
  DISMISSED = 'dismissed',
}

export enum TelemetryMetricType {
  EXECUTION_TIME = 'execution_time',
  TOKEN_USAGE = 'token_usage',
  ERROR_RATE = 'error_rate',
  CPU_UTILIZATION = 'cpu_utilization',
  MEMORY_USAGE = 'memory_usage',
  COST_USD = 'cost_usd',
}
