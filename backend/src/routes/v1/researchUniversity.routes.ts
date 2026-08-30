import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { researchUniversityController as controller } from '../../controllers/researchUniversity.controller';

const router = Router();

// 1. Overview & Metrics
router.get('/overview', authGuard, (req, res) => controller.getOverview(req, res));
router.get('/metrics', authGuard, (req, res) => controller.getMetrics(req, res));

// 2. Academic Programs & Projects
router.post('/programs', authGuard, (req, res) => controller.proposeProgram(req, res));
router.get('/programs', authGuard, (req, res) => controller.listPrograms(req, res));
router.get('/programs/:id', authGuard, (req, res) => controller.getProgram(req, res));
router.post('/programs/:id/activate', authGuard, (req, res) => controller.activateProgram(req, res));
router.post('/projects', authGuard, (req, res) => controller.createProject(req, res));
router.get('/programs/:programId/projects', authGuard, (req, res) => controller.listProjects(req, res));

// 3. Scientific Discovery & Hypotheses
router.post('/hypotheses', authGuard, (req, res) => controller.formulateHypothesis(req, res));
router.get('/hypotheses', authGuard, (req, res) => controller.listHypotheses(req, res));
router.post('/hypotheses/:id/test', authGuard, (req, res) => controller.testHypothesis(req, res));
router.post('/discoveries', authGuard, (req, res) => controller.confirmDiscovery(req, res));
router.get('/discoveries', authGuard, (req, res) => controller.listDiscoveries(req, res));

// 4. Digital Laboratories & Experiments
router.post('/laboratories', authGuard, (req, res) => controller.provisionLaboratory(req, res));
router.get('/laboratories', authGuard, (req, res) => controller.listLaboratories(req, res));
router.get('/laboratories/:id', authGuard, (req, res) => controller.getLaboratory(req, res));
router.get('/laboratories/:id/metrics', authGuard, (req, res) => controller.getLaboratoryMetrics(req, res));
router.post('/experiments', authGuard, (req, res) => controller.runExperiment(req, res));
router.get('/experiments', authGuard, (req, res) => controller.listExperiments(req, res));

// 5. Academic Knowledge Graph
router.post('/knowledge-nodes', authGuard, (req, res) => controller.indexKnowledgeNode(req, res));
router.get('/knowledge-nodes', authGuard, (req, res) => controller.listKnowledgeNodes(req, res));
router.get('/knowledge-graph/lineages', authGuard, (req, res) => controller.getKnowledgeLineages(req, res));

// 6. Publications & Citations
router.post('/publications', authGuard, (req, res) => controller.draftPublication(req, res));
router.get('/publications', authGuard, (req, res) => controller.listPublications(req, res));
router.get('/publications/:id', authGuard, (req, res) => controller.getPublication(req, res));
router.post('/publications/:id/publish', authGuard, (req, res) => controller.publishPaper(req, res));
router.post('/citations', authGuard, (req, res) => controller.citePublication(req, res));
router.get('/publications/:id/citations', authGuard, (req, res) => controller.listCitations(req, res));

// 7. Peer Review Network
router.post('/publications/:publicationId/reviews', authGuard, (req, res) => controller.conductReview(req, res));
router.get('/publications/:publicationId/reviews', authGuard, (req, res) => controller.listReviews(req, res));
router.get('/publications/:publicationId/reviews/consensus', authGuard, (req, res) => controller.getReviewConsensus(req, res));

// 8. Research Funding & Grants
router.post('/grants', authGuard, (req, res) => controller.registerGrant(req, res));
router.get('/grants', authGuard, (req, res) => controller.listGrants(req, res));
router.post('/grants/:grantId/apply', authGuard, (req, res) => controller.applyForGrant(req, res));
router.post('/grants/:grantId/award', authGuard, (req, res) => controller.awardGrant(req, res));

// 9. Global Collaboration Network
router.post('/collaborators', authGuard, (req, res) => controller.registerCollaborator(req, res));
router.get('/collaborators', authGuard, (req, res) => controller.listCollaborators(req, res));
router.post('/collaborators/:collaboratorId/link-project', authGuard, (req, res) => controller.linkCollaboratorProject(req, res));

export default router;
