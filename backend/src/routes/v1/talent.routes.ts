import { Router } from 'express';
import { TalentController } from '../../controllers/talent.controller';

export const talentRouter = Router();
const controller = new TalentController();

talentRouter.get('/search', controller.search);
