import { Request, Response, NextFunction } from 'express';
import {
  agentRegistryService,
  taskDelegationService,
} from '../modules/agent-ecosystem';

export class AgentEcosystemController {
  public listAgents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'test-user-id';
      const list = await agentRegistryService.listAgents(userId);
      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (err) {
      next(err);
    }
  };

  public registerAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'test-user-id';
      const { agentName, agentType, capabilities } = req.body;

      if (!agentName || !agentType || !capabilities) {
        res.status(400).json({ success: false, error: 'Parameters "agentName", "agentType", and "capabilities" are required.' });
        return;
      }

      const agent = await agentRegistryService.registerAgent(userId, {
        agentName,
        agentType,
        capabilities,
      });

      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (err) {
      next(err);
    }
  };

  public delegateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'test-user-id';
      const { assignedAgentId, taskDescription, inputParams } = req.body;

      if (!assignedAgentId || !taskDescription || !inputParams) {
        res.status(400).json({ success: false, error: 'Parameters "assignedAgentId", "taskDescription", and "inputParams" are required.' });
        return;
      }

      const task = await taskDelegationService.delegateTask(userId, {
        assignedAgentId,
        taskDescription,
        inputParams,
      });

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (err) {
      next(err);
    }
  };

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'test-user-id';
      const metrics = await agentRegistryService.getMetrics(userId);
      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const agentEcosystemController = new AgentEcosystemController();
