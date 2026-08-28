# CodeForge V2 — Distributed Workflow Engine Documentation

## Overview
The **Distributed Workflow Engine** coordinates multi-step DAG (Directed Acyclic Graph) pipelines, parallel task executions, dynamic branching, retry policies, and nested workflows.

---

## Workflow Types
- **`CAREER_WORKFLOW`**: Automated resume evaluation, skill gap diagnostics, mock interview pipeline, and job application submission.
- **`LEARNING_WORKFLOW`**: Personalized curriculum sequencing, problem-solving checkpoints, and adaptive topic reinforcement.
- **`HIRING_WORKFLOW`**: Multi-stage candidate assessment, code review evaluation, behavioral scoring, and recruiter briefing.
- **`RESEARCH_WORKFLOW`**: Topic deep-dive, multi-source literature synthesis, cross-validation, and report generation.
- **`PROJECT_WORKFLOW`**: Architecture blueprinting, code scaffolding, automated testing, security audit, and deployment.
- **`ENTERPRISE_WORKFLOW`**: Cohort onboarding, compliance verification, executive skill analytics, and department reporting.

---

## Execution Model

```
       [Step 1: Ingest Data / Source]
                    |
          +---------+---------+
          |                   |
          v                   v
  [Step 2A: Analysis]  [Step 2B: Validation]
          |                   |
          +---------+---------+
                    |
                    v
       [Step 3: Synthesis / Output]
```

### 1. Step Dependency Resolution
Each step in `workflow_steps` can define `dependsOnStepIds: string[]`. A step cannot execute until all prerequisite steps have completed successfully.

### 2. Failure Isolation & Retry Policies
Failed steps trigger configurable exponential backoff retry policies. If retries are exhausted, the workflow run captures the error diagnostics while retaining completed upstream artifacts.

### 3. Execution Context Forwarding
Data produced by upstream steps is aggregated into a continuous execution context payload and forwarded to downstream steps, enabling complex multi-agent collaborative execution.
