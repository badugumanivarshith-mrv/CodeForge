# CodeForge V2 — Developer Setup Guide

This guide walks you through setting up your local development environment for CodeForge V2.

---

## 1. System Requirements

Ensure you have the following installed:
- **Node.js**: v20.x or higher (`node -v`)
- **npm**: v10.x or higher (`npm -v`)
- **PostgreSQL**: v16.x (`psql --version`)
- **Redis**: v7.x (`redis-cli ping`)

---

## 2. Monorepo Installation

Clone the repository and install all workspace dependencies from the root directory:

```bash
git clone <repo-url> codeforge
cd codeforge
npm install
```

---

## 3. Environment Configuration

1. Navigate to the backend directory or copy the sample `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Configure the following variables in `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   
   # PostgreSQL Connection
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/codeforge_dev
   
   # Redis Connection
   REDIS_URL=redis://localhost:6379
   
   # Authentication Secrets
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-long
   JWT_REFRESH_EXPIRES_IN=7d
   ```

---

## 4. Database Setup with Drizzle ORM

Ensure PostgreSQL is running and your target database exists:

```bash
# Create local database if not exists
createdb codeforge_dev
```

Run schema migrations / push:
```bash
npm run db:push
```

To open the interactive Drizzle Studio database UI:
```bash
npm run db:studio
```

---

## 5. Running the Application

### Concurrent Development (Both Services):
```bash
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`
- **API Base**: `http://localhost:5000/api/v1`
- **Frontend SPA**: `http://localhost:5173`

---

## 6. Code Quality & Formatting

```bash
# Type check all packages
npm run typecheck

# Lint files
npm run lint

# Format codebase
npm run format
```
