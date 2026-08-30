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
  THEORY = 'theory',
  ALGORITHM = 'algorithm',
  DATASET = 'dataset',
  BENCHMARK = 'benchmark',
  THEOREM = 'theorem',
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

// ==========================================
// PHASE 16: GLOBAL AI ECOSYSTEM ENUMS
// ==========================================

export enum GlobalNodeType {
  USER = 'user',
  ORGANIZATION = 'organization',
  UNIVERSITY = 'university',
  AGENT = 'agent',
  TALENT = 'talent',
  RESEARCH_LAB = 'research_lab',
  STARTUP = 'startup',
}

export enum GlobalEdgeType {
  COLLABORATES_WITH = 'collaborates_with',
  EMPLOYS = 'employs',
  AFFILIATED_WITH = 'affiliated_with',
  CITES = 'cites',
  MENTORS = 'mentors',
  INVESTS_IN = 'invests_in',
  DEPLOYS = 'deploys',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum PublicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PEER_REVIEWED = 'peer_reviewed',
  ACCEPTED = 'accepted',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export enum DigitalTwinType {
  USER_TWIN = 'user_twin',
  CAREER_TWIN = 'career_twin',
  LEARNING_TWIN = 'learning_twin',
  ENTERPRISE_TWIN = 'enterprise_twin',
  ORGANIZATION_TWIN = 'organization_twin',
  AGENT_TWIN = 'agent_twin',
}

export enum ReputationTier {
  NOVICE = 'novice',
  CONTRIBUTOR = 'contributor',
  EXPERT = 'expert',
  MASTER = 'master',
  FELLOW = 'fellow',
  LUMINARY = 'luminary',
}

export enum VentureStage {
  IDEA = 'idea',
  PROTOTYPE = 'prototype',
  MVP = 'mvp',
  SEED = 'seed',
  SERIES_A = 'series_a',
  ENTERPRISE = 'enterprise',
}

export enum SuperintelligenceScope {
  ECOSYSTEM = 'ecosystem',
  STRATEGIC = 'strategic',
  TALENT = 'talent',
  RESEARCH = 'research',
  VENTURE = 'venture',
  RISK = 'risk',
}

export enum TrendCategory {
  SKILL_DEMAND = 'skill_demand',
  EMERGING_TECH = 'emerging_tech',
  HIRING_VELOCITY = 'hiring_velocity',
  RESEARCH_BREAKTHROUGH = 'research_breakthrough',
  STARTUP_TREND = 'startup_trend',
}

export enum EcosystemEventCategory {
  CONSENSUS_REACHED = 'consensus_reached',
  TWIN_SIMULATION = 'twin_simulation',
  SKILL_VERIFIED = 'skill_verified',
  VENTURE_LAUNCHED = 'venture_launched',
  RESEARCH_PUBLISHED = 'research_published',
}

// Phase 17: Planetary Intelligence Infrastructure Enums
export enum PlanetaryTwinType {
  GLOBAL_ECONOMY = 'global_economy',
  EDUCATION = 'education',
  WORKFORCE = 'workforce',
  RESEARCH = 'research',
  ENTERPRISE = 'enterprise',
  INNOVATION = 'innovation',
}

export enum CivilizationHealthTier {
  PRISTINE = 'pristine',
  ADVANCING = 'advancing',
  STABLE = 'stable',
  AT_RISK = 'at_risk',
  CRITICAL = 'critical',
}

export enum GovernanceCouncilType {
  ETHICAL_AI = 'ethical_ai',
  SECURITY_COMPLIANCE = 'security_compliance',
  DATA_SOVEREIGNTY = 'data_sovereignty',
  RESEARCH_INTEGRITY = 'research_integrity',
  ECONOMIC_STABILITY = 'economic_stability',
}

export enum PolicyStatus {
  PROPOSED = 'proposed',
  SIMULATED = 'simulated',
  ACTIVE = 'active',
  REVISED = 'revised',
  DEPRECATED = 'deprecated',
}

export enum InnovationDomain {
  AI_REASONING = 'ai_reasoning',
  QUANTUM_COMPUTE = 'quantum_compute',
  AUTONOMOUS_SYSTEMS = 'autonomous_systems',
  CLEANTECH = 'cleantech',
  BIOTECH = 'biotech',
  CYBERSECURITY = 'cybersecurity',
  DISTRIBUTED_SYSTEMS = 'distributed_systems',
}

export enum FederationProtocol {
  MULTI_AGENT_CONSENSUS = 'multi_agent_consensus',
  SECURE_RPC = 'secure_rpc',
  DECENTRALIZED_KNOWLEDGE = 'decentralized_knowledge',
  CROSS_CLUSTER_REPLICATION = 'cross_cluster_replication',
}

export enum AgentFederationStatus {
  ONLINE = 'online',
  NEGOTIATING = 'negotiating',
  SYNCING = 'syncing',
  DELEGATING = 'delegating',
  ISOLATED = 'isolated',
}

export enum EconomicSignalType {
  TALENT_INFLOW = 'talent_inflow',
  SKILL_PREMIUM = 'skill_premium',
  COMPUTE_DEMAND = 'compute_demand',
  STARTUP_CAPITAL = 'startup_capital',
  CREATOR_YIELD = 'creator_yield',
}

export enum ForesightHorizon {
  ONE_YEAR = 'one_year',
  FIVE_YEAR = 'five_year',
  TEN_YEAR = 'ten_year',
}

export enum PlanetaryEventCategory {
  CIVILIZATION_PULSE = 'civilization_pulse',
  POLICY_ENACTED = 'policy_enacted',
  TWIN_CALIBRATED = 'twin_calibrated',
  INNOVATION_PATENTED = 'innovation_patented',
  FEDERATION_FORMED = 'federation_formed',
  FORESIGHT_UPDATED = 'foresight_updated',
}

// Phase 18 Cognitive Operating System & Autonomous Superintelligence Core Enums
export enum CognitiveGoalStatus {
  PENDING = 'pending',
  PLANNING = 'planning',
  EXECUTING = 'executing',
  EVALUATING = 'evaluating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ABANDONED = 'abandoned',
}

export enum ReasoningStrategy {
  DEDUCTIVE = 'deductive',
  INDUCTIVE = 'inductive',
  ABDUCTIVE = 'abductive',
  ANALOGICAL = 'analogical',
  DIALECTIC = 'dialectic',
  FIRST_PRINCIPLES = 'first_principles',
  MONTE_CARLO_TREE = 'monte_carlo_tree',
}

export enum CognitiveMemoryType {
  WORKING = 'working',
  EPISODIC = 'episodic',
  SEMANTIC = 'semantic',
  PROCEDURAL = 'procedural',
  STRATEGIC = 'strategic',
}

export enum AgentCouncilType {
  ENGINEERING_COUNCIL = 'engineering_council',
  RESEARCH_COUNCIL = 'research_council',
  CAREER_COUNCIL = 'career_council',
  EDUCATION_COUNCIL = 'education_council',
  EXECUTIVE_COUNCIL = 'executive_council',
}

export enum ConsensusStatus {
  DELIBERATING = 'deliberating',
  CONVERGED = 'converged',
  DEADLOCKED = 'deadlocked',
  OVERRIDDEN = 'overridden',
  RATIFIED = 'ratified',
}

export enum PredictionHorizon {
  SEVEN_DAYS = 'seven_days',
  THIRTY_DAYS = 'thirty_days',
  NINETY_DAYS = 'ninety_days',
  ONE_YEAR = 'one_year',
  THREE_YEARS = 'three_years',
  FIVE_YEARS = 'five_years',
}

export enum ExecutionLoopState {
  EXECUTE = 'execute',
  OBSERVE = 'observe',
  REFLECT = 'reflect',
  IMPROVE = 'improve',
  RETRY = 'retry',
  TERMINATED = 'terminated',
}

export enum SelfImprovementDomain {
  AGENT_WEIGHTS = 'agent_weights',
  PROMPT_TOPOLOGY = 'prompt_topology',
  WORKFLOW_ROUTING = 'workflow_routing',
  KNOWLEDGE_INDEX = 'knowledge_index',
  LATENCY_TUNING = 'latency_tuning',
}

export enum MetacognitionConfidence {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CERTAIN = 'certain',
}

export enum StrategicPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  EXPLORATORY = 'exploratory',
}

