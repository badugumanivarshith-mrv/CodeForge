import {
  MediaAssetDto,
  CreateMediaAssetDto,
  AnalysisResultDto,
  CreateAnalysisResultDto,
  ReasoningSessionDto,
  CreateReasoningSessionDto,
  MultimodalKnowledgeDto,
  CreateMultimodalKnowledgeDto,
  MultimodalOverviewDto,
} from '@codeforge/shared';

export interface IMultimodalRepository {
  createMediaAsset(dto: CreateMediaAssetDto): Promise<MediaAssetDto>;
  getMediaAsset(id: string): Promise<MediaAssetDto | null>;
  listMediaAssets(): Promise<MediaAssetDto[]>;

  createAnalysisResult(dto: CreateAnalysisResultDto): Promise<AnalysisResultDto>;
  getAnalysisResult(id: string): Promise<AnalysisResultDto | null>;
  getAnalysisResultByAsset(assetId: string): Promise<AnalysisResultDto | null>;
  listAnalysisResults(): Promise<AnalysisResultDto[]>;

  createReasoningSession(dto: CreateReasoningSessionDto, steps: string[], output: string, confidence: number): Promise<ReasoningSessionDto>;
  getReasoningSession(id: string): Promise<ReasoningSessionDto | null>;
  listReasoningSessions(): Promise<ReasoningSessionDto[]>;

  createMultimodalKnowledge(dto: CreateMultimodalKnowledgeDto): Promise<MultimodalKnowledgeDto>;
  getMultimodalKnowledge(id: string): Promise<MultimodalKnowledgeDto | null>;
  listMultimodalKnowledge(): Promise<MultimodalKnowledgeDto[]>;

  getOverview(): Promise<MultimodalOverviewDto>;
}
