# CodeForge V2 — AI Operating System Architecture Documentation

## Executive Overview
Phase 15 elevates CodeForge from an AI learning, career, and productivity platform to an enterprise-grade **Autonomous Multi-Agent Cloud Platform and AI Operating System Infrastructure**. It delivers the substrate for running persistent, always-on AI agents, multi-stage DAG workflows, asynchronous event streams, self-healing execution fabrics, shared memory systems, distributed knowledge graphs, strategic decision simulations, and zero-trust governance.

---

## High-Level Architecture Diagram

```
+----------------------------------------------------------------------------------------------------+
|                                    CodeForge V2 Frontend Portals                                   |
|   /agent-cloud  |  /workflows  |  /automation  |  /task-os  |  /memory-fabric  |  /governance ...   |
+-------------------------------------------------+--------------------------------------------------+
                                                  | REST API & SSE / WebSocket
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                CodeForge API Gateway & Router Layer                                |
|                                       /api/v1/agent-cloud                                          |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
  +-----------------------------------------------+-----------------------------------------------+
  |                                               |                                               |
  v                                               v                                               v
+-----------------------------+     +-----------------------------+     +-----------------------------+
|   Persistent Agent Cloud    |     |  Distributed Workflow Engine|     |   Event Bus & Automation    |
|  - Lifecycle Management     |     |  - DAG Pipelines            |     |  - Pub/Sub Stream Engine    |
|  - State Persistence Engine |     |  - Dynamic Branching        |     |  - Rule Triggers & Actions  |
|  - Cron Scheduling & Health |     |  - Step Dependency Matrix   |     |  - Scheduled Automations    |
+-----------------------------+     +-----------------------------+     +-----------------------------+
  |                                               |                                               |
  +-----------------------------------------------+-----------------------------------------------+
                                                  |
  +-----------------------------------------------+-----------------------------------------------+
  |                               |                               |                               |
  v                               v                               v                               v
+-------------------+   +-------------------+   +-------------------+   +-------------------+
|  AI Execution     |   |  Memory Fabric    |   | Knowledge Fabric  |   |  AI Decision      |
|  Fabric & Sandbox |   |  2.0 & Continuity |   | Cross-Domain Graph|   |  Center Engine    |
| - Tool Dispatch   |   | - Episodic Store  |   | - Entity Linking  |   | - Scenario Sim    |
| - Quota Tracking  |   | - Semantic Search |   | - Edge Relations  |   | - Risk Analysis   |
| - Safe Execution  |   | - Access Sharing  |   | - Gap Detection   |   | - Pathway Plans   |
+-------------------+   +-------------------+   +-------------------+   +-------------------+
  |                               |                               |                               |
  +-------------------------------+-------------------------------+-------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                          Zero-Trust Governance, Telemetry & Audit Layer                            |
|       - Role-Based Permissions  |  Immutable Audit Trail  |  Real-Time Observability Metrics        |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                            PostgreSQL 16 + Drizzle ORM Storage Tier                                |
|                                (20 Normalized Phase 15 Tables)                                     |
+-------------------------------------------------+--------------------------------------------------+
```

---

## Core System Subsystems

### 1. Persistent Agent Cloud Subsystem
- **Agent Lifecycle**: Manages finite state machines across states: `CREATED`, `QUEUED`, `RUNNING`, `PAUSED`, `WAITING`, `FAILED`, `COMPLETED`, `TERMINATED`.
- **Fault-Tolerant Recovery**: Automatic state recovery upon node restart, reconciling zombie runs and re-enqueuing interrupted tasks.
- **Heartbeat & Telemetry**: Continuous health checks, uptime tracking, error count threshold monitoring, and automated degradation alerts.

### 2. Distributed Workflow Engine Subsystem
- **Directed Acyclic Graphs (DAG)**: Executes complex multi-step pipelines with dependency resolution.
- **Step Dependency Evaluation**: Steps transition from `PENDING` to `RUNNING` only when all prerequisite dependencies resolve with `COMPLETED` status.
- **Dynamic Branching & Retries**: Built-in exponential backoff retry policies and condition-based branch switching.

### 3. Event Bus & Automation Engine Subsystem
- **Decoupled Messaging**: In-memory and persistent event streaming with asynchronous subscriber dispatch.
- **Exception Isolation**: Faulty listener implementations are trapped and logged without crashing the publisher or halting peer event listeners.
- **Rule Automation**: Expression-based condition matching triggering agent runs, webhook calls, and notification pipelines.

### 4. Task Operating System Subsystem
- **Universal Task Graph**: Hierarchical task graphs with auto-calculated dependencies, blockers, and estimated durations.
- **Critical Path Engine**: Dynamically computes the critical path to optimize task prioritization and eliminate project bottlenecks.

### 5. Memory Fabric 2.0 Subsystem
- **Episodic, Semantic, Working & Procedural Memory**: Multi-tier memory classification with importance weighting and context tags.
- **Shared Memory Pools**: Team-level memory sharing governed by explicit read/write permission scopes.

### 6. Knowledge Fabric Subsystem
- **Graph Topology**: Entity nodes linked via directional, weighted relation edges across domains (`ARCHITECTURE`, `ENGINEERING`, `CAREER`, `SECURITY`, `ECOSYSTEM`, `GENERAL`).
- **Concept Discovery & Gap Detection**: Graph traversal heuristics identifying orphan entities, unmapped dependencies, and missing conceptual links.

### 7. AI Decision Center Subsystem
- **Multi-Criteria Optimization**: Evaluates options against weighted scoring criteria (feasibility, impact, resource cost, timeline).
- **Scenario Simulation**: Runs probabilistic simulations calculating risk-adjusted return and confidence intervals.

### 8. Telemetry, Observability & Governance
- **Granular Permissions**: Principle of least privilege enforcement across tool invocations, code execution, and data access.
- **Immutable Audit Trail**: Chronological hashing of system events, agent decisions, and admin mutations.
- **Comprehensive Observability**: Latency tracking, token spend, memory utilization, and active worker metrics.
