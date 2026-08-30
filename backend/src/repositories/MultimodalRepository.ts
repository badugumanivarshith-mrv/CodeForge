import { IMultimodalRepository } from './interfaces/IMultimodalRepository';
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
  AssetType,
  AnalysisStatus,
  ReasoningComplexity,
} from '@codeforge/shared';

export class MultimodalRepository implements IMultimodalRepository {
  private assetsMap = new Map<string, MediaAssetDto>();
  private resultsMap = new Map<string, AnalysisResultDto>();
  private sessionsMap = new Map<string, ReasoningSessionDto>();
  private knowledgeMap = new Map<string, MultimodalKnowledgeDto>();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const asset1: MediaAssetDto = {
      id: 'asset-seed-1',
      name: 'startup_architecture_diagram.png',
      storageUrl: 'https://storage.googleapis.com/codeforge-assets/startup_architecture_diagram.png',
      assetType: AssetType.IMAGE,
      fileSizeCharacters: 12450,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      createdAt: new Date().toISOString(),
    };

    const asset2: MediaAssetDto = {
      id: 'asset-seed-2',
      name: 'financial_ledger_q3.pdf',
      storageUrl: 'https://storage.googleapis.com/codeforge-assets/financial_ledger_q3.pdf',
      assetType: AssetType.DOCUMENT,
      fileSizeCharacters: 85400,
      checksum: 'c85d7732a392b512c8b8849b2915fa25d3090882e4412f17d554a4911ba845fb',
      createdAt: new Date().toISOString(),
    };

    this.assetsMap.set(asset1.id, asset1);
    this.assetsMap.set(asset2.id, asset2);

    const result1: AnalysisResultDto = {
      id: 'result-seed-1',
      assetId: asset1.id,
      status: AnalysisStatus.SUCCESS,
      detectedTags: ['architecture', 'kubernetes', 'ingress', 'database'],
      confidenceScore: 0.965,
      metadata: { resolution: '1920x1080', format: 'PNG' },
      analyzedAt: new Date().toISOString(),
    };

    const result2: AnalysisResultDto = {
      id: 'result-seed-2',
      assetId: asset2.id,
      status: AnalysisStatus.SUCCESS,
      detectedTags: ['balance_sheet', 'revenue', 'liabilities'],
      ocrText: 'TOTAL REVENUE: $1,250,000. EBITDA: $420,000.',
      confidenceScore: 0.985,
      metadata: { pageCount: 12, author: 'Finance AI Service' },
      analyzedAt: new Date().toISOString(),
    };

    this.resultsMap.set(result1.id, result1);
    this.resultsMap.set(result2.id, result2);

    const session1: ReasoningSessionDto = {
      id: 'session-seed-1',
      sessionName: 'Infrastructure Audit Session',
      complexity: ReasoningComplexity.CROSS_MEDIA,
      promptQuery: 'Verify if the infrastructure diagram aligns with the financial budget constraints.',
      reasoningSteps: [
        'Parsed image topology and localized db replica nodes.',
        'Extracted running costs from ledgers pdf.',
        'Compared provisioning constraints and flagged 2 over-allocated H100 GPU nodes.',
      ],
      cognitiveOutput: 'The cluster config indicates $5,200 monthly waste due to redundant standby replicas.',
      confidenceScore: 0.94,
      createdAt: new Date().toISOString(),
    };

    this.sessionsMap.set(session1.id, session1);

    const knowledge1: MultimodalKnowledgeDto = {
      id: 'knowledge-seed-1',
      conceptName: 'Optimized Kubernetes Provisioning',
      associatedTags: ['kubernetes', 'architecture', 'revenue'],
      crossMediaSummary: 'Unified rule associating infrastructure scaling metrics directly with ledger-computed budgets.',
      extractedRelations: [
        { targetConcept: 'Financial Ledger Analysis', predicate: 'depends_on' },
      ],
      verifiedAt: new Date().toISOString(),
    };

