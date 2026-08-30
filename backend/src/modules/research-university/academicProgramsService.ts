import {
  IResearchUniversityRepository,
  researchUniversityRepository,
} from '../../repositories';
import {
  ResearchProgramDto,
  CreateResearchProgramDto,
  ResearchProjectDto,
  CreateResearchProjectDto,
  AcademicDepartment,
  ResearchProgramStatus,
} from '@codeforge/shared';

export class AcademicProgramsService {
  constructor(private repo: IResearchUniversityRepository = researchUniversityRepository) {}

  /**
   * Proposes a new academic research program
   */
  async proposeProgram(dto: CreateResearchProgramDto): Promise<ResearchProgramDto> {
    if (!dto.name || !dto.description || !dto.department) {
      throw new Error('Program name, description, and academic department are required.');
    }

    const leadFacultyAgent = dto.leadFacultyAgent || this.assignLeadFacultyAgent(dto.department);
    const milestones = dto.targetMilestones && dto.targetMilestones.length > 0
      ? dto.targetMilestones
      : [
          'Formulate foundational axioms and literature review',
          'Deploy simulation workloads to digital laboratory',
          'Execute empirical validation and statistical analysis',
          'Draft publication pre-print for peer review committee',
        ];

    return this.repo.createProgram({
      ...dto,
      leadFacultyAgent,
      targetMilestones: milestones,
      status: dto.status || ResearchProgramStatus.PROPOSED,
      allocatedBudgetUsd: dto.allocatedBudgetUsd || 750000,
    });
  }

  /**
   * Activates an approved research program
   */
  async activateProgram(programId: string): Promise<ResearchProgramDto> {
    const program = await this.repo.getProgramById(programId);
    if (!program) {
      throw new Error(`Research program not found for ID: ${programId}`);
    }

    const updated = await this.repo.updateProgram(programId, {
      status: ResearchProgramStatus.ACTIVE,
    });
    if (!updated) throw new Error(`Failed to activate program ${programId}`);
    return updated;
  }

  /**
   * Submits program for peer review
   */
  async submitProgramForPeerReview(programId: string): Promise<ResearchProgramDto> {
    const program = await this.repo.getProgramById(programId);
    if (!program) {
      throw new Error(`Research program not found for ID: ${programId}`);
    }

    const updated = await this.repo.updateProgram(programId, {
      status: ResearchProgramStatus.PEER_REVIEW,
    });
    if (!updated) throw new Error(`Failed to submit program ${programId} for peer review`);
    return updated;
  }

  /**
   * Retrieves program by ID
   */
  async getProgram(programId: string): Promise<ResearchProgramDto | null> {
    return this.repo.getProgramById(programId);
  }

  /**
   * Lists research programs optionally filtered by department
   */
  async listPrograms(department?: AcademicDepartment): Promise<ResearchProgramDto[]> {
    return this.repo.listPrograms(department);
  }

  /**
   * Creates a sub-project within a research program
   */
  async createProject(dto: CreateResearchProjectDto): Promise<ResearchProjectDto> {
    const program = await this.repo.getProgramById(dto.programId);
    if (!program) {
      throw new Error(`Cannot attach project. Parent program not found: ${dto.programId}`);
    }

    return this.repo.createProject({
      ...dto,
      principalInvestigator: dto.principalInvestigator || program.leadFacultyAgent,
      status: dto.status || ResearchProgramStatus.ACTIVE,
    });
  }

  /**
   * Lists all projects attached to a program
   */
  async listProjectsByProgram(programId: string): Promise<ResearchProjectDto[]> {
    return this.repo.listProjectsByProgram(programId);
  }

  /**
   * Helper to automatically assign a world-class faculty agent archetype based on discipline
   */
  private assignLeadFacultyAgent(department: AcademicDepartment): string {
    const archetypes: Record<AcademicDepartment, string> = {
      [AcademicDepartment.ARTIFICIAL_INTELLIGENCE]: 'Prof. Alan Turing Autonomous Chair',
      [AcademicDepartment.COMPUTER_SCIENCE]: 'Dr. Ada Lovelace Distributed Systems Chair',
      [AcademicDepartment.MATHEMATICS]: 'Prof. Emmy Noether Topological Invariants Chair',
      [AcademicDepartment.ENGINEERING]: 'Dr. Nikola Tesla Advanced Systems Fellow',
      [AcademicDepartment.ECONOMICS]: 'Prof. John von Neumann Game Theory Chair',
      [AcademicDepartment.BUSINESS]: 'Dr. Herbert Simon Decision Sciences Fellow',
      [AcademicDepartment.HEALTHCARE]: 'Dr. Rosalind Franklin Molecular Biocomputing Fellow',
      [AcademicDepartment.SOCIAL_SCIENCES]: 'Prof. Norbert Wiener Cybernetics Chair',
    };

    return archetypes[department] || 'Senior Autonomous Faculty Fellow';
  }
}

export const academicProgramsService = new AcademicProgramsService();
