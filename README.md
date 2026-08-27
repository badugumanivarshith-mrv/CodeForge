# 🚀 CodeForge V2

> **AI-Powered Coding Education & Mastery Platform**  
> Guiding learners from absolute beginner concepts to algorithmic mastery, full-stack assignments, and interview readiness.

---

## 🌟 Architecture & Key Features

- **Decoupled Monorepo**: Modular workspaces for `frontend`, `backend`, and `shared` TypeScript contracts.
- **Polyglot Execution Sandbox**: Isolated, secure runner supporting Python 3.12, Java 21, C17, C++20, JavaScript (Node 20), and TypeScript.
- **Socratic AI Tutor**: Cognitive scaffolding with tiered hints, AST debugger, complexity analysis, and solution leak protection.
- **Granular Skill Mastery**: Bayesian Knowledge Tracing (BKT) tracking topic proficiency and semantic mistake memory.
- **Zero-Code Admin Studio**: Dynamic authoring of Languages, Topics, Lessons, Quizzes, Problems, and Assignments.

---

## 📁 Repository Structure

```text
codeforge/
├── frontend/             # React 19 + TypeScript + Vite SPA
├── backend/              # Node.js + Express + TypeScript + Drizzle ORM
├── shared/               # Shared TypeScript types, enums, and API contracts
├── docs/                 # Architectural specifications and setup guides
│   ├── ARCHITECTURE.md   # Phase 0 Architecture Freeze
│   └── SETUP.md          # Developer onboarding guide
├── scripts/              # Automation and verification scripts
├── package.json          # Root npm workspaces orchestrator
├── .prettierrc           # Consistent formatting rules
└── .editorconfig         # Indentation and character encoding standards
```

---

## 🛠️ Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **PostgreSQL**: `v16.0` or higher (with `pgvector` extension optional for vector memory)
- **Redis**: `v7.0` or higher (for caching, judge queues, and leaderboards)

---

## 🚀 Quick Start

1. **Install dependencies across all workspaces:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Edit `backend/.env` with your PostgreSQL and JWT configurations.*

3. **Run Typecheck & Build:**
   ```bash
   npm run typecheck
   npm run build
   ```

4. **Start Development Servers (Backend on `5000`, Frontend on `5173`):**
   ```bash
   npm run dev
   ```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Concurrently starts both backend and frontend development servers |
| `npm run dev:backend` | Starts only the Express development server with live reload |
| `npm run dev:frontend`| Starts only the Vite frontend dev server |
| `npm run build` | Compiles `shared`, `backend`, and `frontend` bundles |
| `npm run typecheck` | Validates TypeScript strict mode across all workspaces |
| `npm run lint` | Runs ESLint checks across backend and frontend |
| `npm run format` | Formats the entire codebase using Prettier |
| `npm run db:generate` | Generates Drizzle SQL migration files |
| `npm run db:push` | Pushes schema changes directly to the PostgreSQL database |
| `npm run db:studio` | Launches Drizzle Studio visual schema browser |

---

## 📚 Documentation
- [Phase 0 Architectural Blueprint](docs/ARCHITECTURE.md)
- [Local Setup & Environment Guide](docs/SETUP.md)