    this.knowledgeMap.set(knowledge1.id, knowledge1);
  }

  public async createMediaAsset(dto: CreateMediaAssetDto): Promise<MediaAssetDto> {
    const asset: MediaAssetDto = {
      id: `asset-${Date.now()}`,
      name: dto.name,
      storageUrl: dto.storageUrl,
      assetType: dto.assetType,
      fileSizeCharacters: dto.fileSizeCharacters,
      checksum: Math.random().toString(16).substring(2, 10),
      createdAt: new Date().toISOString(),
    };
    this.assetsMap.set(asset.id, asset);
    return asset;
  }

  public async getMediaAsset(id: string): Promise<MediaAssetDto | null> {
    return this.assetsMap.get(id) || null;
  }

  public async listMediaAssets(): Promise<MediaAssetDto[]> {
    return Array.from(this.assetsMap.values());
  }

  public async createAnalysisResult(dto: CreateAnalysisResultDto): Promise<AnalysisResultDto> {
    const result: AnalysisResultDto = {
      id: `result-${Date.now()}`,
      assetId: dto.assetId,
      status: AnalysisStatus.SUCCESS,
      detectedTags: dto.detectedTags,
      ocrText: dto.ocrText,
      confidenceScore: dto.confidenceScore,
      metadata: dto.metadata,
      analyzedAt: new Date().toISOString(),
    };
    this.resultsMap.set(result.id, result);
    return result;
  }

  public async getAnalysisResult(id: string): Promise<AnalysisResultDto | null> {
    return this.resultsMap.get(id) || null;
  }

  public async getAnalysisResultByAsset(assetId: string): Promise<AnalysisResultDto | null> {
    for (const r of this.resultsMap.values()) {
      if (r.assetId === assetId) return r;
    }
    return null;
  }

  public async listAnalysisResults(): Promise<AnalysisResultDto[]> {
    return Array.from(this.resultsMap.values());
  }

  public async createReasoningSession(
    dto: CreateReasoningSessionDto,
    steps: string[],
    output: string,
    confidence: number
  ): Promise<ReasoningSessionDto> {
    const session: ReasoningSessionDto = {
      id: `session-${Date.now()}`,
      sessionName: dto.sessionName,
      complexity: dto.complexity,
      promptQuery: dto.promptQuery,
      reasoningSteps: steps,
      cognitiveOutput: output,
      confidenceScore: confidence,
      createdAt: new Date().toISOString(),
    };
    this.sessionsMap.set(session.id, session);
    return session;
  }

  public async getReasoningSession(id: string): Promise<ReasoningSessionDto | null> {
    return this.sessionsMap.get(id) || null;
  }

  public async listReasoningSessions(): Promise<ReasoningSessionDto[]> {
    return Array.from(this.sessionsMap.values());
  }

  public async createMultimodalKnowledge(dto: CreateMultimodalKnowledgeDto): Promise<MultimodalKnowledgeDto> {
    const entry: MultimodalKnowledgeDto = {
      id: `knowledge-${Date.now()}`,
      conceptName: dto.conceptName,
      associatedTags: dto.associatedTags,
      crossMediaSummary: dto.crossMediaSummary,
      extractedRelations: dto.extractedRelations,
      verifiedAt: new Date().toISOString(),
    };
    this.knowledgeMap.set(entry.id, entry);
    return entry;
  }

  public async getMultimodalKnowledge(id: string): Promise<MultimodalKnowledgeDto | null> {
    return this.knowledgeMap.get(id) || null;
  }

  public async listMultimodalKnowledge(): Promise<MultimodalKnowledgeDto[]> {
    return Array.from(this.knowledgeMap.values());
  }

  public async getOverview(): Promise<MultimodalOverviewDto> {
    const recentAssets = await this.listMediaAssets();
    const recentResults = await this.listAnalysisResults();
    const recentSessions = await this.listReasoningSessions();
    const knowledgeBase = await this.listMultimodalKnowledge();

    let totalChars = 0;
    for (const r of recentResults) {
      if (r.ocrText) totalChars += r.ocrText.length;
    }

    let totalConfidence = 0;
    for (const r of recentResults) {
      totalConfidence += r.confidenceScore;
    }
    const avgConfidence = recentResults.length > 0 ? totalConfidence / recentResults.length : 1.0;

    return {
      metrics: {
        totalAssetsProcessed: recentAssets.length,
        averageAnalysisConfidence: parseFloat(avgConfidence.toFixed(3)),
        totalOCRCharactersExtracted: totalChars,
        activeReasoningSessionsCount: recentSessions.length,
        knowledgeNodeDensity: knowledgeBase.length,
        calculatedAt: new Date().toISOString(),
      },
      recentAssets,
      recentResults,
      recentSessions,
      knowledgeBase,
    };
  }
}

export const multimodalRepository = new MultimodalRepository();
