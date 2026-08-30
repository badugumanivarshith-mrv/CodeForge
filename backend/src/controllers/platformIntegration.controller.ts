import { Request, Response, NextFunction } from 'express';
import {
  platformIntegrationService,
  unifiedContextService,
  orchestrationService,
  crossModuleWorkflowService,
} from '../modules/platform-integration';
export class PlatformIntegrationController {
  public getOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'test-user-id';
      const overview = await platformIntegrationService.getOverview(userId);
      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  };

  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryStr = (req.query.q as string) || '';
      const results = await platformIntegrationService.search(queryStr);
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  };

  public triggerWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'test-user-id';
      const { workflowName, triggerEvent, steps } = req.body;

      if (!workflowName || !triggerEvent || !steps || !Array.isArray(steps)) {
        res.status(400).json({ success: false, error: 'Parameters "workflowName", "triggerEvent", and "steps" array are required.' });
        return;
      }

      const execution = await crossModuleWorkflowService.initiateWorkflow(userId, {
        workflowName,
        triggerEvent,
        steps,
      });

      // Orchestrate the first step asynchronously or trigger simulation loop
      await orchestrationService.orchestrateStep(execution.id, 1, true);

      const finalExecution = await crossModuleWorkflowService.getWorkflow(execution.id);

      res.status(200).json({
        success: true,
        data: finalExecution,
      });
    } catch (err) {
      next(err);
    }
  };

  public getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const health = await platformIntegrationService.getHealth();
      res.status(200).json({
        success: true,
        data: health,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const platformIntegrationController = new PlatformIntegrationController();