// Phase 19 Autonomous Enterprise Civilization & AI Workforce Enums
export enum OrganizationCivilizationType {
  ENTERPRISE = 'enterprise',
  STARTUP = 'startup',
  RESEARCH_LAB = 'research_lab',
  VENTURE_STUDIO = 'venture_studio',
  DAO = 'dao',
  CIVILIZATION_NODE = 'civilization_node',
}

export enum DigitalEmployeeRole {
  AI_ENGINEER = 'ai_engineer',
  AI_RESEARCHER = 'ai_researcher',
  AI_PRODUCT_MANAGER = 'ai_product_manager',
  AI_DESIGNER = 'ai_designer',
  AI_ANALYST = 'ai_analyst',
  AI_EXECUTIVE = 'ai_executive',
}

export enum EmployeeEmploymentStatus {
  ACTIVE = 'active',
  PROVISIONING = 'provisioning',
  REALLOCATED = 'reallocated',
  BENCH = 'bench',
  DECOMMISSIONED = 'decommissioned',
}

export enum CompanyStage {
  IDEATION = 'ideation',
  PRE_SEED = 'pre_seed',
  SEED = 'seed',
  SERIES_A = 'series_a',
  GROWTH = 'growth',
  EXPANSION = 'expansion',
  AUTONOMOUS = 'autonomous',
}

