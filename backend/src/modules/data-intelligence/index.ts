import { dataIntelligenceRepository } from '../../repositories/DataIntelligenceRepository';
import { DataPipelineService } from './dataPipelineService';
import { AnalyticsEngineService } from './analyticsEngineService';
import { DataQualityService } from './dataQualityService';
import { InsightGenerationService } from './insightGenerationService';

export const dataPipelineService = new DataPipelineService(dataIntelligenceRepository);
export const analyticsEngineService = new AnalyticsEngineService(dataIntelligenceRepository);
export const dataQualityService = new DataQualityService(dataIntelligenceRepository);
export const insightGenerationService = new InsightGenerationService(dataIntelligenceRepository);

export * from './dataPipelineService';
export * from './analyticsEngineService';
export * from './dataQualityService';
export * from './insightGenerationService';
