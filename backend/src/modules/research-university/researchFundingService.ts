import {
  IResearchUniversityRepository,
  researchUniversityRepository,
} from '../../repositories';
import {
  GrantDto,
  CreateGrantDto,
  AcademicDepartment,
  GrantStatus,
  GrantType,
} from '@codeforge/shared';

export class ResearchFundingService {
  constructor(private repo: IResearchUniversityRepository = researchUniversityRepository) {}

  /**
   * Registers a new research grant pool
   */
  async registerGrantPool(dto: CreateGrantDto): Promise<GrantDto> {
    if (!dto.grantTitle || !dto.grantType || !dto.fundingAgency || !dto.totalPoolUsd) {
      throw new Error('grantTitle, grantType, fundingAgency, and totalPoolUsd are required.');
    }

    const matchingDepartments = dto.matchingDepartments && dto.matchingDepartments.length > 0
      ? dto.matchingDepartments
      : [AcademicDepartment.ARTIFICIAL_INTELLIGENCE, AcademicDepartment.COMPUTER_SCIENCE];

    return this.repo.createGrant({
      ...dto,
      matchingDepartments,
      status: dto.status || GrantStatus.OPEN,
      maximumAwardUsd: dto.maximumAwardUsd || Math.min(dto.totalPoolUsd, 2500000),
    });
  }

  /**
   * Applies for a grant on behalf of a research program
   */
  async applyForGrant(grantId: string, programId: string): Promise<GrantDto> {
    const grant = await this.repo.getGrantById(grantId);
    if (!grant) throw new Error(`Grant pool not found for ID: ${grantId}`);

    const program = await this.repo.getProgramById(programId);
    if (!program) throw new Error(`Research program not found for ID: ${programId}`);

    const updated = await this.repo.updateGrant(grantId, {
      status: GrantStatus.APPLIED,
      fundedProgramId: programId,
    });
    if (!updated) throw new Error(`Failed to apply for grant ${grantId}`);
    return updated;
  }

  /**
   * Awards an approved grant to a funded research program
   */
  async awardGrant(grantId: string, awardAmountUsd?: number): Promise<GrantDto> {
    const grant = await this.repo.getGrantById(grantId);
    if (!grant) throw new Error(`Grant not found for ID: ${grantId}`);

    const awardedAmount = awardAmountUsd || grant.maximumAwardUsd;

    const updated = await this.repo.updateGrant(grantId, {
      status: GrantStatus.AWARDED,
      awardedAmountUsd: awardedAmount,
    });

    if (grant.fundedProgramId) {
      const program = await this.repo.getProgramById(grant.fundedProgramId);
      if (program) {
        await this.repo.updateProgram(grant.fundedProgramId, {
          allocatedBudgetUsd: program.allocatedBudgetUsd + awardedAmount,
        });
      }
    }

    return updated!;
  }

  /**
   * Lists all research grants
   */
  async listGrants(): Promise<GrantDto[]> {
    return this.repo.listGrants();
  }

  /**
   * Matches candidate grants for a given academic department
   */
  async matchGrantsForDepartment(department: AcademicDepartment): Promise<GrantDto[]> {
    const all = await this.repo.listGrants();
    return all.filter((g) => g.matchingDepartments.includes(department));
  }
}

export const researchFundingService = new ResearchFundingService();