export enum ProductLifecycleStage {
  DISCOVERY = 'discovery',
  VALIDATION = 'validation',
  ALPHA = 'alpha',
  BETA = 'beta',
  GENERAL_AVAILABILITY = 'general_availability',
  DEPRECATED = 'deprecated',
}

export enum EnterpriseFederationType {
  RESOURCE_SHARING = 'resource_sharing',
  TALENT_EXCHANGE = 'talent_exchange',
  JOINT_VENTURE = 'joint_venture',
  RESEARCH_CONSORTIUM = 'research_consortium',
  STRATEGIC_ALLIANCE = 'strategic_alliance',
}

export enum InvestmentReadinessTier {
  TIER_1_EXEMPLARY = 'tier_1_exemplary',
  TIER_2_INVESTABLE = 'tier_2_investable',
  TIER_3_INCUBATING = 'tier_3_incubating',
  TIER_4_NEEDS_VALIDATION = 'tier_4_needs_validation',
}

export enum ExecutionNetworkTaskPriority {
  CRITICAL_PATH = 'critical_path',
  HIGH = 'high',
  NORMAL = 'normal',
  SPECULATIVE = 'speculative',
}

export enum ExecutionNetworkTaskStatus {
  QUEUED = 'queued',
  DELEGATED = 'delegated',
  EXECUTING = 'executing',
  VERIFYING = 'verifying',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum EconomicSimulationScenario {
  BULL_MARKET = 'bull_market',
  BEAR_MARKET = 'bear_market',
  DISRUPTIVE_SHOCK = 'disruptive_shock',
  RESOURCE_SCARCITY = 'resource_scarcity',
  EQUILIBRIUM = 'equilibrium',
}

// Phase 20 Autonomous Startup Builder & Venture Creation Platform Enums
export enum StartupStage {
  IDEATION = 'ideation',
  VALIDATION = 'validation',
  PROTOTYPE = 'prototype',
  MVP = 'mvp',
  GROWTH = 'growth',
  SCALE = 'scale',
}

export enum StartupCategory {
  AI_DEVTOOLS = 'ai_devtools',
  ENTERPRISE_INFRA = 'enterprise_infra',
  FINTECH = 'fintech',
  CYBERSECURITY = 'cybersecurity',
  CYBERSECURITY_AI = 'cybersecurity_ai',
  HEALTH_AI = 'health_ai',
  AUTONOMOUS_AGENTS = 'autonomous_agents',
  DEVELOPER_PLATFORM = 'developer_platform',
  KNOWLEDGE_TECH = 'knowledge_tech',
  DATA_INTELLIGENCE = 'data_intelligence',
}

export enum MarketRiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IncubationPhase {
  IDEA = 'idea',
  CONCEPT = 'concept',
  VALIDATION = 'validation',
  PROTOTYPE = 'prototype',
  MVP = 'mvp',
  GROWTH = 'growth',
  SCALE = 'scale',
}

export enum CustomerPersonaType {
  ENTERPRISE_ARCHITECT = 'enterprise_architect',
  STARTUP_CTO = 'startup_cto',
  INDIE_DEVELOPER = 'indie_developer',
  DEVSECOPS_LEAD = 'devsecops_lead',
  RESEARCH_SCIENTIST = 'research_scientist',
  SECURITY_OFFICER = 'security_officer',
  ENGINEERING_VP = 'engineering_vp',
}

export enum GrowthChannel {
  PRODUCT_LED = 'product_led',
  COMMUNITY = 'community',
  DIRECT_SALES = 'direct_sales',
  DEVELOPER_ECOSYSTEM = 'developer_ecosystem',
  PARTNERSHIPS = 'partnerships',
  VIRAL_REFERRAL = 'viral_referral',
}

export enum VentureHealthStatus {
  THRIVING = 'thriving',
  ON_TRACK = 'on_track',
  NEEDS_ATTENTION = 'needs_attention',
  PIVOT_REQUIRED = 'pivot_required',
  DISTRESSED = 'distressed',
}

export enum StartupFundingStage {
  PRE_SEED = 'pre_seed',
  SEED = 'seed',
  SERIES_A = 'series_a',
  SERIES_B = 'series_b',
  SERIES_C = 'series_c',
  GROWTH = 'growth',
}

export enum InvestorType {
  ANGEL = 'angel',
  VENTURE_CAPITAL = 'venture_capital',
  SOVEREIGN_FUND = 'sovereign_fund',
  CORPORATE_VC = 'corporate_vc',
  SYNDICATE = 'syndicate',
}

export enum StartupEventType {
  IDEA_CREATED = 'idea_created',
  CREATED = 'created',
  MARKET_VALIDATED = 'market_validated',
  MVP_LAUNCHED = 'mvp_launched',
  PMF_ACHIEVED = 'pmf_achieved',
  FUNDING_ROUND_OPENED = 'funding_round_opened',
  FUNDING_CLOSED = 'funding_closed',
  PIVOT_EXECUTED = 'pivot_executed',
  PIVOT = 'pivot',
  STAGE_TRANSITION = 'stage_transition',
  SCALE_MILESTONE = 'scale_milestone',
}

// Phase 21: Venture Capital Intelligence & Autonomous Investment Network
export enum DealStage {
  INBOX = 'inbox',
  SCREENING = 'screening',
  FIRST_CALL = 'first_call',
  DUE_DILIGENCE = 'due_diligence',
  PARTNER_MEETING = 'partner_meeting',
  TERM_SHEET = 'term_sheet',
  LEGAL_CLOSING = 'legal_closing',
  PASSED = 'passed',
  INVESTED = 'invested',
  LOST = 'lost',
}

export enum DealPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  HYPER_PRIORITY = 'hyper_priority',
}

