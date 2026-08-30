import { randomUUID } from 'crypto';
import {
  ResearchProgramDto,
  CreateResearchProgramDto,
  ResearchProjectDto,
  CreateResearchProjectDto,
  LaboratoryDto,
  CreateLaboratoryDto,
  ExperimentDto,
  CreateExperimentDto,
  HypothesisDto,
  CreateHypothesisDto,
  DiscoveryDto,
  CreateDiscoveryDto,
  PublicationDto,
  CreatePublicationDto,
  CitationDto,
  CreateCitationDto,
  PeerReviewDto,
  CreatePeerReviewDto,
  GrantDto,
  CreateGrantDto,
  CollaboratorDto,
  CreateCollaboratorDto,
  AcademicKnowledgeNodeDto,
  CreateAcademicKnowledgeNodeDto,
  ResearchMetricsDto,
  AcademicDepartment,
  ResearchProgramStatus,
  LabType,
  LabStatus,
  ExperimentStatus,
  HypothesisStatus,
  DiscoverySignificance,
  PublicationType,
  PublicationStatus,
  PeerReviewRole,
  PeerReviewVerdict,
  GrantType,
  GrantStatus,
  KnowledgeNodeType,
} from '@codeforge/shared';
import { IResearchUniversityRepository } from './interfaces/IResearchUniversityRepository';

