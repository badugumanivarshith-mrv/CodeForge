# CodeForge V2 — Persistent Agent Cloud Documentation

## Overview
The **Persistent AI Agent Cloud** in CodeForge V2 manages always-on, autonomous agents designed for long-running workflows, automated background tasks, recurring cron schedules, and resilient recovery.

---

## Agent Lifecycle Finite State Machine (FSM)

```
        +--------------+
        |   CREATED    |
        +-------+------+
                | (Start / Enqueue)
                v
        +-------+------+
        |    QUEUED    |
        +-------+------+
                | (Worker Dispatch)
                v
        +-------+------+ <-----------------+
        |   RUNNING    |                   |
        +---+----+---+-+                   |
            |    |   |                     |
  (Pause)   |    |   | (Wait Event/Dep)    | (Resume / Trigger)
            v    |   v                     |
      +-----+--+ | +-+-----+               |
      | PAUSED | | |WAITING|---------------+
      +-----+--+ | +-------+
            |    |
            |    +--------------------+---------------------+
            |                         |                     |
            v (Terminal Fail)         v (Success)           v (Stop)
      +-----+----+              +-----+-----+         +-----+------+
      |  FAILED  |              | COMPLETED |         | TERMINATED |
      +----------+              +-----------+         +------------+
```

---

## Key Features

### 1. Persistent Agent Runtime & State Store
Agents maintain persistent records in the `agent_instances` PostgreSQL table with configurations, context window state, role definitions (`CODER`, `REVIEWER`, `RESEARCHER`, `ARCHITECT`, `COACH`, `SECURITY_AUDITOR`, `AUTONOMOUS_OPERATOR`), and current health indicators.

### 2. Autonomous Background Execution & Task Queue
- Agents receive tasks asynchronously through `agent_tasks`.
- Asynchronous task processing tracks priority levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), execution input parameters, token consumption, and execution duration.

### 3. Recurring Schedules (Cron Engine)
Agents can be bound to scheduled cron jobs stored in `agent_schedules` to trigger routine maintenance, code quality audits, learning digest generations, or dependency vulnerabilities scans automatically.

### 4. Self-Healing & Crash Recovery
When the host application restarts, the `agentCloudService.recoverAgents()` routine scans for orphan agent instances left in `RUNNING` or `QUEUED` states, transitions lingering runs safely, and re-enqueues actionable tasks without state corruption.

### 5. Health Monitoring & Metrics
Continuous calculation of uptime percentages, total execution runs, success/failure ratios, average step latency, and token expenditure.
