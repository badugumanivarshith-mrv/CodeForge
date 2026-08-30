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
  GrantDto,
  CreateGrantDto,
  CollaboratorDto,
  CreateCollaboratorDto,
  ResearchMetricsDto,
  AcademicCommandCenterOverviewDto,
  AcademicDepartment,
  ResearchProgramStatus,
  LabType,
  LabStatus,
  DiscoverySignificance,
  PublicationType,
  PublicationStatus,
  PeerReviewRole,
  GrantType,
  GrantStatus,
  AcademicKnowledgeNodeDto,
  CreateAcademicKnowledgeNodeDto,
} from '@codeforge/shared';

const API_BASE = '/api/v1/research-university';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const researchUniversityApi = {
  // 1. Overview & Metrics
  async getOverview(): Promise<AcademicCommandCenterOverviewDto> {
    try {
      const res = await fetch(`${API_BASE}/overview`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.warn('API error, falling back to mock data', e);
    }

    return {
      universityName: 'CodeForge Autonomous Research University & Academy of Sciences',
      motto: 'Veritas per Superintelligentiam • Discovery Through Autonomous Reason',
      totalResearchProgramsCount: 4,
      activeDigitalLabsCount: 2,
      peerReviewedPapersCount: 1,
      totalCitationsCount: 42,
      cumulativeGrantFundingUsd: 15000000,
      globalKnowledgeNodesCount: 1,
      averageReproducibilityIndex: 98.4,
      topPrograms: [
        {
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
        },
      ],
      recentDiscoveries: [
        {
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
        },
      ],
      recentPublications: [
        {
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
        },
      ],
      activeLabs: [
        {
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
        },
      ],
      openGrants: [
        {
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
        },
      ],
    };
  },

  async getMetrics(): Promise<ResearchMetricsDto> {
    const res = await fetch(`${API_BASE}/metrics`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 2. Programs & Projects
  async proposeProgram(dto: CreateResearchProgramDto): Promise<ResearchProgramDto> {
    const res = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listPrograms(department?: AcademicDepartment): Promise<ResearchProgramDto[]> {
    const url = department ? `${API_BASE}/programs?department=${department}` : `${API_BASE}/programs`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async getProgram(id: string): Promise<ResearchProgramDto> {
    const res = await fetch(`${API_BASE}/programs/${id}`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async activateProgram(id: string): Promise<ResearchProgramDto> {
    const res = await fetch(`${API_BASE}/programs/${id}/activate`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const json = await res.json();
    return json.data;
  },

  async createProject(dto: CreateResearchProjectDto): Promise<ResearchProjectDto> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listProjects(programId: string): Promise<ResearchProjectDto[]> {
    const res = await fetch(`${API_BASE}/programs/${programId}/projects`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 3. Hypotheses & Discoveries
  async formulateHypothesis(dto: CreateHypothesisDto): Promise<HypothesisDto> {
    const res = await fetch(`${API_BASE}/hypotheses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listHypotheses(programId?: string): Promise<HypothesisDto[]> {
    const url = programId ? `${API_BASE}/hypotheses?programId=${programId}` : `${API_BASE}/hypotheses`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async testHypothesis(id: string): Promise<HypothesisDto> {
    const res = await fetch(`${API_BASE}/hypotheses/${id}/test`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const json = await res.json();
    return json.data;
  },

  async confirmDiscovery(dto: CreateDiscoveryDto): Promise<DiscoveryDto> {
    const res = await fetch(`${API_BASE}/discoveries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listDiscoveries(programId?: string): Promise<DiscoveryDto[]> {
    const url = programId ? `${API_BASE}/discoveries?programId=${programId}` : `${API_BASE}/discoveries`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 4. Digital Laboratories & Experiments
  async provisionLaboratory(dto: CreateLaboratoryDto): Promise<LaboratoryDto> {
    const res = await fetch(`${API_BASE}/laboratories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listLaboratories(department?: AcademicDepartment): Promise<LaboratoryDto[]> {
    const url = department ? `${API_BASE}/laboratories?department=${department}` : `${API_BASE}/laboratories`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async getLaboratory(id: string): Promise<LaboratoryDto> {
    const res = await fetch(`${API_BASE}/laboratories/${id}`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async getLaboratoryMetrics(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/laboratories/${id}/metrics`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async runExperiment(dto: CreateExperimentDto): Promise<ExperimentDto> {
    const res = await fetch(`${API_BASE}/experiments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listExperiments(labId?: string): Promise<ExperimentDto[]> {
    const url = labId ? `${API_BASE}/experiments?labId=${labId}` : `${API_BASE}/experiments`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 5. Academic Knowledge Graph
  async indexKnowledgeNode(dto: CreateAcademicKnowledgeNodeDto): Promise<AcademicKnowledgeNodeDto> {
    const res = await fetch(`${API_BASE}/knowledge-nodes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listKnowledgeNodes(domain?: AcademicDepartment): Promise<AcademicKnowledgeNodeDto[]> {
    const url = domain ? `${API_BASE}/knowledge-nodes?domain=${domain}` : `${API_BASE}/knowledge-nodes`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async getKnowledgeLineages(domain?: AcademicDepartment): Promise<any> {
    const url = domain ? `${API_BASE}/knowledge-graph/lineages?domain=${domain}` : `${API_BASE}/knowledge-graph/lineages`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 6. Publications & Citations
  async draftPublication(dto: CreatePublicationDto): Promise<PublicationDto> {
    const res = await fetch(`${API_BASE}/publications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listPublications(department?: AcademicDepartment): Promise<PublicationDto[]> {
    const url = department ? `${API_BASE}/publications?department=${department}` : `${API_BASE}/publications`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async getPublication(id: string): Promise<PublicationDto> {
    const res = await fetch(`${API_BASE}/publications/${id}`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async publishPaper(id: string): Promise<PublicationDto> {
    const res = await fetch(`${API_BASE}/publications/${id}/publish`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const json = await res.json();
    return json.data;
  },

  async citePublication(dto: CreateCitationDto): Promise<CitationDto> {
    const res = await fetch(`${API_BASE}/citations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listCitations(id: string): Promise<CitationDto[]> {
    const res = await fetch(`${API_BASE}/publications/${id}/citations`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 7. Peer Review Network
  async conductReview(publicationId: string, role: PeerReviewRole): Promise<PeerReviewDto> {
    const res = await fetch(`${API_BASE}/publications/${publicationId}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    const json = await res.json();
    return json.data;
  },

  async listReviews(publicationId: string): Promise<PeerReviewDto[]> {
    const res = await fetch(`${API_BASE}/publications/${publicationId}/reviews`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async getReviewConsensus(publicationId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/publications/${publicationId}/reviews/consensus`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 8. Research Funding & Grants
  async registerGrant(dto: CreateGrantDto): Promise<GrantDto> {
    const res = await fetch(`${API_BASE}/grants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listGrants(department?: AcademicDepartment): Promise<GrantDto[]> {
    const url = department ? `${API_BASE}/grants?department=${department}` : `${API_BASE}/grants`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async applyForGrant(grantId: string, programId: string): Promise<GrantDto> {
    const res = await fetch(`${API_BASE}/grants/${grantId}/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ programId }),
    });
    const json = await res.json();
    return json.data;
  },

  async awardGrant(grantId: string, awardAmountUsd?: number): Promise<GrantDto> {
    const res = await fetch(`${API_BASE}/grants/${grantId}/award`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ awardAmountUsd }),
    });
    const json = await res.json();
    return json.data;
  },

  // 9. Global Collaboration Network
  async registerCollaborator(dto: CreateCollaboratorDto): Promise<CollaboratorDto> {
    const res = await fetch(`${API_BASE}/collaborators`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async listCollaborators(department?: AcademicDepartment): Promise<CollaboratorDto[]> {
    const url = department ? `${API_BASE}/collaborators?department=${department}` : `${API_BASE}/collaborators`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async linkCollaboratorProject(collaboratorId: string, programId: string): Promise<CollaboratorDto> {
    const res = await fetch(`${API_BASE}/collaborators/${collaboratorId}/link-project`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ programId }),
    });
    const json = await res.json();
    return json.data;
  },
};
