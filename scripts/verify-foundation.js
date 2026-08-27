/**
 * CodeForge V2 Foundation Verification Script
 * Validates directory structure, shared packages, backend routing, and frontend architecture.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const requiredFiles = [
  'package.json',
  '.gitignore',
  '.editorconfig',
  '.prettierrc',
  'README.md',
  'docs/ARCHITECTURE.md',
  'docs/SETUP.md',
  
  // Shared
  'shared/package.json',
  'shared/tsconfig.json',
  'shared/src/index.ts',
  'shared/src/enums/index.ts',
  'shared/src/types/index.ts',
  'shared/src/constants/index.ts',

  // Backend
  'backend/package.json',
  'backend/tsconfig.json',
  'backend/drizzle.config.ts',
  'backend/.env.example',
  'backend/src/server.ts',
  'backend/src/app.ts',
  'backend/src/config/env.ts',
  'backend/src/core/errors/AppError.ts',
  'backend/src/core/utils/logger.ts',
  'backend/src/core/utils/jwt.ts',
  'backend/src/core/utils/password.ts',
  'backend/src/middleware/authMiddleware.ts',
  'backend/src/middleware/errorHandler.ts',
  'backend/src/database/connection.ts',
  'backend/src/database/schema/index.ts',
  'backend/src/routes/health.routes.ts',
  'backend/src/routes/v1/index.ts',

  // Frontend
  'frontend/package.json',
  'frontend/vite.config.ts',
  'frontend/tsconfig.json',
  'frontend/index.html',
  'frontend/src/main.tsx',
  'frontend/src/app/App.tsx',
  'frontend/src/styles/tokens.css',
  'frontend/src/styles/global.css',
  'frontend/src/routes/routes.tsx',
  'frontend/src/pages/HomePage.tsx',
  'frontend/src/pages/DashboardPage.tsx',
  'frontend/src/pages/LearnPage.tsx',
  'frontend/src/pages/WorkspacePage.tsx',
  'frontend/src/pages/QuizPage.tsx',
  'frontend/src/pages/ProfilePage.tsx',
  'frontend/src/pages/LeaderboardPage.tsx',
  'frontend/src/pages/AdminPage.tsx',
  'frontend/src/pages/LoginPage.tsx',
  'frontend/src/pages/RegisterPage.tsx',
  'frontend/src/pages/NotFoundPage.tsx',
];

console.log('🔍 Validating CodeForge V2 Foundation File Tree...');
let missingCount = 0;

for (const relPath of requiredFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ Found: ${relPath}`);
  } else {
    console.error(`  ✗ MISSING: ${relPath}`);
    missingCount++;
  }
}

if (missingCount === 0) {
  console.log('\n🎉 ALL 40+ FOUNDATION ARTIFACTS VERIFIED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error(`\n❌ Validation failed with ${missingCount} missing files.`);
  process.exit(1);
}
