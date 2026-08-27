import { Router } from 'express';
import { PortfolioController } from '../../controllers/portfolio.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const portfolioRouter = Router();
const controller = new PortfolioController();

portfolioRouter.get('/me', authGuard, controller.getMyPortfolio);
portfolioRouter.patch('/settings', authGuard, controller.updateSettings);
portfolioRouter.post('/projects', authGuard, controller.createProject);
portfolioRouter.patch('/projects/:id', authGuard, controller.updateProject);
portfolioRouter.delete('/projects/:id', authGuard, controller.deleteProject);
portfolioRouter.get('/:username', controller.getPublicPortfolio);
