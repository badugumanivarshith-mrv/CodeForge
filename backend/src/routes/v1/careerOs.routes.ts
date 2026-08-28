import { Router } from 'express';
import { careerOsController } from '../../controllers/careerOs.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const careerOsRouter = Router();

// 1. Digital Twin
careerOsRouter.get('/twin', authGuard, (req, res, next) => careerOsController.getTwin(req, res, next));
careerOsRouter.put('/twin', authGuard, (req, res, next) => careerOsController.updateTwin(req, res, next));
careerOsRouter.get('/snapshots', authGuard, (req, res, next) => careerOsController.getSnapshots(req, res, next));
careerOsRouter.post('/events', authGuard, (req, res, next) => careerOsController.recordEvent(req, res, next));
careerOsRouter.get('/events', authGuard, (req, res, next) => careerOsController.listEvents(req, res, next));

// 2. AI Career Coach
careerOsRouter.post('/coach/report', authGuard, (req, res, next) => careerOsController.generateCoachingReport(req, res, next));
careerOsRouter.get('/coach/latest', authGuard, (req, res, next) => careerOsController.getLatestCoachingReport(req, res, next));
careerOsRouter.get('/coach/reports', authGuard, (req, res, next) => careerOsController.listCoachingReports(req, res, next));

// 3. Skill Intelligence
careerOsRouter.get('/skills', (req, res, next) => careerOsController.getSkillIntelligence(req, res, next));

// 4. Salary Intelligence
careerOsRouter.get('/salary', authGuard, (req, res, next) => careerOsController.getSalaryIntelligence(req, res, next));

// 5. Personal Brand
careerOsRouter.get('/brand', authGuard, (req, res, next) => careerOsController.getPersonalBrand(req, res, next));
careerOsRouter.put('/brand', authGuard, (req, res, next) => careerOsController.updatePersonalBrand(req, res, next));

// 6. Network Intelligence
careerOsRouter.get('/network', authGuard, (req, res, next) => careerOsController.getNetworkIntelligence(req, res, next));
careerOsRouter.post('/network/connections', authGuard, (req, res, next) => careerOsController.addConnection(req, res, next));
careerOsRouter.get('/network/connections', authGuard, (req, res, next) => careerOsController.listConnections(req, res, next));
careerOsRouter.delete('/network/connections/:connectionId', authGuard, (req, res, next) => careerOsController.deleteConnection(req, res, next));

// 7. Timeline & Milestones
careerOsRouter.get('/timeline', authGuard, (req, res, next) => careerOsController.getTimeline(req, res, next));
careerOsRouter.post('/milestones', authGuard, (req, res, next) => careerOsController.createMilestone(req, res, next));
careerOsRouter.put('/milestones/:milestoneId/achieve', authGuard, (req, res, next) => careerOsController.achieveMilestone(req, res, next));

// 8. Career Predictions
careerOsRouter.get('/predictions', authGuard, (req, res, next) => careerOsController.getPredictions(req, res, next));
careerOsRouter.post('/predictions/generate', authGuard, (req, res, next) => careerOsController.generatePredictions(req, res, next));

// 9. Career Goals & Roadmap
careerOsRouter.post('/goals', authGuard, (req, res, next) => careerOsController.createGoal(req, res, next));
careerOsRouter.get('/goals', authGuard, (req, res, next) => careerOsController.listGoals(req, res, next));
careerOsRouter.put('/goals/:goalId', authGuard, (req, res, next) => careerOsController.updateGoal(req, res, next));
careerOsRouter.delete('/goals/:goalId', authGuard, (req, res, next) => careerOsController.deleteGoal(req, res, next));
careerOsRouter.get('/roadmap', authGuard, (req, res, next) => careerOsController.getRoadmap(req, res, next));
