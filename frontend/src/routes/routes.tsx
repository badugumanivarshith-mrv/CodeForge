import { createBrowserRouter } from 'react-router-dom';
import { UserRole } from '@codeforge/shared';

// Layouts
import { MainLayout, AuthLayout, ProtectedRoute } from '../components/layout';

// Pages
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { LearnPage } from '../pages/LearnPage';
import { WorkspacePage } from '../pages/WorkspacePage';
import { QuizPage } from '../pages/QuizPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { PublicProfilePage } from '../pages/PublicProfilePage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { AdminPage } from '../pages/AdminPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AssessmentHubPage } from '../pages/AssessmentHubPage';
import { AssessmentWorkspacePage } from '../pages/AssessmentWorkspacePage';
import { AssessmentResultPage } from '../pages/AssessmentResultPage';
import { ContestHubPage } from '../pages/ContestHubPage';

// Phase 8 Pages
import { PortfolioPage } from '../pages/PortfolioPage';
import { StudyGroupsPage } from '../pages/StudyGroupsPage';
import { StudyGroupDetailPage } from '../pages/StudyGroupDetailPage';
import { ForumPage } from '../pages/ForumPage';
import { ForumPostDetailPage } from '../pages/ForumPostDetailPage';
import { CareerDashboardPage } from '../pages/CareerDashboardPage';
import { InterviewHubPage } from '../pages/InterviewHubPage';
import { InterviewSessionPage } from '../pages/InterviewSessionPage';
import { ResumeBuilderPage } from '../pages/ResumeBuilderPage';
import { TalentDiscoveryPage } from '../pages/TalentDiscoveryPage';
import { ActivityFeedPage } from '../pages/ActivityFeedPage';

// Phase 9 Pages
import { ArenaPage } from '../pages/ArenaPage';
import { ProblemWorkspacePage } from '../pages/ProblemWorkspacePage';
import { SubmissionHistoryPage } from '../pages/SubmissionHistoryPage';
import { SubmissionDetailPage } from '../pages/SubmissionDetailPage';

// Phase 10 Pages
import { JobBoardPage } from '../pages/JobBoardPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { CandidateApplicationsPage } from '../pages/CandidateApplicationsPage';
import { AiCareerAdvisorPage } from '../pages/AiCareerAdvisorPage';
import { ReferralNetworkPage } from '../pages/ReferralNetworkPage';
import { HiringChallengesPage } from '../pages/HiringChallengesPage';
import { RecruiterPortalPage } from '../pages/RecruiterPortalPage';

// Phase 11 Enterprise University & Workforce Intelligence Pages
import { UniversityDashboardPage } from '../pages/UniversityDashboardPage';
import { OrganizationDashboardPage } from '../pages/OrganizationDashboardPage';
import { FacultyPortalPage } from '../pages/FacultyPortalPage';
import { MentorPortalPage } from '../pages/MentorPortalPage';
import { CourseBuilderPage } from '../pages/CourseBuilderPage';
import { LearningPathPage } from '../pages/LearningPathPage';
import { CertificationPage } from '../pages/CertificationPage';
import { ExecutiveAnalyticsPage } from '../pages/ExecutiveAnalyticsPage';
import { WorkforceIntelligencePage } from '../pages/WorkforceIntelligencePage';
import { AdminCopilotPage } from '../pages/AdminCopilotPage';

// Phase 12 AI Career Operating System (Career OS) Pages
import { CareerOSDashboardPage } from '../pages/career-os/CareerOSDashboardPage';
import { CareerTwinPage } from '../pages/career-os/CareerTwinPage';
import { CareerInsightsPage } from '../pages/career-os/CareerInsightsPage';
import { SalaryIntelligencePage } from '../pages/career-os/SalaryIntelligencePage';
import { PersonalBrandPage } from '../pages/career-os/PersonalBrandPage';
import { CareerTimelinePage } from '../pages/career-os/CareerTimelinePage';
import { CareerPredictionsPage } from '../pages/career-os/CareerPredictionsPage';

// Phase 13 Agentic AI Workspace Pages
import {
  AICommandCenterPage,
  AgentWorkflowsPage,
  AutonomousProjectsPage,
  ResearchCopilotPage,
  KnowledgeGraphPage,
  DocumentIntelligencePage,
  ProductivityAnalyticsPage,
} from '../pages/agents';

