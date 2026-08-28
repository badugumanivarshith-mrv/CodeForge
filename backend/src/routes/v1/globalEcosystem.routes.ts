import { Router } from 'express';
import { GlobalEcosystemController } from '../../controllers/globalEcosystem.controller';
import { authGuard } from '../../middleware/authMiddleware';

const router = Router();

// Module 1: Global AI Network
router.post('/network/nodes', authGuard, GlobalEcosystemController.registerNode);
router.post('/network/edges', authGuard, GlobalEcosystemController.connectNodes);
router.get('/network/graph', GlobalEcosystemController.getGraph);
router.get('/network/recommendations/:nodeId', GlobalEcosystemController.getRecommendations);
router.get('/network/rankings', GlobalEcosystemController.getRankings);

// Module 2: Collective Intelligence Engine
router.post('/collective/knowledge', authGuard, GlobalEcosystemController.submitCrowdKnowledge);
router.get('/collective/consensus', GlobalEcosystemController.getConsensus);
router.get('/collective/trends', GlobalEcosystemController.getEmergingTrends);

// Module 3: Autonomous Enterprise Platform
router.post('/enterprise/departments', authGuard, GlobalEcosystemController.createDepartment);
router.get('/enterprise/departments/:orgId', authGuard, GlobalEcosystemController.listDepartments);
router.post('/enterprise/projects', authGuard, GlobalEcosystemController.createEnterpriseProject);
router.get('/enterprise/optimization/:orgId', authGuard, GlobalEcosystemController.getEnterpriseOptimization);

// Module 4: Global Talent Cloud
router.post('/talent/profile', authGuard, GlobalEcosystemController.createOrUpdateTalentProfile);
router.get('/talent/profile/:userId', GlobalEcosystemController.getTalentProfile);
router.get('/talent/search', GlobalEcosystemController.searchTalent);
router.post('/talent/verify-skill', authGuard, GlobalEcosystemController.requestSkillVerification);
router.post('/talent/match', authGuard, GlobalEcosystemController.matchTalent);

// Module 5: AI Entrepreneurship Platform
router.post('/startups', authGuard, GlobalEcosystemController.launchStartup);
router.get('/startups', GlobalEcosystemController.listStartups);
router.get('/startups/:startupId/intelligence', GlobalEcosystemController.getVentureIntelligence);

// Module 6: Global Research Network
router.post('/research/papers', authGuard, GlobalEcosystemController.publishPaper);
router.get('/research/papers', GlobalEcosystemController.listPapers);

// Module 7: Digital Twin Ecosystem
router.post('/digital-twins', authGuard, GlobalEcosystemController.createTwin);
router.get('/digital-twins', GlobalEcosystemController.listTwins);
router.post('/digital-twins/:twinId/simulate', authGuard, GlobalEcosystemController.runTwinSimulation);

// Module 8: AI Economy & Token System
router.get('/economy/reputation/:userId', GlobalEcosystemController.getReputation);
router.post('/economy/reward', authGuard, GlobalEcosystemController.rewardContribution);

// Module 9: Self-Improving AI Ecosystem
router.get('/self-improvement/metrics', GlobalEcosystemController.getLearningMetrics);
router.post('/self-improvement/cycle', authGuard, GlobalEcosystemController.triggerSelfImprovement);

// Module 10: Global Command Center & Superintelligence
router.get('/command-center/overview', GlobalEcosystemController.getCommandCenterOverview);
router.get('/superintelligence/insights', GlobalEcosystemController.getStrategicInsights);

export default router;
