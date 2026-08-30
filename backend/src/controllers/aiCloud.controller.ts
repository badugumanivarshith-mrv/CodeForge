import { Request, Response } from 'express';
import { cloudOrchestratorService } from '../modules/ai-cloud';
import { inferenceGatewayService } from '../modules/ai-cloud/inferenceGatewayService';
import { resourceManagementService } from '../modules/ai-cloud/resourceManagementService';
import { ClusterRegion } from '@codeforge/shared';

export class AICloudController {
  // 1. Overview & Metrics
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await cloudOrchestratorService.getOverview();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { clusterId } = req.query;
      if (!clusterId) {
        res.status(400).json({ success: false, error: 'clusterId query parameter is required' });
        return;
      }
      const data = await resourceManagementService.listMetrics(clusterId as string);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Clusters
  async listClusters(req: Request, res: Response): Promise<void> {
    try {
      const region = req.query.region as ClusterRegion | undefined;
      const data = await cloudOrchestratorService['repo'].listClusters(region);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. Deployment
  async deployWorkload(req: Request, res: Response): Promise<void> {
    try {
      const data = await cloudOrchestratorService.deployWorkload(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Inference
  async routeInference(req: Request, res: Response): Promise<void> {
    try {
      const { deploymentId, prompt } = req.body;
      if (!deploymentId || !prompt) {
        res.status(400).json({ success: false, error: 'deploymentId and prompt are required' });
        return;
      }
      const data = await inferenceGatewayService.routeInference(deploymentId, prompt);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const aiCloudController = new AICloudController();