// Phase 14 Agent Marketplace & Plugin Ecosystem Pages
import {
  MarketplacePage,
  AgentDetailsPage,
  PluginMarketplacePage,
  IntegrationHubPage,
  WorkflowMarketplacePage,
  AgentBuilderPage,
  DeveloperPortalPage,
  CreatorDashboardPage,
} from '../pages/marketplace';

// Phase 15 AI Operating System & Agent Cloud Pages
import {
  AgentCloudPage,
  WorkflowStudioPage,
  AutomationCenterPage,
  TaskOSPage,
  MemoryFabricPage,
  KnowledgeFabricPage,
  DecisionCenterPage,
  TelemetryDashboardPage,
  GovernancePage,
} from '../pages/agent-cloud';

// Phase 16 Global AI Ecosystem Pages
import {
  GlobalCommandCenterPage,
  GlobalNetworkPage,
  TalentCloudPage,
  ResearchNetworkPage,
  StartupBuilderPage,
  DigitalTwinPage,
  EcosystemAnalyticsPage,
} from '../pages/global-network';

// Phase 17 Planetary Intelligence Pages
import {
  PlanetaryCommandCenterPage,
  CivilizationDashboardPage,
  InnovationNetworkPage,
  ResearchCivilizationPage,
  EconomicIntelligencePage,
  AgentFederationPage,
  StrategicForesightPage,
  PlanetaryTwinPage,
} from '../pages/planetary-network';

// Phase 18 Cognitive Operating System & Superintelligence Core Pages
import {
  CognitiveOSPage,
  DigitalBrainPage,
  MemoryEvolutionPage,
  AgentCouncilPage,
  PredictiveIntelligencePage,
  StrategyCenterPage,
  SelfReflectionPage,
  AutonomousExecutionPage,
} from '../pages/cognitive-os';

// Phase 19 Autonomous Enterprise Civilization Pages
import {
  EnterpriseCommandCenterPage,
  OrganizationEnginePage,
  DigitalWorkforcePage,
  CompanyBuilderPage,
  ProductFactoryPage,
  InvestmentIntelligencePage,
  EconomicSimulationPage,
  EnterpriseFederationPage,
} from '../pages/enterprise-civilization';

