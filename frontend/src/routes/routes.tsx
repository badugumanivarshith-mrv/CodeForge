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
