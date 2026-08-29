# Phase 21: REST API & Database Schema Reference

## 1. REST API Endpoints

### Deal Flow & Diligence Endpoints
- `GET /api/v1/venture-capital/overview` - Retrieves executive command center metrics, funds, and pipeline.
- `GET /api/v1/venture-capital/deals` - Lists deals with optional stage/category filter.
- `POST /api/v1/venture-capital/deals` - Sinks a new startup deal into the pipeline.
- `PUT /api/v1/venture-capital/deals/:id/stage` - Transitions a deal across Kanban stages.
- `GET /api/v1/venture-capital/due-diligence/:startupId` - Retrieves comprehensive diligence report.

### Investment Committee & Fund Endpoints
- `POST /api/v1/venture-capital/committee/debate` - Runs multi-agent committee debate.
- `POST /api/v1/venture-capital/committee/vote` - Casts quorum votes and formulates consensus decision.
- `GET /api/v1/venture-capital/funds` - Lists fund vehicles.
- `POST /api/v1/venture-capital/funds` - Creates new fund vehicle.
- `POST /api/v1/venture-capital/funds/:id/deploy` - Deploys capital to portfolio company.
- `GET /api/v1/venture-capital/funds/:id/metrics` - Computes DPI, RVPI, TVPI, Gross/Net IRR.

### Portfolio & Exits Endpoints
- `GET /api/v1/venture-capital/portfolio/:fundId/intelligence` - Computes Sharpe/Sortino ratios and health radar.
- `POST /api/v1/venture-capital/exits/simulate` - Simulates exit valuation and proceeds waterfall.
- `GET /api/v1/venture-capital/exits/:fundId/liquidity-forecast` - Returns 12/24/36-month liquidity forecasts.
- `GET /api/v1/venture-capital/investors/lps` - Lists LP profiles.
- `POST /api/v1/venture-capital/syndicates` - Creates syndicate group.
- `POST /api/v1/venture-capital/allocation/:fundId/optimize` - Generates capital allocation plan.

---

## 2. PostgreSQL Drizzle Database Schema

12 Core Tables Defined in `backend/src/database/schema/venture_capital.ts`:
1. `funds` - Fund vehicles, vintage years, target size, fees, and status.
2. `deal_flow` - Startup deals, fit scores, stages, valuations, and target raises.
3. `founder_scores` - Technical depth, conviction, and resilience metrics.
4. `opportunity_scores` - Market TAM, CAGR, and defensibility scores.
5. `due_diligence_reports` - Overall score, recommendation, dimensions, risks, and green lights.
6. `investment_decisions` - Quorum voting, conviction score, proposed check, and debate rationales.
7. `portfolio_holdings` - Invested capital, ownership %, holding value, MOIC, and board seats.
8. `fund_metrics` - DPI, RVPI, TVPI, Gross/Net IRR, NAV, and cumulative distributions.
9. `exit_simulations` - Exit type, valuation, net profit, GP carry, and waterfall tiers.
10. `lp_profiles` - LP type, committed total, preferred sectors, and relationship health.
11. `syndicates` - Target raise, lead partner, carry %, and member allocations.
12. `capital_allocation_plans` - Allocations by stage and sector, buffers, and stress test sensitivities.