// Phase 20 Autonomous Startup Builder Pages
import {
  StartupCommandCenterPage,
  StartupGeneratorPage,
  MarketIntelligencePage,
  AIFounderPage,
  IncubationEnginePage,
  CustomerDiscoveryPage,
  GrowthEnginePage,
  VenturePortfolioPage,
  FundraisingPage,
} from '../pages/startup-builder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'learn',
        element: <LearnPage />,
      },
      {
        path: 'learn/:languageSlug',
        element: <LearnPage />,
      },
      {
        path: 'learn/:languageSlug/:topicSlug',
        element: <LearnPage />,
      },
      {
        path: 'arena',
        element: <ArenaPage />,
      },
      {
        path: 'problems/:problemSlug',
        element: <ProblemWorkspacePage />,
      },
      {
        path: 'submissions',
        element: <SubmissionHistoryPage />,
      },
      {
        path: 'submissions/:submissionId',
        element: <SubmissionDetailPage />,
      },
      {
        path: 'workspace',
        element: <WorkspacePage />,
      },
      {
        path: 'workspace/:problemSlug',
        element: <WorkspacePage />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'u/:username',
        element: <PublicProfilePage />,
      },
      {
        path: 'forum',
        element: <ForumPage />,
      },
      {
        path: 'forum/:idOrSlug',
        element: <ForumPostDetailPage />,
      },
      {
        path: 'groups',
        element: <StudyGroupsPage />,
      },
      {
        path: 'groups/:idOrSlug',
        element: <StudyGroupDetailPage />,
      },
      {
        path: 'talent',
        element: <TalentDiscoveryPage />,
      },
      {
        path: 'feed',
        element: <ActivityFeedPage />,
      },
      {
        path: 'jobs',
        element: <JobBoardPage />,
      },
      {
        path: 'jobs/:idOrSlug',
        element: <JobDetailPage />,
      },
      {
        path: 'advisor',
        element: <AiCareerAdvisorPage />,
      },
      {
        path: 'referrals',
        element: <ReferralNetworkPage />,
      },
      {
        path: 'hiring-challenges',
        element: <HiringChallengesPage />,
      },

      // Phase 11 Public Accessible Portals
      {
        path: 'university',
        element: <UniversityDashboardPage />,
      },
      {
        path: 'organization',
        element: <OrganizationDashboardPage />,
      },
      {
        path: 'faculty',
        element: <FacultyPortalPage />,
      },
      {
        path: 'mentors-portal',
        element: <MentorPortalPage />,
      },
      {
        path: 'lms/courses',
        element: <CourseBuilderPage />,
      },
      {
        path: 'lms/paths',
        element: <LearningPathPage />,
      },
      {
        path: 'certifications',
        element: <CertificationPage />,
      },
      {
        path: 'executive-analytics',
        element: <ExecutiveAnalyticsPage />,
      },
      {
        path: 'workforce-intelligence',
        element: <WorkforceIntelligencePage />,
      },
      {
        path: 'admin-copilot',
        element: <AdminCopilotPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'quiz/:quizId',
            element: <QuizPage />,
          },
          {
            path: 'quiz/topic/:topicId',
            element: <QuizPage />,
          },
          {
            path: 'assessments',
            element: <AssessmentHubPage />,
          },
          {
            path: 'assessments/:id',
            element: <AssessmentWorkspacePage />,
          },
          {
            path: 'assessments/:id/result',
            element: <AssessmentResultPage />,
          },
          {
            path: 'contests',
            element: <ContestHubPage />,
          },
          {
            path: 'portfolio',
            element: <PortfolioPage />,
          },
          {
            path: 'career',
            element: <CareerDashboardPage />,
          },
          {
            path: 'interviews',
            element: <InterviewHubPage />,
          },
          {
            path: 'interviews/:sessionId',
            element: <InterviewSessionPage />,
          },
          {
            path: 'resumes',
            element: <ResumeBuilderPage />,
          },
          {
            path: 'my-applications',
            element: <CandidateApplicationsPage />,
          },
          {
            path: 'recruiter',
            element: <RecruiterPortalPage />,
          },
          // Phase 12 Career OS Routes
          {
            path: 'career-os',
            element: <CareerOSDashboardPage />,
          },
          {
            path: 'career-os/twin',
            element: <CareerTwinPage />,
          },
          {
            path: 'career-os/insights',
            element: <CareerInsightsPage />,
          },
          {
            path: 'career-os/salary',
            element: <SalaryIntelligencePage />,
          },
          {
            path: 'career-os/brand',
            element: <PersonalBrandPage />,
          },
          {
            path: 'career-os/timeline',
            element: <CareerTimelinePage />,
          },
          {
            path: 'career-os/predictions',
            element: <CareerPredictionsPage />,
          },
          // Phase 13 Agentic AI Workspace & Command Center Routes
          {
            path: 'ai-command-center',
            element: <AICommandCenterPage />,
          },
          {
            path: 'ai-workspace/workflows',
            element: <AgentWorkflowsPage />,
          },
          {
            path: 'ai-workspace/projects',
            element: <AutonomousProjectsPage />,
          },
          {
            path: 'ai-workspace/research',
            element: <ResearchCopilotPage />,
          },
          {
            path: 'ai-workspace/knowledge-graph',
            element: <KnowledgeGraphPage />,
          },
          {
            path: 'ai-workspace/documents',
            element: <DocumentIntelligencePage />,
          },
          {
            path: 'ai-workspace/analytics',
            element: <ProductivityAnalyticsPage />,
          },
          // Phase 14: Agent Marketplace & Plugin Ecosystem Routes
          {
            path: 'marketplace',
            element: <MarketplacePage />,
          },
          {
            path: 'marketplace/agents/:id',
            element: <AgentDetailsPage />,
          },
          {
            path: 'marketplace/plugins',
            element: <PluginMarketplacePage />,
          },
          {
            path: 'marketplace/integrations',
            element: <IntegrationHubPage />,
          },
          {
            path: 'marketplace/workflows',
            element: <WorkflowMarketplacePage />,
          },
          {
            path: 'marketplace/builder',
            element: <AgentBuilderPage />,
          },
          {
            path: 'marketplace/developer',
            element: <DeveloperPortalPage />,
          },
          {
            path: 'marketplace/creator',
            element: <CreatorDashboardPage />,
          },

          // Phase 15: Agent Cloud & AI Operating System
          {
            path: 'agent-cloud',
            element: <AgentCloudPage />,
          },
          {
            path: 'agent-cloud/workflows',
            element: <WorkflowStudioPage />,
          },
          {
            path: 'agent-cloud/automation',
            element: <AutomationCenterPage />,
          },
          {
            path: 'agent-cloud/task-os',
            element: <TaskOSPage />,
          },
          {
            path: 'agent-cloud/memory',
            element: <MemoryFabricPage />,
          },
          {
            path: 'agent-cloud/knowledge',
            element: <KnowledgeFabricPage />,
          },
          {
            path: 'agent-cloud/decisions',
            element: <DecisionCenterPage />,
          },
          {
            path: 'agent-cloud/telemetry',
            element: <TelemetryDashboardPage />,
          },
          {
            path: 'agent-cloud/governance',
            element: <GovernancePage />,
          },

          // Phase 16: Global AI Ecosystem Routes
          {
            path: 'global-command-center',
            element: <GlobalCommandCenterPage />,
          },
          {
            path: 'global-network',
            element: <GlobalNetworkPage />,
          },
          {
            path: 'talent-cloud',
            element: <TalentCloudPage />,
          },
          {
            path: 'research-network',
            element: <ResearchNetworkPage />,
          },
          {
            path: 'startup-builder',
            element: <StartupBuilderPage />,
          },
          {
            path: 'digital-twins',
            element: <DigitalTwinPage />,
          },
          {
            path: 'ecosystem-analytics',
            element: <EcosystemAnalyticsPage />,
          },

          // Phase 17 Planetary Intelligence Infrastructure Routes
          {
            path: 'planetary-command-center',
            element: <PlanetaryCommandCenterPage />,
          },
          {
            path: 'civilization',
            element: <CivilizationDashboardPage />,
          },
          {
            path: 'innovation-network',
            element: <InnovationNetworkPage />,
          },
          {
            path: 'research-civilization',
            element: <ResearchCivilizationPage />,
          },
          {
            path: 'economic-intelligence',
            element: <EconomicIntelligencePage />,
          },
          {
            path: 'agent-federation',
            element: <AgentFederationPage />,
          },
          {
            path: 'strategic-foresight',
            element: <StrategicForesightPage />,
          },
          {
            path: 'planetary-twins',
            element: <PlanetaryTwinPage />,
          },

          // Phase 18 Cognitive Operating System & Superintelligence Core Routes
          {
            path: 'cognitive-os',
            element: <CognitiveOSPage />,
          },
          {
            path: 'digital-brain',
            element: <DigitalBrainPage />,
          },
          {
            path: 'memory-evolution',
            element: <MemoryEvolutionPage />,
          },
          {
            path: 'agent-council',
            element: <AgentCouncilPage />,
          },
          {
            path: 'predictive-intelligence',
            element: <PredictiveIntelligencePage />,
          },
          {
            path: 'strategy-center',
            element: <StrategyCenterPage />,
          },
          {
            path: 'self-reflection',
            element: <SelfReflectionPage />,
          },
          {
            path: 'autonomous-execution',
            element: <AutonomousExecutionPage />,
          },

          // Phase 19 Autonomous Enterprise Civilization Routes
          {
            path: 'enterprise-civilization',
            element: <EnterpriseCommandCenterPage />,
          },
          {
            path: 'organization-engine',
            element: <OrganizationEnginePage />,
          },
          {
            path: 'digital-workforce',
            element: <DigitalWorkforcePage />,
          },
          {
            path: 'company-builder',
            element: <CompanyBuilderPage />,
          },
          {
            path: 'product-factory',
            element: <ProductFactoryPage />,
          },
          {
            path: 'investment-intelligence',
            element: <InvestmentIntelligencePage />,
          },
          {
            path: 'economic-simulation',
            element: <EconomicSimulationPage />,
          },
          {
            path: 'enterprise-federation',
            element: <EnterpriseFederationPage />,
          },
          // Phase 20 Autonomous Startup Builder Routes
          {
            path: 'startup-command-center',
            element: <StartupCommandCenterPage />,
          },
          {
            path: 'startup-generator',
            element: <StartupGeneratorPage />,
          },
          {
            path: 'market-intelligence',
            element: <MarketIntelligencePage />,
          },
          {
            path: 'ai-founder',
            element: <AIFounderPage />,
          },
          {
            path: 'incubation-engine',
            element: <IncubationEnginePage />,
          },
          {
            path: 'customer-discovery',
            element: <CustomerDiscoveryPage />,
          },
          {
            path: 'growth-engine',
            element: <GrowthEnginePage />,
          },
          {
            path: 'venture-portfolio',
            element: <VenturePortfolioPage />,
          },
          {
            path: 'fundraising',
            element: <FundraisingPage />,
          },
        ],
      },

      {
        element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
        children: [
          {
            path: 'admin',
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
