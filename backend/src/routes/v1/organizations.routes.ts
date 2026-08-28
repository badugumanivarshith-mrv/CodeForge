import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const organizationsRouter = Router();

organizationsRouter.get('/', (req, res, next) => enterpriseController.listOrganizations(req, res, next));
organizationsRouter.post('/', authGuard, (req, res, next) =>
  enterpriseController.createOrganization(req, res, next),
);
organizationsRouter.get('/:idOrSlug', (req, res, next) =>
  enterpriseController.getOrganization(req, res, next),
);
organizationsRouter.put('/:id', authGuard, (req, res, next) =>
  enterpriseController.updateOrganization(req, res, next),
);

// Members
organizationsRouter.get('/:id/members', (req, res, next) =>
  enterpriseController.listMembers(req, res, next),
);
organizationsRouter.post('/:id/members', authGuard, (req, res, next) =>
  enterpriseController.addMember(req, res, next),
);

// Departments
organizationsRouter.get('/:id/departments', (req, res, next) =>
  enterpriseController.listDepartments(req, res, next),
);
organizationsRouter.post('/:id/departments', authGuard, (req, res, next) =>
  enterpriseController.createDepartment(req, res, next),
);

// Teams
organizationsRouter.get('/:id/teams', (req, res, next) =>
  enterpriseController.listTeams(req, res, next),
);
organizationsRouter.post('/:id/teams', authGuard, (req, res, next) =>
  enterpriseController.createTeam(req, res, next),
);

// Cohorts
organizationsRouter.get('/:id/cohorts', (req, res, next) =>
  enterpriseController.listCohorts(req, res, next),
);
organizationsRouter.post('/:id/cohorts', authGuard, (req, res, next) =>
  enterpriseController.createCohort(req, res, next),
);

// White Label Branding
organizationsRouter.get('/:orgIdOrSlug/branding', (req, res, next) =>
  enterpriseController.getWhiteLabelConfig(req, res, next),
);
organizationsRouter.put('/:orgId/branding', authGuard, (req, res, next) =>
  enterpriseController.updateWhiteLabelConfig(req, res, next),
);
