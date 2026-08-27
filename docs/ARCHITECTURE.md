# CodeForge V2 — Phase 0 Architecture Freeze Summary

This document summarizes the core architectural freeze established in Phase 0.

## 1. Monorepo & Workspaces
- `frontend`: React 19, TypeScript, Vite, React Router, TanStack Query, Zustand.
- `backend`: Node.js 20, Express, TypeScript, Drizzle ORM, Zod, PostgreSQL, Redis, BullMQ.
- `shared`: Universal data contracts, enums, status codes, and type declarations.

## 2. Core Curriculum Model
- Tier-1 Languages: Python, Java, C, C++, JavaScript, TypeScript.
- 10 Topics per language:
  1. Syntax & Literals
  2. Data Types & Variables
  3. Operators & Expressions
  4. Control Flow
  5. Data Structures
  6. Functions & Modularization
  7. Error & Exception Handling
  8. Code Packaging & Libraries
  9. Object-Oriented & Functional Paradigms
  10. Memory & Concurrency
- Structure per topic:
  - Lessons & Interactive Examples
  - Checkpoint Quiz
  - Minimum 5 Coding Problems (2 Easy, 2 Medium, 1 Difficult)
  - 1–2 Assignments (Medium or Difficult, never Easy)

## 3. Code Execution Architecture
- Isolated ephemeral sandboxes (Linux namespaces, cgroups v2, seccomp filters, no network).
- Multi-language compilers: GCC 13 (C17), G++ 13 (C++20), OpenJDK 21, Python 3.12, Node 20 / SWC.
- Resource constraints: 2.0s wall time, 1.0s CPU time, 128–512MB RAM, 30 PID limit.
- Asynchronous execution worker pool backed by BullMQ & Redis.

## 4. AI Orchestration
- Socratic Tutor: Iterative guidance, question-based hints, solution shield.
- AI Debugger: Traceback explanations and logic fault localization.
- AI Code Review: Time/Space complexity evaluation and clean code heuristics.
- AI Learning Coach: Velocity analysis and cognitive load mitigation.
- Mistake Memory: Semantic vector store using `pgvector`.

## 5. Gamification & Mastery
- XP Economy: Granular rewards for lessons, quizzes, problems, assignments, streaks.
- Level Curve: Exponential progression $\text{XP} = \lfloor 100 \times (L - 1)^{1.65} \rfloor$.
- Mastery Model: Bayesian Knowledge Tracing (BKT) tracking probability of concept mastery.
