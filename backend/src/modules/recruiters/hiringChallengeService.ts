import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import {
  HiringChallengeDto,
  CreateHiringChallengeDto,
  HiringChallengeStandingDto,
} from '@codeforge/shared';

export class HiringChallengeService {
  constructor(private placementRepo: IPlacementRepository = new PlacementRepository()) {}

  public async createHiringChallenge(
    arg1: string,
    arg2: string | CreateHiringChallengeDto,
    arg3?: CreateHiringChallengeDto,
  ): Promise<HiringChallengeDto> {
    let companyId: string;
    let recruiterId: string;
    let dto: CreateHiringChallengeDto;

    if (typeof arg2 === 'object') {
      recruiterId = arg1;
      dto = arg2 as CreateHiringChallengeDto;
      const recruiter = await this.placementRepo.getRecruiterByUserId(recruiterId);
      if (!recruiter) {
        throw new Error('Unauthorized: Recruiter profile required to create hiring challenges.');
      }
      companyId = recruiter.companyId;
    } else {
      companyId = arg1;
      recruiterId = arg2 as string;
      dto = arg3!;
    }

    return await this.placementRepo.createHiringChallenge(companyId, recruiterId, dto);
  }

  public async createChallenge(
    companyId: string,
    recruiterId: string,
    dto: CreateHiringChallengeDto,
  ): Promise<HiringChallengeDto> {
    return await this.createHiringChallenge(companyId, recruiterId, dto);
  }

  public async getChallengeById(id: string): Promise<HiringChallengeDto> {
    const challenge = await this.placementRepo.getHiringChallengeById(id);
    if (!challenge) {
      throw new Error(`Hiring challenge with ID '${id}' not found.`);
    }
    return challenge;
  }

  public async listChallenges(companyId?: string): Promise<HiringChallengeDto[]> {
    return await this.placementRepo.listHiringChallenges(companyId);
  }

  public async listHiringChallenges(companyId?: string): Promise<HiringChallengeDto[]> {
    return await this.listChallenges(companyId);
  }

  public async getChallengeStandings(challengeId: string): Promise<HiringChallengeStandingDto[]> {
    return await this.placementRepo.getHiringChallengeStandings(challengeId);
  }

  public async getStandings(challengeId: string): Promise<HiringChallengeStandingDto[]> {
    return await this.getChallengeStandings(challengeId);
  }
}