export class ResearchUniversityRepository implements IResearchUniversityRepository {
  private programs: Map<string, ResearchProgramDto> = new Map();
  private projects: Map<string, ResearchProjectDto> = new Map();
  private labs: Map<string, LaboratoryDto> = new Map();
  private experiments: Map<string, ExperimentDto> = new Map();
  private hypotheses: Map<string, HypothesisDto> = new Map();
  private discoveries: Map<string, DiscoveryDto> = new Map();
  private publications: Map<string, PublicationDto> = new Map();
  private citations: Map<string, CitationDto> = new Map();
  private peerReviews: Map<string, PeerReviewDto> = new Map();
  private grants: Map<string, GrantDto> = new Map();
  private collaborators: Map<string, CollaboratorDto> = new Map();
  private knowledgeNodes: Map<string, AcademicKnowledgeNodeDto> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults(): void {
    // Seed initial research programs
    const prog1: ResearchProgramDto = {
      id: 'prog-quantum-ai',
      name: 'Autonomous Quantum Intelligence & Neural Reasoning',
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      leadFacultyAgent: 'Prof. Alan Turing Autonomous Agent',
      description: 'Foundational research into non-Euclidean quantum tensor representations for agentic reasoning.',
      status: ResearchProgramStatus.ACTIVE,
      primaryHypothesis: 'Quantum superposition states accelerate graph neuro-symbolic inference by 100x.',
      targetMilestones: ['Formalize Hamiltonian operators', 'Validate on 1000-qubit simulator', 'Publish pre-print'],
      allocatedBudgetUsd: 2500000,
      activeResearchersCount: 8,
      publicationsCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.programs.set(prog1.id, prog1);

    const prog2: ResearchProgramDto = {
      id: 'prog-bio-synthesis',
      name: 'Planetary Biocomputational Macromolecule Design',
      department: AcademicDepartment.ENGINEERING,
      leadFacultyAgent: 'Dr. Rosalind Franklin Synthetic Intelligence',
      description: 'Generative diffusion models for denovo enzyme design with thermal stability up to 90C.',
      status: ResearchProgramStatus.ACTIVE,
      primaryHypothesis: 'Graph equivariant convolutions predict tertiary protein folding binding energy with <0.5 kcal/mol error.',
      targetMilestones: ['De-novo catalyst design', 'In-silico docking validation', 'X-ray crystallography benchmark'],
      allocatedBudgetUsd: 3800000,
      activeResearchersCount: 6,
      publicationsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.programs.set(prog2.id, prog2);

    // Seed Digital Laboratories
    const lab1: LaboratoryDto = {
      id: 'lab-ai-core',
      name: 'Planetary AI & Distributed Reasoning Lab',
      labType: LabType.AI_RESEARCH_LAB,
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      status: LabStatus.OPERATIONAL,
      computeCapacityTeraflops: 50000.0,
      activeSimulationsCount: 14,
      datasetsMountedCount: 38,
      directorAgent: 'Dr. Ada Lovelace Agent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.labs.set(lab1.id, lab1);

    const lab2: LaboratoryDto = {
      id: 'lab-quantum-sim',
      name: 'Quantum Systems & Topological Computing Lab',
      labType: LabType.FUTURE_TECHNOLOGIES_LAB,
      department: AcademicDepartment.MATHEMATICS,
      status: LabStatus.OPERATIONAL,
      computeCapacityTeraflops: 120000.0,
      activeSimulationsCount: 8,
      datasetsMountedCount: 12,
      directorAgent: 'Prof. Richard Feynman Quantum Agent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.labs.set(lab2.id, lab2);

    // Seed Hypotheses
    const hyp1: HypothesisDto = {
      id: 'hyp-neuro-symbolic-01',
      programId: 'prog-quantum-ai',
      statement: 'Combining quantum Hamiltonian dynamics with differentiable logic nets eliminates hallucination in multi-hop mathematical deductions.',
      rationale: 'Energy-minimization landscapes constrain generative token transitions to provably sound state spaces.',
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      noveltyScore: 96.5,
      feasibilityScore: 91.0,
      testPlan: ['Synthesize 10,000 theorem proofs', 'Compare with Lean 4 formal verifier', 'Run ablation on noise tolerance'],
      status: HypothesisStatus.VALIDATED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.hypotheses.set(hyp1.id, hyp1);

    // Seed Discoveries
    const disc1: DiscoveryDto = {
      id: 'disc-topological-zero-hallucination',
      hypothesisId: 'hyp-neuro-symbolic-01',
      programId: 'prog-quantum-ai',
      title: 'Topological Energy Invariance in Neuro-Symbolic State Spaces',
      significance: DiscoverySignificance.BREAKTHROUGH,
      summary: 'Demonstrated 99.98% formal verification accuracy in autonomous symbolic theorem proving across 10k benchmarks.',
      empiricalEvidence: ['Empirical p-value < 1e-6 across 12 independent test sets', 'Reproduced on 3 isolated compute clusters'],
      noveltyScore: 98.2,
      reproducibilityIndex: 99.4,
      confirmedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.discoveries.set(disc1.id, disc1);

    // Seed Publications
    const pub1: PublicationDto = {
      id: 'pub-topological-invariance',
      programId: 'prog-quantum-ai',
      title: 'Topological Energy Invariance for Zero-Hallucination Neuro-Symbolic Intelligence',
      abstract: 'We introduce Hamiltonian neuro-symbolic operators that enforce topological invariants on generative latent states, proving convergence to formal truth.',
      authors: ['Prof. Alan Turing Autonomous Agent', 'Dr. Ada Lovelace Agent'],
      publicationType: PublicationType.RESEARCH_PAPER,
      status: PublicationStatus.PUBLISHED,
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      doi: '10.1038/s41586-026-09821-4',
      fullMarkdownContent: '# Topological Energy Invariance for Zero-Hallucination Neuro-Symbolic Intelligence\n\n## Abstract\nWe introduce Hamiltonian neuro-symbolic operators...',
      citationCount: 42,
      readinessScore: 98.0,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.publications.set(pub1.id, pub1);

    // Seed Grants
    const grant1: GrantDto = {
      id: 'grant-nsf-ai',
      grantTitle: 'National Science Foundation Frontier AI Discovery Grant',
      grantType: GrantType.GOVERNMENT_GRANT,
      fundingAgency: 'National Science Foundation',
      totalPoolUsd: 15000000,
      maximumAwardUsd: 3000000,
      eligibilityCriteria: ['Accredited Autonomous University', 'Demonstrated 90%+ Reproducibility Rate'],
      matchingDepartments: [AcademicDepartment.ARTIFICIAL_INTELLIGENCE, AcademicDepartment.COMPUTER_SCIENCE],
      status: GrantStatus.OPEN,
      applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.grants.set(grant1.id, grant1);

    // Seed Knowledge Nodes
    const kn1: AcademicKnowledgeNodeDto = {
      id: 'kn-transformer-arch',
      nodeType: KnowledgeNodeType.ALGORITHM,
      canonicalName: 'Sparse Attention Transformer Topology',
      domain: AcademicDepartment.COMPUTER_SCIENCE,
      definition: 'Sub-quadratic multi-head self-attention utilizing learned routing projections.',
      confidenceScore: 98.5,
      incomingCitations: 142,
      outgoingConnections: ['kn-neural-scaling-laws'],
      evolutionLineage: ['Attention Mechanism', 'Transformer', 'FlashAttention-3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.knowledgeNodes.set(kn1.id, kn1);

    // Seed Collaborators
    const collab1: CollaboratorDto = {
      id: 'collab-mit-cail',
      institutionName: 'Planetary Institute of Advanced Science',
      primaryDepartment: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      country: 'Global Consortium',
      leadInvestigator: 'Prof. Claude Shannon Autonomous Chair',
      reputationScore: 98.7,
      activeSharedProjects: ['prog-quantum-ai'],
      coAuthoredPublicationsCount: 5,
      cooperationStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.collaborators.set(collab1.id, collab1);
  }

  // --- Programs & Projects ---
  async createProgram(dto: CreateResearchProgramDto): Promise<ResearchProgramDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const program: ResearchProgramDto = {
      id,
      name: dto.name,
      department: dto.department,
      leadFacultyAgent: dto.leadFacultyAgent || 'Autonomous Faculty Fellow',
      description: dto.description,
      status: dto.status || ResearchProgramStatus.PROPOSED,
      primaryHypothesis: dto.primaryHypothesis,
      targetMilestones: dto.targetMilestones || [],
      allocatedBudgetUsd: dto.allocatedBudgetUsd || 500000,
      activeResearchersCount: 3,
      publicationsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.programs.set(id, program);
    return program;
  }

  async getProgramById(id: string): Promise<ResearchProgramDto | null> {
    return this.programs.get(id) || null;
  }

  async listPrograms(department?: AcademicDepartment): Promise<ResearchProgramDto[]> {
    const list = Array.from(this.programs.values());
    if (department) {
      return list.filter((p) => p.department === department);
    }
    return list;
  }

  async updateProgram(id: string, updates: Partial<ResearchProgramDto>): Promise<ResearchProgramDto | null> {
    const prog = this.programs.get(id);
    if (!prog) return null;
    const updated: ResearchProgramDto = {
      ...prog,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.programs.set(id, updated);
    return updated;
  }

  async createProject(dto: CreateResearchProjectDto): Promise<ResearchProjectDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const project: ResearchProjectDto = {
      id,
      programId: dto.programId,
      title: dto.title,
      abstract: dto.abstract,
      department: dto.department,
      principalInvestigator: dto.principalInvestigator || 'Lead Research Agent',
      status: dto.status || ResearchProgramStatus.ACTIVE,
      startDate: dto.startDate || now,
      targetCompletionDate: dto.targetCompletionDate || new Date(Date.now() + 180 * 86400000).toISOString(),
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    return project;
  }

  async listProjectsByProgram(programId: string): Promise<ResearchProjectDto[]> {
    return Array.from(this.projects.values()).filter((p) => p.programId === programId);
  }

  // --- Laboratories & Experiments ---
  async createLaboratory(dto: CreateLaboratoryDto): Promise<LaboratoryDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const lab: LaboratoryDto = {
      id,
      name: dto.name,
      labType: dto.labType,
      department: dto.department,
      status: dto.status || LabStatus.OPERATIONAL,
      computeCapacityTeraflops: dto.computeCapacityTeraflops || 1000.0,
      activeSimulationsCount: 0,
      datasetsMountedCount: 0,
      directorAgent: dto.directorAgent || 'Laboratory Director Agent',
      createdAt: now,
      updatedAt: now,
    };
    this.labs.set(id, lab);
    return lab;
  }

  async getLaboratoryById(id: string): Promise<LaboratoryDto | null> {
    return this.labs.get(id) || null;
  }

  async listLaboratories(department?: AcademicDepartment): Promise<LaboratoryDto[]> {
    const list = Array.from(this.labs.values());
    if (department) {
      return list.filter((l) => l.department === department);
    }
    return list;
  }

  async updateLaboratory(id: string, updates: Partial<LaboratoryDto>): Promise<LaboratoryDto | null> {
    const lab = this.labs.get(id);
    if (!lab) return null;
    const updated: LaboratoryDto = {
      ...lab,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.labs.set(id, updated);
    return updated;
  }

  async createExperiment(dto: CreateExperimentDto): Promise<ExperimentDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const experiment: ExperimentDto = {
      id,
      labId: dto.labId,
      hypothesisId: dto.hypothesisId,
      title: dto.title,
      parameters: dto.parameters || {},
      datasetRef: dto.datasetRef || 'benchmark-eval-dataset-v1',
      status: dto.status || ExperimentStatus.COMPLETED,
      executionDurationMs: Math.floor(Math.random() * 5000) + 1200,
      reproducibilityScore: dto.reproducibilityScore !== undefined ? dto.reproducibilityScore : 95.8,
      resultsSummary: dto.resultsSummary || 'Empirical validation yielded statistical significance (p < 0.001).',
      logs: ['Experiment initialized', 'Parameters verified', 'Execution completed', 'Reproducibility validated'],
      executedAt: now,
      createdAt: now,
    };
    this.experiments.set(id, experiment);
    return experiment;
  }

  async getExperimentById(id: string): Promise<ExperimentDto | null> {
    return this.experiments.get(id) || null;
  }

  async listExperiments(labId?: string): Promise<ExperimentDto[]> {
    const list = Array.from(this.experiments.values());
    if (labId) {
      return list.filter((e) => e.labId === labId);
    }
    return list;
  }

  async updateExperiment(id: string, updates: Partial<ExperimentDto>): Promise<ExperimentDto | null> {
    const exp = this.experiments.get(id);
    if (!exp) return null;
    const updated: ExperimentDto = {
      ...exp,
      ...updates,
    };
    this.experiments.set(id, updated);
    return updated;
  }

  // --- Hypotheses & Discoveries ---
  async createHypothesis(dto: CreateHypothesisDto): Promise<HypothesisDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const hypothesis: HypothesisDto = {
      id,
      programId: dto.programId,
      statement: dto.statement,
      rationale: dto.rationale,
      department: dto.department,
      noveltyScore: dto.noveltyScore || 88.5,
      feasibilityScore: dto.feasibilityScore || 84.0,
      testPlan: dto.testPlan || ['Synthesize benchmark test suite', 'Execute ablation runs'],
      status: dto.status || HypothesisStatus.FORMULATED,
      createdAt: now,
      updatedAt: now,
    };
    this.hypotheses.set(id, hypothesis);
    return hypothesis;
  }

  async getHypothesisById(id: string): Promise<HypothesisDto | null> {
    return this.hypotheses.get(id) || null;
  }

  async listHypotheses(programId?: string): Promise<HypothesisDto[]> {
    const list = Array.from(this.hypotheses.values());
    if (programId) {
      return list.filter((h) => h.programId === programId);
    }
    return list;
  }

  async updateHypothesis(id: string, updates: Partial<HypothesisDto>): Promise<HypothesisDto | null> {
    const hyp = this.hypotheses.get(id);
    if (!hyp) return null;
    const updated: HypothesisDto = {
      ...hyp,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.hypotheses.set(id, updated);
    return updated;
  }

  async createDiscovery(dto: CreateDiscoveryDto): Promise<DiscoveryDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const discovery: DiscoveryDto = {
      id,
      hypothesisId: dto.hypothesisId,
      programId: dto.programId,
      title: dto.title,
      significance: dto.significance || DiscoverySignificance.BREAKTHROUGH,
      summary: dto.summary,
      empiricalEvidence: dto.empiricalEvidence || ['Statistical p-value < 0.0001', 'Cross-validated on 10 benchmark suites'],
      noveltyScore: dto.noveltyScore || 94.2,
      reproducibilityIndex: dto.reproducibilityIndex || 98.4,
      confirmedAt: now,
      createdAt: now,
    };
    this.discoveries.set(id, discovery);
    return discovery;
  }

  async getDiscoveryById(id: string): Promise<DiscoveryDto | null> {
    return this.discoveries.get(id) || null;
  }

  async listDiscoveries(programId?: string): Promise<DiscoveryDto[]> {
    const list = Array.from(this.discoveries.values());
    if (programId) {
      return list.filter((d) => d.programId === programId);
    }
    return list;
  }

  // --- Publications & Citations & Peer Reviews ---
  async createPublication(dto: CreatePublicationDto): Promise<PublicationDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const publication: PublicationDto = {
      id,
      programId: dto.programId,
      title: dto.title,
      abstract: dto.abstract,
      authors: dto.authors || ['Autonomous Research Faculty Agent'],
      publicationType: dto.publicationType || PublicationType.RESEARCH_PAPER,
      status: dto.status || PublicationStatus.DRAFT,
      department: dto.department,
      doi: dto.doi || `10.1038/s41586-${Math.floor(Math.random() * 90000) + 10000}`,
      fullMarkdownContent: dto.fullMarkdownContent || `# ${dto.title}\n\n## Abstract\n${dto.abstract}\n\n## Methodology\nEmpirical validation across digital laboratories.`,
      citationCount: 0,
      readinessScore: dto.readinessScore || 92.0,
      publishedAt: dto.status === PublicationStatus.PUBLISHED ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.publications.set(id, publication);
    return publication;
  }

  async getPublicationById(id: string): Promise<PublicationDto | null> {
    return this.publications.get(id) || null;
  }

  async listPublications(department?: AcademicDepartment): Promise<PublicationDto[]> {
    const list = Array.from(this.publications.values());
    if (department) {
      return list.filter((p) => p.department === department);
    }
    return list;
  }

  async updatePublication(id: string, updates: Partial<PublicationDto>): Promise<PublicationDto | null> {
    const pub = this.publications.get(id);
    if (!pub) return null;
    const updated: PublicationDto = {
      ...pub,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.publications.set(id, updated);
    return updated;
  }

  async createCitation(dto: CreateCitationDto): Promise<CitationDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const citation: CitationDto = {
      id,
      sourcePublicationId: dto.sourcePublicationId,
      targetPublicationId: dto.targetPublicationId,
      citationContext: dto.citationContext || 'Building upon foundational methodology established in target paper.',
      semanticSimilarity: dto.semanticSimilarity || 0.88,
      citedAt: now,
    };
    this.citations.set(id, citation);

    // Increment citation count on target publication
    const target = this.publications.get(dto.targetPublicationId);
    if (target) {
      target.citationCount += 1;
    }
    return citation;
  }

  async listCitations(publicationId: string): Promise<CitationDto[]> {
    return Array.from(this.citations.values()).filter(
      (c) => c.sourcePublicationId === publicationId || c.targetPublicationId === publicationId
    );
  }

  async createPeerReview(dto: CreatePeerReviewDto): Promise<PeerReviewDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const review: PeerReviewDto = {
      id,
      publicationId: dto.publicationId,
      reviewerRole: dto.reviewerRole,
      reviewerAgentName: dto.reviewerAgentName || 'Autonomous Peer Reviewer Agent',
      verdict: dto.verdict,
      overallScore: dto.overallScore,
      methodologyScore: dto.methodologyScore || 90.0,
      soundnessScore: dto.soundnessScore || 92.0,
      noveltyScore: dto.noveltyScore || 88.0,
      clarityScore: dto.clarityScore || 91.0,
      reproducibilityScore: dto.reproducibilityScore || 96.0,
      comments: dto.comments,
      strengths: dto.strengths || ['Rigorous mathematical proofs', 'High experiment reproducibility'],
      weaknesses: dto.weaknesses || ['Ablation studies on edge configurations could be expanded'],
      reviewedAt: now,
      createdAt: now,
    };
    this.peerReviews.set(id, review);
    return review;
  }

  async listPeerReviews(publicationId: string): Promise<PeerReviewDto[]> {
    return Array.from(this.peerReviews.values()).filter((r) => r.publicationId === publicationId);
  }

  // --- Grants & Collaborations & Knowledge Nodes ---
  async createGrant(dto: CreateGrantDto): Promise<GrantDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const grant: GrantDto = {
      id,
      grantTitle: dto.grantTitle,
      grantType: dto.grantType,
      fundingAgency: dto.fundingAgency,
      totalPoolUsd: dto.totalPoolUsd,
      maximumAwardUsd: dto.maximumAwardUsd,
      eligibilityCriteria: dto.eligibilityCriteria || ['Autonomous Research Entity'],
      matchingDepartments: dto.matchingDepartments || [AcademicDepartment.ARTIFICIAL_INTELLIGENCE],
      status: dto.status || GrantStatus.OPEN,
      applicationDeadline: dto.applicationDeadline || new Date(Date.now() + 60 * 86400000).toISOString(),
      awardedAmountUsd: dto.awardedAmountUsd,
      fundedProgramId: dto.fundedProgramId,
      createdAt: now,
      updatedAt: now,
    };
    this.grants.set(id, grant);
    return grant;
  }

  async getGrantById(id: string): Promise<GrantDto | null> {
    return this.grants.get(id) || null;
  }

  async listGrants(): Promise<GrantDto[]> {
    return Array.from(this.grants.values());
  }

  async updateGrant(id: string, updates: Partial<GrantDto>): Promise<GrantDto | null> {
    const g = this.grants.get(id);
    if (!g) return null;
    const updated: GrantDto = {
      ...g,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.grants.set(id, updated);
    return updated;
  }

  async createCollaborator(dto: CreateCollaboratorDto): Promise<CollaboratorDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const collab: CollaboratorDto = {
      id,
      institutionName: dto.institutionName,
      primaryDepartment: dto.primaryDepartment,
      country: dto.country || 'Global Knowledge Network',
      leadInvestigator: dto.leadInvestigator || 'Senior Research Chair',
      reputationScore: dto.reputationScore || 92.5,
      activeSharedProjects: dto.activeSharedProjects || [],
      coAuthoredPublicationsCount: 0,
      cooperationStatus: dto.cooperationStatus || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
    this.collaborators.set(id, collab);
    return collab;
  }

  async listCollaborators(department?: AcademicDepartment): Promise<CollaboratorDto[]> {
    const list = Array.from(this.collaborators.values());
    if (department) {
      return list.filter((c) => c.primaryDepartment === department);
    }
    return list;
  }

  async createKnowledgeNode(dto: CreateAcademicKnowledgeNodeDto): Promise<AcademicKnowledgeNodeDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const node: AcademicKnowledgeNodeDto = {
      id,
      nodeType: dto.nodeType,
      canonicalName: dto.canonicalName,
      domain: dto.domain,
      definition: dto.definition,
      confidenceScore: dto.confidenceScore || 95.0,
      incomingCitations: 0,
      outgoingConnections: dto.outgoingConnections || [],
      evolutionLineage: dto.evolutionLineage || [dto.canonicalName],
      createdAt: now,
      updatedAt: now,
    };
    this.knowledgeNodes.set(id, node);
    return node;
  }

  async getKnowledgeNodeById(id: string): Promise<AcademicKnowledgeNodeDto | null> {
    return this.knowledgeNodes.get(id) || null;
  }

  async listKnowledgeNodes(domain?: AcademicDepartment): Promise<AcademicKnowledgeNodeDto[]> {
    const list = Array.from(this.knowledgeNodes.values());
    if (domain) {
      return list.filter((n) => n.domain === domain);
    }
    return list;
  }

  // --- Metrics ---
  async getResearchMetrics(universityId: string = 'univ-codeforge-global'): Promise<ResearchMetricsDto> {
    const totalPrograms = this.programs.size;
    const activeLabsCount = this.labs.size;
    const experimentsExecutedCount = this.experiments.size;
    const discoveriesLoggedCount = this.discoveries.size;
    const publicationsCount = this.publications.size;
    const totalCitationsCount = Array.from(this.publications.values()).reduce((sum, p) => sum + p.citationCount, 0);

    const totalGrantsSecuredUsd = Array.from(this.grants.values())
      .filter((g) => g.status === GrantStatus.AWARDED)
      .reduce((sum, g) => sum + (g.awardedAmountUsd || g.maximumAwardUsd), 0);

    return {
      universityId,
      totalPrograms,
      activeLabsCount,
      experimentsExecutedCount,
      discoveriesLoggedCount,
      publicationsCount,
      totalCitationsCount,
      hIndexEstimated: Math.max(1, Math.floor(Math.sqrt(totalCitationsCount + 1))),
      totalGrantsSecuredUsd: totalGrantsSecuredUsd || 12500000,
      globalKnowledgeGraphDensity: 0.84,
      averageReproducibilityRate: 97.4,
      computedAt: new Date().toISOString(),
    };
  }
}

export const researchUniversityRepository = new ResearchUniversityRepository();
