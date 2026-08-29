import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { StartupBuilderController } from '../../controllers/startupBuilder.controller';

const router = Router();
const controller = new StartupBuilderController();

// 1. Overview
router.get('/overview', authGuard, (req, res) => controller.getOverview(req, res));

// 2. Startups
router.post('/startups', authGuard, (req, res) => controller.createStartup(req, res));
router.get('/startups', authGuard, (req, res) => controller.listStartups(req, res));
router.get('/startups/:id', authGuard, (req, res) => controller.getStartup(req, res));
router.get('/startups/:id/blueprint', authGuard, (req, res) => controller.getStartupBlueprint(req, res));
router.get('/startups/:id/viability', authGuard, (req, res) => controller.validateViability(req, res));
router.post('/startups/:id/advance-stage', authGuard, (req, res) => controller.advanceStage(req, res));
router.post('/startups/:id/pivot', authGuard, (req, res) => controller.executePivot(req, res));

// 3. Ideas
router.post('/ideas/generate', authGuard, (req, res) => controller.generateIdea(req, res));
router.get('/ideas', authGuard, (req, res) => controller.listIdeas(req, res));

// 4. Market Intelligence
router.post('/market/report', authGuard, (req, res) => controller.generateMarketReport(req, res));
router.get('/market/reports', authGuard, (req, res) => controller.listMarketReports(req, res));

// 5. AI Founder
router.post('/ai-founder/decision', authGuard, (req, res) => controller.getFounderDecisionSupport(req, res));
router.get('/ai-founder/:startupId/strategic-plan', authGuard, (req, res) => controller.getStrategicPlan(req, res));

// 6. Product Incubation
router.post('/incubations', authGuard, (req, res) => controller.incubateProduct(req, res));
router.get('/incubations', authGuard, (req, res) => controller.listIncubations(req, res));
router.get('/incubations/:id/pmf', authGuard, (req, res) => controller.getProductMarketFit(req, res));

// 7. Customer Discovery
router.post('/customer-discovery/persona', authGuard, (req, res) => controller.generatePersona(req, res));
router.get('/customer-discovery/:startupId/feedback', authGuard, (req, res) => controller.getDiscoveryFeedback(req, res));

// 8. Growth Engine
router.post('/growth/forecast', authGuard, (req, res) => controller.generateGrowthForecast(req, res));
router.get('/growth/:startupId/unit-economics', authGuard, (req, res) => controller.getUnitEconomics(req, res));

// 9. Venture Portfolio
router.post('/portfolios', authGuard, (req, res) => controller.createPortfolio(req, res));
router.get('/portfolios', authGuard, (req, res) => controller.listPortfolios(req, res));
router.get('/portfolios/:id/health', authGuard, (req, res) => controller.getPortfolioHealth(req, res));

// 10. Fundraising
router.get('/fundraising/:startupId/readiness', authGuard, (req, res) => controller.getFundraisingReadiness(req, res));
router.get('/fundraising/:startupId/match-investors', authGuard, (req, res) => controller.getMatchedInvestors(req, res));
router.post('/fundraising/simulate', authGuard, (req, res) => controller.simulateFunding(req, res));

export default router;
