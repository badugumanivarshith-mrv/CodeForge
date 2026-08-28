import { Router } from 'express';
import { PlanetaryIntelligenceController } from '../../controllers/planetaryIntelligence.controller';
import { authGuard } from '../../middleware/authMiddleware';

const router = Router();

// Planetary Command Center
router.get('/command-center/overview', authGuard, PlanetaryIntelligenceController.getCommandCenterOverview);

// Planetary Clusters & Mesh
router.get('/clusters', authGuard, PlanetaryIntelligenceController.listClusters);
router.get('/mesh', authGuard, PlanetaryIntelligenceController.getCollaborationMesh);

// Civilization Engine
router.get('/civilization/health', authGuard, PlanetaryIntelligenceController.getCivilizationHealth);
router.post('/civilization/report', authGuard, PlanetaryIntelligenceController.generateCivilizationReport);
router.get('/civilization/reports', authGuard, PlanetaryIntelligenceController.listCivilizationReports);

// Governance Platform
router.get('/governance/policies', authGuard, PlanetaryIntelligenceController.listPolicies);
router.post('/governance/policies', authGuard, PlanetaryIntelligenceController.proposePolicy);
router.post('/governance/policies/:id/simulate', authGuard, PlanetaryIntelligenceController.simulatePolicy);
router.post('/governance/policies/:id/enact', authGuard, PlanetaryIntelligenceController.enactPolicy);

// Planetary Digital Twins
router.get('/twins', authGuard, PlanetaryIntelligenceController.listTwins);
router.post('/twins', authGuard, PlanetaryIntelligenceController.createTwin);
router.post('/twins/:id/simulate', authGuard, PlanetaryIntelligenceController.simulateTwin);

// Innovation Network
router.get('/innovations', authGuard, PlanetaryIntelligenceController.listInnovations);
router.post('/innovations', authGuard, PlanetaryIntelligenceController.recordInnovation);
router.get('/innovations/ranking/:domain', authGuard, PlanetaryIntelligenceController.rankInnovations);

// Research Civilization
router.get('/research/federations', authGuard, PlanetaryIntelligenceController.listResearchFederations);
router.post('/research/federations', authGuard, PlanetaryIntelligenceController.createResearchFederation);
router.post('/research/federations/:id/collaborations', authGuard, PlanetaryIntelligenceController.launchCollaboration);

// Economic Intelligence
router.get('/economic/signals', authGuard, PlanetaryIntelligenceController.listEconomicSignals);
router.post('/economic/forecast', authGuard, PlanetaryIntelligenceController.generateEconomicForecast);

// Agent Federation
router.get('/agents/federations', authGuard, PlanetaryIntelligenceController.listAgentFederations);
router.post('/agents/federations', authGuard, PlanetaryIntelligenceController.formAgentFederation);
router.post('/agents/delegate', authGuard, PlanetaryIntelligenceController.delegateTask);

// Strategic Foresight
router.get('/foresight/forecasts', authGuard, PlanetaryIntelligenceController.listStrategicForecasts);
router.post('/foresight/forecasts', authGuard, PlanetaryIntelligenceController.generateStrategicForecast);

export default router;