export enum DiligenceCategory {
  TEAM_EVALUATION = 'team_evaluation',
  PRODUCT_DEFENSIBILITY = 'product_defensibility',
  MARKET_VALIDATION = 'market_validation',
  TECH_ARCHITECTURE = 'tech_architecture',
  FINANCIAL_MODEL = 'financial_model',
  LEGAL_RISK = 'legal_risk',
}

export enum DiligenceRiskSeverity {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum InvestmentRecommendation {
  STRONG_INVEST = 'strong_invest',
  INVEST = 'invest',
  NEUTRAL = 'neutral',
  PASS = 'pass',
  STRONG_PASS = 'strong_pass',
}

export enum CommitteeType {
  PARTNER_COMMITTEE = 'partner_committee',
  TECHNICAL_COMMITTEE = 'technical_committee',
  MARKET_COMMITTEE = 'market_committee',
  FINANCIAL_COMMITTEE = 'financial_committee',
}

export enum CommitteeVoteType {
  YES = 'yes',
  NO = 'no',
  ABSTAIN = 'abstain',
  CONDITIONAL_YES = 'conditional_yes',
}

export enum FundType {
  VENTURE_FUND = 'venture_fund',
  ANGEL_SYNDICATE = 'angel_syndicate',
  ACCELERATOR_FUND = 'accelerator_fund',
  GROWTH_EQUITY = 'growth_equity',
  OPPORTUNITY_FUND = 'opportunity_fund',
}

export enum FundStatus {
  FUNDRAISING = 'fundraising',
  ACTIVELY_DEPLOYING = 'actively_deploying',
  HARVESTING = 'harvesting',
  FULLY_DEPLOYED = 'fully_deployed',
  CLOSED = 'closed',
}

export enum ExitType {
  IPO = 'ipo',
  STRATEGIC_ACQUISITION = 'strategic_acquisition',
  SECONDARY_SALE = 'secondary_sale',
  BUYBACK = 'buyback',
  TOKEN_LIQUIDITY = 'token_liquidity',
}

export enum ExitStatus {
  PROPOSED = 'proposed',
  SIMULATED = 'simulated',
  NEGOTIATING = 'negotiating',
  IN_ESCROW = 'in_escrow',
  COMPLETED = 'completed',
  ABORTED = 'aborted',
}

export enum AllocationStrategy {
  CONVICTION_WEIGHTED = 'conviction_weighted',
  EQUAL_WEIGHTED = 'equal_weighted',
  BARBELL_STRATEGY = 'barbell_strategy',
  STAGE_GRADUATED = 'stage_graduated',
  DYNAMIC_RESERVE = 'dynamic_reserve',
  BALANCED = 'balanced',
  GROWTH_FOCUSED = 'growth_focused',
  RESERVE_HEAVY = 'reserve_heavy',
}

export enum SyndicateRole {
  LEAD_INVESTOR = 'lead_investor',
  CO_INVESTOR = 'co_investor',
  SYNDICATE_LP = 'syndicate_lp',
  STRATEGIC_PARTNER = 'strategic_partner',
  OBSERVER = 'observer',
  CO_LEAD = 'co_lead',
  PARTICIPANT = 'participant',
}

// ============================================================================
// Phase 22: Autonomous Research University & Scientific Knowledge Civilization
// ============================================================================

export enum AcademicDepartment {
  COMPUTER_SCIENCE = 'computer_science',
  ARTIFICIAL_INTELLIGENCE = 'artificial_intelligence',
  ENGINEERING = 'engineering',
  MATHEMATICS = 'mathematics',
  BUSINESS = 'business',
  ECONOMICS = 'economics',
  HEALTHCARE = 'healthcare',
  SOCIAL_SCIENCES = 'social_sciences',
}

export enum ResearchProgramStatus {
  PROPOSED = 'proposed',
  ACTIVE = 'active',
  PEER_REVIEW = 'peer_review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum LabType {
  AI_RESEARCH_LAB = 'ai_research_lab',
  SYSTEMS_LAB = 'systems_lab',
  DATA_SCIENCE_LAB = 'data_science_lab',
  ROBOTICS_LAB = 'robotics_lab',
  FUTURE_TECHNOLOGIES_LAB = 'future_technologies_lab',
}

export enum LabStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  UPGRADING = 'upgrading',
  OFFLINE = 'offline',
}

