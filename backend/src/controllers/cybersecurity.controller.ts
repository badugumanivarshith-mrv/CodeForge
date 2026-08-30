import { Request, Response, NextFunction } from 'express';
import {
  securityMonitoringService,
  threatDetectionService,
  vulnerabilityManagementService,
  incidentResponseService,
} from '../modules/cybersecurity';
import { cybersecurityRepository } from '../repositories/CybersecurityRepository';
import { ThreatSeverity } from '@codeforge/shared';

export class CybersecurityController {
  public listThreats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const threats = await threatDetectionService.listThreats();
      res.status(200).json({
        success: true,
        data: threats,
      });
    } catch (err) {
      next(err);
    }
  };

  public listVulnerabilities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vulns = await vulnerabilityManagementService.listVulnerabilities();
      res.status(200).json({
        success: true,
        data: vulns,
      });
    } catch (err) {
      next(err);
    }
  };

  public declareIncident = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, severity, assignedTeam } = req.body;
      if (!title || !description || !severity || !assignedTeam) {
        res.status(400).json({ success: false, error: 'Parameters "title", "description", "severity", and "assignedTeam" are required.' });
        return;
      }

      const incident = await incidentResponseService.declareIncident({
        title,
        description,
        severity: severity as ThreatSeverity,
        assignedTeam,
      });

      res.status(200).json({
        success: true,
        data: incident,
      });
    } catch (err) {
      next(err);
    }
  };

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overview = await cybersecurityRepository.getOverview();
      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const cybersecurityController = new CybersecurityController();
