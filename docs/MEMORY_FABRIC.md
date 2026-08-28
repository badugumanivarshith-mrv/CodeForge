# CodeForge V2 — Memory Fabric 2.0 Documentation

## Overview
The **Memory Fabric 2.0** provides persistent, contextual, multi-tiered memory systems across all autonomous agents, teams, and user sessions within CodeForge V2.

---

## Memory Types & Taxonomy

| Memory Type | Description | Retention / Scope |
|---|---|---|
| **`EPISODIC`** | Chronological logs of specific interactions, conversations, and past execution runs. | Long-Term / Historical Context |
| **`SEMANTIC`** | Conceptual knowledge, extracted code snippets, algorithms, and architectural guidelines. | Persistent / Cross-Agent Knowledge Base |
| **`WORKING`** | Short-term scratchpad buffer storing active task parameters, sub-step outputs, and intermediate states. | Ephemeral / Active Run Scope |
| **`PROCEDURAL`** | Operational recipes, step-by-step instructions, troubleshooting playbooks, and build protocols. | Persistent / Standard Operating Procedures |

---

## Multi-Tenant Shared Memory Pools
The Memory Fabric supports cross-agent and cross-team memory sharing governed by explicit read/write permission scopes:
- **Tenant Isolation**: Memory records are bound to specific `tenantId` / `userId` parameters.
- **Shared Access Lists**: Team agents can be granted explicit read or write access to shared knowledge memories through `shared_memories`.
- **Decay & Importance Scoring**: Memories store an `importance` rating (0.0 to 1.0) and contextual tags used by semantic retrieval engines to prioritize high-value context.
