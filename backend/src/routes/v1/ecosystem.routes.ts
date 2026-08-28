import { Router } from 'express';
import { EcosystemController } from '../../controllers/ecosystem.controller';
import { authGuard } from '../../middleware/authMiddleware';

const router = Router();

// Public / Authenticated Marketplace Overview & Catalog
router.get('/overview', authGuard, EcosystemController.getOverview);
router.get('/agents', authGuard, EcosystemController.listAgents);
router.get('/agents/:id', authGuard, EcosystemController.getAgentById);
router.post('/agents', authGuard, EcosystemController.publishAgent);
router.post('/agents/:agentId/download', authGuard, EcosystemController.downloadAgent);
router.post('/agents/reviews', authGuard, EcosystemController.submitReview);
router.get('/agents/:agentId/reviews', authGuard, EcosystemController.listReviews);

// Plugins
router.get('/plugins', authGuard, EcosystemController.listPlugins);
router.post('/plugins/install', authGuard, EcosystemController.installPlugin);
router.get('/plugins/installs', authGuard, EcosystemController.listUserInstalls);
router.patch('/plugins/installs/:installId/toggle', authGuard, EcosystemController.togglePlugin);
router.delete('/plugins/:pluginId/uninstall', authGuard, EcosystemController.uninstallPlugin);

// Integration Hub
router.get('/integrations', authGuard, EcosystemController.listIntegrations);
router.post('/integrations/connect', authGuard, EcosystemController.connectIntegration);
router.post('/integrations/:provider/sync', authGuard, EcosystemController.syncIntegration);
router.delete('/integrations/:provider/disconnect', authGuard, EcosystemController.disconnectIntegration);

// Workflow Templates
router.get('/workflows/templates', authGuard, EcosystemController.listWorkflowTemplates);
router.post('/workflows/templates/:templateId/clone', authGuard, EcosystemController.cloneWorkflowTemplate);

// Developer Platform
router.post('/developer/api-keys', authGuard, EcosystemController.generateApiKey);
router.get('/developer/api-keys', authGuard, EcosystemController.listApiKeys);
router.delete('/developer/api-keys/:id', authGuard, EcosystemController.revokeApiKey);
router.get('/developer/sdk-docs', authGuard, EcosystemController.getSdkDocs);

// Webhooks
router.post('/developer/webhooks', authGuard, EcosystemController.registerWebhook);
router.get('/developer/webhooks', authGuard, EcosystemController.listWebhooks);
router.delete('/developer/webhooks/:id', authGuard, EcosystemController.deleteWebhook);

// Monetization & Creator
router.post('/monetization/purchase/agent/:agentId', authGuard, EcosystemController.purchaseAgent);
router.post('/monetization/payouts/request', authGuard, EcosystemController.requestPayout);
router.get('/creator/analytics', authGuard, EcosystemController.getCreatorAnalytics);

export default router;
