import { Request, Response } from 'express';
import { softwareFactoryService } from '../modules/software-factory';
import { SoftwareProjectType } from '@codeforge/shared';

export class SoftwareFactoryController {
  // 1. Overview & Metrics
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await softwareFactoryService.getOverview();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const data = await softwareFactoryService.getMetrics();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Projects
  async listProjects(req: Request, res: Response): Promise<void> {
    try {
      const type = req.query.projectType as SoftwareProjectType | undefined;
      const data = await softwareFactoryService['repo'].listProjects(type);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async provisionProject(req: Request, res: Response): Promise<void> {
    try {
      const data = await softwareFactoryService.provisionProject(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async runBuildCycle(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.body;
      const data = await softwareFactoryService.runBuildCycle(projectId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const softwareFactoryController = new SoftwareFactoryController();