export enum ExperimentStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  VERIFIED = 'verified',
}

export enum HypothesisStatus {
  FORMULATED = 'formulated',
  TESTING = 'testing',
  VALIDATED = 'validated',
  REFUTED = 'refuted',
}

export enum DiscoverySignificance {
  INCREMENTAL = 'incremental',
  MODERATE = 'moderate',
  MAJOR = 'major',
  BREAKTHROUGH = 'breakthrough',
  PARADIGM_SHIFTING = 'paradigm_shifting',
}

export enum PublicationType {
  RESEARCH_PAPER = 'research_paper',
  TECHNICAL_REPORT = 'technical_report',
  WHITE_PAPER = 'white_paper',
  SURVEY_PAPER = 'survey_paper',
}

export enum PeerReviewRole {
  METHOD_REVIEWER = 'method_reviewer',
  STATISTICAL_REVIEWER = 'statistical_reviewer',
  DOMAIN_REVIEWER = 'domain_reviewer',
  ETHICS_REVIEWER = 'ethics_reviewer',
}

export enum PeerReviewVerdict {
  ACCEPT = 'accept',
  MINOR_REVISION = 'minor_revision',
  MAJOR_REVISION = 'major_revision',
  REJECT = 'reject',
}

export enum GrantType {
  GOVERNMENT_GRANT = 'government_grant',
  UNIVERSITY_GRANT = 'university_grant',
  INDUSTRY_GRANT = 'industry_grant',
  FOUNDATION_GRANT = 'foundation_grant',
}

export enum GrantStatus {
  OPEN = 'open',
  APPLIED = 'applied',
  AWARDED = 'awarded',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

// Phase 23: Autonomous Software Factory Enums
export enum SoftwareProjectType {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  LIBRARY = 'library',
  API_SERVICE = 'api_service',
  CLI_TOOL = 'cli_tool',
  MICROSERVICE = 'microservice',
}

export enum SoftwareProjectStatus {
  PLANNING = 'planning',
  GENERATING = 'generating',
  TESTING = 'testing',
  DEPLOYED = 'deployed',
  ARCHIVED = 'archived',
}

export enum EngineeringTaskType {
  REQUIREMENTS = 'requirements',
  ARCHITECTURE = 'architecture',
  CODING = 'coding',
  TESTING = 'testing',
  REFACTORING = 'refactoring',
}

export enum EngineeringTaskStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ArtifactType {
  SOURCE_CODE = 'source_code',
  CONFIGURATION = 'configuration',
  DOCUMENTATION = 'documentation',
  TEST_SUITE = 'test_suite',
  BUILD_PACKAGE = 'build_package',
}

export enum BlueprintComplexity {
  SIMPLE = 'simple',
  MEDIUM = 'medium',
  COMPLEX = 'complex',
  ENTERPRISE = 'enterprise',
}




