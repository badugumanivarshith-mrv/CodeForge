import {
  IResearchUniversityRepository,
  researchUniversityRepository,
} from '../../repositories';
import {
  CollaboratorDto,
  CreateCollaboratorDto,
  AcademicDepartment,
} from '@codeforge/shared';

export class GlobalCollaborationService {
  constructor(private repo: IResearchUniversityRepository = researchUniversityRepository) {}

  /**
   * Registers a new partner university or research institute in the global academic network
   */
  async registerCollaborator(dto: CreateCollaboratorDto): Promise<CollaboratorDto> {
    if (!dto.institutionName || !dto.primaryDepartment) {
      throw new Error('institutionName and primaryDepartment are required.');
    }

    return this.repo.createCollaborator({
      ...dto,
      country: dto.country || 'Global Research Federation',
      leadInvestigator: dto.leadInvestigator || 'Chair of International Academic Exchange',
      reputationScore: dto.reputationScore || 94.0,
      activeSharedProjects: dto.activeSharedProjects || [],
      cooperationStatus: dto.cooperationStatus || 'ACTIVE',
    });
  }

  /**
   * Links a research program into an inter-institutional collaboration
   */
  async linkSharedProject(collaboratorId: string, programId: string): Promise<CollaboratorDto> {
    const list = await this.repo.listCollaborators();
    const collab = list.find((c) => c.id === collaboratorId);
    if (!collab) throw new Error(`Collaborator not found for ID: ${collaboratorId}`);

    if (!collab.activeSharedProjects.includes(programId)) {
      collab.activeSharedProjects.push(programId);
    }
    return collab;
  }

  /**
   * Lists collaborators optionally filtered by academic department
   */
  async listCollaborators(department?: AcademicDepartment): Promise<CollaboratorDto[]> {
    return this.repo.listCollaborators(department);
  }
}

export const globalCollaborationService = new GlobalCollaborationService();
