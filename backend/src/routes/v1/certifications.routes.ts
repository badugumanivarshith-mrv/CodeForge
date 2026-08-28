import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const certificationsRouter = Router();

// Templates
certificationsRouter.get('/templates', (req, res, next) =>
  enterpriseController.listCertificateTemplates(req, res, next),
);
certificationsRouter.post('/templates', authGuard, (req, res, next) =>
  enterpriseController.createCertificateTemplate(req, res, next),
);

// Issuance & Retrieval
certificationsRouter.post('/issue', authGuard, (req, res, next) =>
  enterpriseController.issueCertificate(req, res, next),
);
certificationsRouter.get('/user/:userId', (req, res, next) =>
  enterpriseController.listUserCertificates(req, res, next),
);
certificationsRouter.get('/:id', (req, res, next) => enterpriseController.getCertificate(req, res, next));
certificationsRouter.post('/:id/revoke', authGuard, (req, res, next) =>
  enterpriseController.revokeCertificate(req, res, next),
);

// Public Tamper-Resistant Verification
certificationsRouter.get('/public/verify/:identifier', (req, res, next) =>
  enterpriseController.verifyCertificatePublic(req, res, next),
);
