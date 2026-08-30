import { Request, Response, NextFunction } from 'express';
import {
  dataPipelineService,
  analyticsEngineService,
  dataQualityService,
  insightGenerationService,
} from '../modules/data-intelligence';
import { dataIntelligenceRepository } from '../repositories/DataIntelligenceRepository';
import { DataSourceType } from '@codeforge/shared';

export class DataIntelligenceController {
  public importData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, sourceType, connectionDetails, rowCount, fileSizeKb } = req.body;
      if (!name || !sourceType) {
        res.status(400).json({ success: false, error: 'Parameters "name" and "sourceType" are required.' });
        return;
      }

      const source = await dataPipelineService.importData({
        name,
        sourceType: sourceType as DataSourceType,
        connectionDetails: connectionDetails || {},
        rowCount: rowCount || 0,
        fileSizeKb: fileSizeKb || 0,
      });

      // Audit source on import
      await dataQualityService.auditSource(source.id);

      res.status(200).json({
        success: true,
        data: source,
      });
    } catch (err) {
      next(err);
    }
  };

  public listAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobs = await analyticsEngineService.listJobs();
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (err) {
      next(err);
    }
  };

  public listInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const insights = await insightGenerationService.listInsights();
      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (err) {
      next(err);
    }
  };

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overview = await dataIntelligenceRepository.getOverview();
      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const dataIntelligenceController = new DataIntelligenceController();
