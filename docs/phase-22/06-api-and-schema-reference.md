# 06-API & Schema Reference

Lists route mappings and database schemas for Phase 22.

## Express Endpoints

- `GET /api/v1/research-university/overview`: Institutional statistics.
- `GET /api/v1/research-university/metrics`: Metrics dashboard.
- `POST /api/v1/research-university/programs`: Propose program.
- `GET /api/v1/research-university/programs`: List programs.
- `POST /api/v1/research-university/hypotheses`: Formulate theory.
- `POST /api/v1/research-university/discoveries`: Register breakthrough.
- `POST /api/v1/research-university/laboratories`: Provision cluster.
- `POST /api/v1/research-university/experiments`: Execute simulation.
- `POST /api/v1/research-university/publications`: Draft paper.
- `POST /api/v1/research-university/publications/:id/reviews`: Peer review.
- `POST /api/v1/research-university/grants`: Register funding pool.

## Database Tables
- `research_programs`, `research_projects`, `laboratories`, `experiments`, `hypotheses`, `discoveries`, `publications`, `citations`, `peer_reviews`, `grants`, `collaborators`, `academic_knowledge_nodes`, `research_metrics`.
