import { IMultimodalRepository } from '../../repositories/interfaces/IMultimodalRepository';
import { AssetType, AnalysisResultDto } from '@codeforge/shared';

export class DocumentUnderstandingService {
  constructor(private multimodalRepo: IMultimodalRepository) {}

  public async analyzeDocument(assetId: string): Promise<AnalysisResultDto> {
    const asset = await this.multimodalRepo.getMediaAsset(assetId);
    if (!asset) {
      throw new Error(`Media asset with ID '${assetId}' not found.`);
    }
    if (asset.assetType !== AssetType.DOCUMENT) {
      throw new Error(`Media asset with ID '${assetId}' is not a document.`);
    }

    const mockTags = ['financials', 'pdf', 'textbook', 'report'];
    const mockMetadata = {
      pageCount: 5,
      language: 'en',
      author: 'Financial AI Engine',
    };

    const result = await this.multimodalRepo.createAnalysisResult({
      assetId,
      detectedTags: mockTags,
      ocrText: 'Document content overview: Financial statements and earnings details.',
      confidenceScore: 0.98,
      metadata: mockMetadata,
    });

    return result;
  }
}
