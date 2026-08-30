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
} from '@codeforge/shared';

export interface IResearchUniversityRepository {
  // Programs & Projects
  createProgram(dto: CreateResearchProgramDto): Promise<ResearchProgramDto>;
  getProgramById(id: string): Promise<ResearchProgramDto | null>;
  listPrograms(department?: AcademicDepartment): Promise<ResearchProgramDto[]>;
  updateProgram(id: string, updates: Partial<ResearchProgramDto>): Promise<ResearchProgramDto | null>;
  createProject(dto: CreateResearchProjectDto): Promise<ResearchProjectDto>;
  listProjectsByProgram(programId: string): Promise<ResearchProjectDto[]>;

  // Laboratories & Experiments
  createLaboratory(dto: CreateLaboratoryDto): Promise<LaboratoryDto>;
  getLaboratoryById(id: string): Promise<LaboratoryDto | null>;
  listLaboratories(department?: AcademicDepartment): Promise<LaboratoryDto[]>;
  updateLaboratory(id: string, updates: Partial<LaboratoryDto>): Promise<LaboratoryDto | null>;
  createExperiment(dto: CreateExperimentDto): Promise<ExperimentDto>;
  getExperimentById(id: string): Promise<ExperimentDto | null>;
  listExperiments(labId?: string): Promise<ExperimentDto[]>;
  updateExperiment(id: string, updates: Partial<ExperimentDto>): Promise<ExperimentDto | null>;

  // Hypotheses & Discoveries
  createHypothesis(dto: CreateHypothesisDto): Promise<HypothesisDto>;
  getHypothesisById(id: string): Promise<HypothesisDto | null>;
  listHypotheses(programId?: string): Promise<HypothesisDto[]>;
  updateHypothesis(id: string, updates: Partial<HypothesisDto>): Promise<HypothesisDto | null>;
  createDiscovery(dto: CreateDiscoveryDto): Promise<DiscoveryDto>;
  getDiscoveryById(id: string): Promise<DiscoveryDto | null>;
  listDiscoveries(programId?: string): Promise<DiscoveryDto[]>;

  // Publications & Citations & Peer Reviews
  createPublication(dto: CreatePublicationDto): Promise<PublicationDto>;
  getPublicationById(id: string): Promise<PublicationDto | null>;
  listPublications(department?: AcademicDepartment): Promise<PublicationDto[]>;
  updatePublication(id: string, updates: Partial<PublicationDto>): Promise<PublicationDto | null>;
  createCitation(dto: CreateCitationDto): Promise<CitationDto>;
  listCitations(publicationId: string): Promise<CitationDto[]>;
  createPeerReview(dto: CreatePeerReviewDto): Promise<PeerReviewDto>;
  listPeerReviews(publicationId: string): Promise<PeerReviewDto[]>;

  // Grants & Collaborations & Knowledge Nodes
  createGrant(dto: CreateGrantDto): Promise<GrantDto>;
  getGrantById(id: string): Promise<GrantDto | null>;
  listGrants(): Promise<GrantDto[]>;
  updateGrant(id: string, updates: Partial<GrantDto>): Promise<GrantDto | null>;
  createCollaborator(dto: CreateCollaboratorDto): Promise<CollaboratorDto>;
  listCollaborators(department?: AcademicDepartment): Promise<CollaboratorDto[]>;
  createKnowledgeNode(dto: CreateAcademicKnowledgeNodeDto): Promise<AcademicKnowledgeNodeDto>;
  getKnowledgeNodeById(id: string): Promise<AcademicKnowledgeNodeDto | null>;
  listKnowledgeNodes(domain?: AcademicDepartment): Promise<AcademicKnowledgeNodeDto[]>;

  // Metrics
  getResearchMetrics(universityId?: string): Promise<ResearchMetricsDto>;
}
