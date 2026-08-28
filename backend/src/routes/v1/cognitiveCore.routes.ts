import { Router } from 'express';
import { CognitiveCoreController } from '../../controllers/cognitiveCore.controller';
import { authGuard } from '../../middleware/authMiddleware';

const router = Router();
const controller = new CognitiveCoreController();

// Command Center Overview & Health
router.get('/overview', authGuard, (req, res) => controller.getExecutiveOverview(req, res));
router.get('/health', authGuard, (req, res) => controller.evaluateCognitiveHealth(req, res));

// Goals & Decomposition
router.get('/goals', authGuard, (req, res) => controller.listGoals(req, res));
router.post('/goals', authGuard, (req, res) => controller.createGoal(req, res));
router.get('/goals/:id', authGuard, (req, res) => controller.getGoal(req, res));

// Reasoning Engine & Metacognition
router.post('/reasoning/trace', authGuard, (req, res) => controller.executeReasoningTrace(req, res));
router.get('/reasoning/traces', authGuard, (req, res) => controller.listReasoningTraces(req, res));

// Memory Evolution (5 Tiers)
router.get('/memory', authGuard, (req, res) => controller.listMemories(req, res));
router.post('/memory', authGuard, (req, res) => controller.storeMemory(req, res));
router.post('/memory/consolidate', authGuard, (req, res) => controller.consolidateMemories(req, res));

// Multi-Agent Councils & Debates
router.get('/councils', authGuard, (req, res) => controller.listCouncils(req, res));
router.post('/councils/debates', authGuard, (req, res) => controller.initiateDebate(req, res));
router.post('/councils/debates/:debateId/votes', authGuard, (req, res) => controller.castVote(req, res));
router.post('/councils/debates/:debateId/resolve', authGuard, (req, res) => controller.resolveConsensus(req, res));

// Autonomous Execution Fabric
router.post('/execution/loop', authGuard, (req, res) => controller.runExecutionLoop(req, res));

// Predictive Intelligence
router.get('/predictions', authGuard, (req, res) => controller.listForecasts(req, res));
router.post('/predictions/generate', authGuard, (req, res) => controller.generateForecast(req, res));

// Personal Digital Brain
router.get('/brain/profile', authGuard, (req, res) => controller.getBrainProfile(req, res));
router.post('/brain/explain', authGuard, (req, res) => controller.explainReasoning(req, res));

// AI Strategy Engine
router.get('/strategy/plans', authGuard, (req, res) => controller.listStrategicPlans(req, res));
router.post('/strategy/plans', authGuard, (req, res) => controller.createStrategicPlan(req, res));

// Self-Reflection & Self-Improvement
router.get('/reflection', authGuard, (req, res) => controller.listReflections(req, res));
router.post('/reflection', authGuard, (req, res) => controller.generateReflection(req, res));
router.get('/improvement', authGuard, (req, res) => controller.listImprovements(req, res));
router.post('/improvement/optimize', authGuard, (req, res) => controller.triggerOptimization(req, res));

export default router;
