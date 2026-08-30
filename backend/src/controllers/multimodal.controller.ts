import { Request, Response, NextFunction } from 'express';
import { multimodalEngineService } from '../modules/multimodal';
import { AssetType, ReasoningComplexity } from '@codeforge/shared';

export class MultimodalController {
  public analyzeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, storageUrl, fileSizeCharacters } = req.body;
      if (!name || !storageUrl) {
        res.status(400).json({ success: false, error: 'Parameters "name" and "storageUrl" are required.' });
        return;
      }

      const outcome = await multimodalEngineService.registerAndAnalyzeAsset({
        name,
        storageUrl,
        assetType: AssetType.IMAGE,
        fileSizeCharacters: fileSizeCharacters || 1000,
      });

      res.status(200).json({
        success: true,
        data: outcome,
      });
    } catch (err) {
      next(err);
    }
  };

  public analyzeDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, storageUrl, fileSizeCharacters } = req.body;
      if (!name || !storageUrl) {
        res.status(400).json({ success: false, error: 'Parameters "name" and "storageUrl" are required.' });
        return;
      }

      const outcome = await multimodalEngineService.registerAndAnalyzeAsset({
        name,
        storageUrl,
        assetType: AssetType.DOCUMENT,
        fileSizeCharacters: fileSizeCharacters || 1000,
      });

      res.status(200).json({
        success: true,
        data: outcome,
      });
    } catch (err) {
      next(err);
    }
  };

  public reason = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionName, complexity, promptQuery } = req.body;
      if (!sessionName || !complexity || !promptQuery) {
        res.status(400).json({ success: false, error: 'Parameters "sessionName", "complexity", and "promptQuery" are required.' });
        return;
      }

      const session = await multimodalEngineService.performReasoning({
        sessionName,
        complexity: complexity as ReasoningComplexity,
        promptQuery,
      });

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  };

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overview = await multimodalEngineService.getOverview();
      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const multimodalController = new MultimodalController();
