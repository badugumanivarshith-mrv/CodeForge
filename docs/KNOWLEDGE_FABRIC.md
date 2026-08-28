# CodeForge V2 — Knowledge Fabric Documentation

## Overview
The **Knowledge Fabric** powers CodeForge V2's cross-domain, interconnected knowledge graph. It enables autonomous agents to traverse semantic links, discover relevant concepts across disparate domains, and detect knowledge gaps.

---

## Domain Taxonomy
The Knowledge Fabric organizes concepts into 6 key domains:
1. **`ARCHITECTURE`**: System blueprints, distributed design patterns, data pipelines, and infrastructure layers.
2. **`ENGINEERING`**: Programming languages, algorithms, data structures, runtime characteristics, and frameworks.
3. **`CAREER`**: Job market requirements, career trajectories, interview competencies, and salary benchmarks.
4. **`SECURITY`**: Vulnerability classifications, cryptography, threat modeling, and zero-trust policies.
5. **`ECOSYSTEM`**: Plugins, tool integrations, marketplace agents, and third-party APIs.
6. **`GENERAL`**: Cross-cutting utilities, documentation, and conceptual taxonomies.

---

## Graph Structure & Heuristics

```
(Entity: "PostgreSQL") ──[DEPENDS_ON (0.95)]──> (Entity: "Drizzle ORM")
         │
 [IMPLEMENTS (0.8)]
         v
(Entity: "ACID Transactions") <──[REQUIRES (1.0)]── (Entity: "Monetary Ledger")
```

### 1. Entity Nodes (`knowledge_graph_entities`)
Entities maintain a unique name, domain classification, markdown description, and metadata tags with confidence weights.

### 2. Directional Edges (`knowledge_graph_edges`)
Relations connect source and target entities with relation types (`DEPENDS_ON`, `IMPLEMENTS`, `REQUIRES`, `RELATES_TO`, `EXTENDS`, `SUBSTITUTES`) and weighted strength values (0.0 to 1.0).

### 3. Concept Discovery & Gap Detection
- **Concept Discovery**: Traverses 1-hop and 2-hop neighborhoods to enrich agent prompt contexts with relevant adjacent concepts.
- **Knowledge Gap Detection**: Identifies orphan entities without outgoing or incoming relationships, notifying users or autonomous research agents to conduct deep-dive investigations.
