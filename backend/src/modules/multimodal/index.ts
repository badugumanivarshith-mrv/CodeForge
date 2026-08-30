import { multimodalRepository } from '../../repositories/MultimodalRepository';
import { VisionAnalysisService } from './visionAnalysisService';
import { DocumentUnderstandingService } from './documentUnderstandingService';
import { MediaReasoningService } from './mediaReasoningService';
import { MultimodalEngineService } from './multimodalEngineService';

export const visionAnalysisService = new VisionAnalysisService(multimodalRepository);
export const documentUnderstandingService = new DocumentUnderstandingService(multimodalRepository);
export const mediaReasoningService = new MediaReasoningService(multimodalRepository);
export const multimodalEngineService = new MultimodalEngineService(multimodalRepository);

export * from './visionAnalysisService';
export * from './documentUnderstandingService';
export * from './mediaReasoningService';
export * from './multimodalEngineService';
