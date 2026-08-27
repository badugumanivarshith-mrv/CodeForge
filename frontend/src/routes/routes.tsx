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
