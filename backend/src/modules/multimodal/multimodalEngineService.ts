import { IMultimodalRepository } from '../../repositories/interfaces/IMultimodalRepository';
import { VisionAnalysisService } from './visionAnalysisService';
import { DocumentUnderstandingService } from './documentUnderstandingService';
import { MediaReasoningService } from './mediaReasoningService';
import {
  CreateMediaAssetDto,
  MediaAssetDto,
  AnalysisResultDto,
  CreateReasoningSessionDto,
  ReasoningSessionDto,
  MultimodalOverviewDto,
} from '@codeforge/shared';

export class MultimodalEngineService {
  private visionAnalysisService: VisionAnalysisService;
  private documentUnderstandingService: DocumentUnderstandingService;
  private mediaReasoningService: MediaReasoningService;

  constructor(private multimodalRepo: IMultimodalRepository) {
    this.visionAnalysisService = new VisionAnalysisService(multimodalRepo);
    this.documentUnderstandingService = new DocumentUnderstandingService(multimodalRepo);
    this.mediaReasoningService = new MediaReasoningService(multimodalRepo);
  }

  public async registerAndAnalyzeAsset(dto: CreateMediaAssetDto): Promise<{
    asset: MediaAssetDto;
    result: AnalysisResultDto;
  }> {
    const asset = await this.multimodalRepo.createMediaAsset(dto);
    let result: AnalysisResultDto;

    if (dto.assetType === 'image') {
      result = await this.visionAnalysisService.analyzeImage(asset.id);
    } else if (dto.assetType === 'document') {
      result = await this.documentUnderstandingService.analyzeDocument(asset.id);
    } else {
      // Fallback for audio/video assets
      result = await this.multimodalRepo.createAnalysisResult({
        assetId: asset.id,
        detectedTags: ['media_stream'],
        confidenceScore: 0.90,
        metadata: { durationSec: 120 },
      });
    }

    return { asset, result };
  }

  public async performReasoning(dto: CreateReasoningSessionDto): Promise<ReasoningSessionDto> {
    const session = await this.mediaReasoningService.reason(dto);

    // Extract concepts from reasoning output to populate knowledgeBase
    await this.multimodalRepo.createMultimodalKnowledge({
      conceptName: `Derived: ${dto.sessionName}`,
      associatedTags: ['reasoning', dto.complexity],
      crossMediaSummary: session.cognitiveOutput,
      extractedRelations: [{ targetConcept: 'Unified Engine Logic', predicate: 'maps_to' }],
    });

    return session;
  }

  public async getOverview(): Promise<MultimodalOverviewDto> {
    return this.multimodalRepo.getOverview();
  }
}
