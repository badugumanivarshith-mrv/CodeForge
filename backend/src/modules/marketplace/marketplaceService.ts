import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import {
  MarketplaceAgentDto,
  CreateMarketplaceAgentDto,
  UpdateMarketplaceAgentDto,
  AgentReviewDto,
  CreateAgentReviewDto,
  AgentDownloadDto,
  MarketplaceFilterParamsDto,
  AgentVerificationStatus,
  PricingModel,
  MarketplaceCategory,
} from '@codeforge/shared';

export class MarketplaceService {
  constructor(private repo: IEcosystemRepository) {}

  // Starter bootstrapping
  async initializeStarterAgents(systemAdminId: string): Promise<MarketplaceAgentDto[]> {
    const existing = await this.repo.listMarketplaceAgents();
    if (existing.length >= 6) return existing;

    const starterAgents: CreateMarketplaceAgentDto[] = [
      {
        name: 'Career & Placement Strategist Agent',
        description: 'Autonomously analyzes resume gaps, performs ATS match scoring, and crafts personalized interview preparation curricula.',
        category: MarketplaceCategory.CAREER,
        pricingModel: PricingModel.FREE,
        capabilities: ['Resume AST Parsing', 'Mock Interview Synthesis', 'Salary Negotiation Modeling'],
        systemPrompt: 'You are an elite Silicon Valley career coach and technical hiring bar-raiser.',
      },
      {
        name: 'Algorithmic Synthesizer & Code Auditor',
        description: 'Synthesizes clean polyglot solutions for competitive programming challenges and diagnoses algorithmic runtime errors.',
        category: MarketplaceCategory.CODING,
        pricingModel: PricingModel.FREE,
        capabilities: ['Dynamic Programming Synthesis', 'Graph Algorithm Invariants', 'Memory Complexity Optimization'],
        systemPrompt: 'You are an ICPC World Finalist and expert systems compiler engineer.',
      },
      {
        name: 'Curriculum & Adaptive Learning Path Architect',
        description: 'Constructs adaptive mastery paths from prerequisites, dynamically scaling challenge difficulty to learner performance.',
        category: MarketplaceCategory.LEARNING,
        pricingModel: PricingModel.FREEMIUM,
        capabilities: ['Bloom Taxonomy Mapping', 'Socratic Questioning Engine', 'Spaced Repetition Scheduling'],
        systemPrompt: 'You are a pedagogical architect creating personalized interactive computer science curricula.',
      },
      {
        name: 'Deep Tech Literature & Research Copilot',
        description: 'Conducts autonomous deep research across CS archives, synthesizes executive technical summaries, and generates structured whitepapers.',
        category: MarketplaceCategory.RESEARCH,
        pricingModel: PricingModel.PAID_ONE_TIME,
        priceCents: 4900,
        capabilities: ['Distributed Systems Analysis', 'Formal Verification Invariant Extraction', 'Whitepaper Markdown Synthesis'],
        systemPrompt: 'You are a principal research scientist specializing in distributed systems, consensus, and formal verification.',
      },
      {
        name: 'Talent Scout & Technical Matchmaker',
        description: 'Analyzes verified Arena ratings, hackathon accomplishments, and portfolio repositories to match candidates with recruiters.',
        category: MarketplaceCategory.HIRING,
        pricingModel: PricingModel.SUBSCRIPTION,
        priceCents: 9900,
        capabilities: ['Candidate Persona Modeling', 'Skill Radar Vector Extraction', 'Hiring Challenge Screening'],
        systemPrompt: 'You are a senior technical recruiter connecting world-class software engineers with hyper-growth engineering teams.',
      },
      {
        name: 'Enterprise Governance & Compliance Reviewer',
        description: 'Performs multi-tenant isolation compliance reviews, sandboxed plugin security audits, and enterprise policy verification.',
        category: MarketplaceCategory.ENTERPRISE,
        pricingModel: PricingModel.PAID_ONE_TIME,
        priceCents: 14900,
        capabilities: ['RBAC Security Audits', 'Tenant Boundary Verifications', 'SOC2 Compliance Mapping'],
        systemPrompt: 'You are a chief information security officer (CISO) and enterprise compliance auditor.',
      },
    ];

    const created: MarketplaceAgentDto[] = [];
    for (const agentData of starterAgents) {
      const a = await this.repo.createMarketplaceAgent(systemAdminId, agentData);
      created.push(a);
    }
    return created;
  }

  // 1. Publishing & Lifecycle
  async publishAgent(creatorId: string, data: CreateMarketplaceAgentDto): Promise<MarketplaceAgentDto> {
    if (!data.name || data.name.trim().length === 0 || !data.description || data.description.trim().length === 0) {
      throw new Error('Agent name and description are required');
    }
    if (!data.systemPrompt || data.systemPrompt.trim().length === 0) {
      throw new Error('System prompt is required');
    }
    if (data.pricingModel && data.pricingModel !== PricingModel.FREE && (!data.priceCents || data.priceCents <= 0)) {
      throw new Error('Paid agents must have a price greater than 0');
    }

    return this.repo.createMarketplaceAgent(creatorId, data);
  }

  async getAgentById(id: string): Promise<MarketplaceAgentDto | null> {
    return this.repo.getMarketplaceAgentById(id);
  }

  async listAgents(params?: MarketplaceFilterParamsDto): Promise<MarketplaceAgentDto[]> {
    return this.repo.listMarketplaceAgents(params);
  }

  async updateAgent(id: string, creatorId: string, data: UpdateMarketplaceAgentDto): Promise<MarketplaceAgentDto | null> {
    return this.repo.updateMarketplaceAgent(id, creatorId, data);
  }

  async deleteAgent(id: string, creatorId: string): Promise<boolean> {
    return this.repo.deleteMarketplaceAgent(id, creatorId);
  }

  // 2. Reviews & Ratings
  async submitReview(userId: string, data: CreateAgentReviewDto): Promise<AgentReviewDto> {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const agent = await this.repo.getMarketplaceAgentById(data.agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return this.repo.createReview(userId, data);
  }

  async listReviews(agentId: string): Promise<AgentReviewDto[]> {
    return this.repo.listReviewsByAgentId(agentId);
  }

  // 3. Downloads & Installations
  async downloadAgent(agentId: string, userId: string, version: string = '1.0.0'): Promise<AgentDownloadDto> {
    const agent = await this.repo.getMarketplaceAgentById(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return this.repo.recordDownload(agentId, userId, version);
  }

  // 4. Enterprise Governance
  async approveEnterpriseAgent(agentId: string, adminUserId: string): Promise<MarketplaceAgentDto | null> {
    return this.repo.updateMarketplaceAgent(agentId, adminUserId, {
      isEnterpriseApproved: true,
      verificationStatus: AgentVerificationStatus.ENTERPRISE_APPROVED,
    });
  }
}
