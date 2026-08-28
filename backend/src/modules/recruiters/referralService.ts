import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import {
  ReferralDto,
  CreateReferralDto,
  ReferralRequestDto,
  CreateReferralRequestDto,
  ReferralStatus,
} from '@codeforge/shared';

export class ReferralService {
  constructor(private placementRepo: IPlacementRepository = new PlacementRepository()) {}

  public async submitReferral(referrerId: string, dto: CreateReferralDto): Promise<ReferralDto> {
    return await this.placementRepo.createReferral(referrerId, dto);
  }

  public async listCompanyReferrals(companyId: string): Promise<ReferralDto[]> {
    return await this.placementRepo.listReferralsByCompany(companyId);
  }

  public async listUserReferrals(referrerId: string): Promise<ReferralDto[]> {
    return await this.placementRepo.listReferralsByReferrer(referrerId);
  }

  public async updateReferralStatus(
    arg1: string,
    arg2: string | ReferralStatus,
    arg3?: ReferralStatus | string,
    arg4?: string,
  ): Promise<ReferralDto> {
    let referralId: string;
    let status: ReferralStatus;
    let notes: string | undefined;

    if (typeof arg2 === 'string' && (Object.values(ReferralStatus) as string[]).includes(arg2)) {
      referralId = arg1;
      status = arg2 as ReferralStatus;
      notes = arg3 as string | undefined;
    } else {
      referralId = arg2 as string;
      status = arg3 as ReferralStatus;
      notes = arg4;
    }

    const updated = await this.placementRepo.updateReferralStatus(referralId, status, notes);
    if (!updated) {
      throw new Error(`Referral with ID '${referralId}' not found.`);
    }
    return updated;
  }

  public async updateReferral(referralId: string, status: ReferralStatus, notes?: string): Promise<ReferralDto> {
    return await this.updateReferralStatus(referralId, status, notes);
  }

  public async requestReferral(candidateId: string, dto: CreateReferralRequestDto): Promise<ReferralRequestDto> {
    const job = await this.placementRepo.getJobPostingById(dto.jobId);
    if (!job) {
      throw new Error(`Target job with ID '${dto.jobId}' not found.`);
    }

    return await this.placementRepo.createReferralRequest(candidateId, dto, job.companyId);
  }

  public async listCandidateReferralRequests(candidateId: string): Promise<ReferralRequestDto[]> {
    return await this.placementRepo.listReferralRequestsByCandidate(candidateId);
  }

  public async listCompanyReferralRequests(companyId: string): Promise<ReferralRequestDto[]> {
    return await this.placementRepo.listReferralRequestsByCompany(companyId);
  }

  public async updateReferralRequest(requestId: string, status: ReferralStatus): Promise<ReferralRequestDto> {
    const updated = await this.placementRepo.updateReferralRequestStatus(requestId, status);
    if (!updated) {
      throw new Error(`Referral request with ID '${requestId}' not found.`);
    }
    return updated;
  }
}
