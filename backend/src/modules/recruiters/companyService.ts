import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import { CompanyDto, CreateCompanyDto, UpdateCompanyDto, RecruiterProfileDto, RegisterRecruiterDto } from '@codeforge/shared';

export class CompanyService {
  constructor(private placementRepo: IPlacementRepository = new PlacementRepository()) {}

  public async createCompany(dto: CreateCompanyDto): Promise<CompanyDto> {
    return await this.placementRepo.createCompany(dto);
  }

  public async getCompanyById(id: string): Promise<CompanyDto> {
    const comp = await this.placementRepo.getCompanyById(id);
    if (!comp) {
      throw new Error(`Company with ID '${id}' not found.`);
    }
    return comp;
  }

  public async getCompanyBySlug(slug: string): Promise<CompanyDto> {
    const comp = await this.placementRepo.getCompanyBySlug(slug);
    if (!comp) {
      throw new Error(`Company with slug '${slug}' not found.`);
    }
    return comp;
  }

  public async getCompany(idOrSlug: string): Promise<CompanyDto> {
    let comp = await this.placementRepo.getCompanyById(idOrSlug);
    if (!comp) {
      comp = await this.placementRepo.getCompanyBySlug(idOrSlug);
    }
    if (!comp) {
      throw new Error(`Company '${idOrSlug}' not found.`);
    }
    return comp;
  }

  public async updateCompany(id: string, dto: UpdateCompanyDto): Promise<CompanyDto> {
    const updated = await this.placementRepo.updateCompany(id, dto);
    if (!updated) {
      throw new Error(`Company with ID '${id}' not found.`);
    }
    return updated;
  }

  public async listCompanies(search?: string, isVerified?: boolean): Promise<CompanyDto[]> {
    return await this.placementRepo.listCompanies(search, isVerified);
  }

  public async registerRecruiter(userId: string, dto: RegisterRecruiterDto): Promise<RecruiterProfileDto> {
    let companyId = dto.companyId;

    if (!companyId && dto.companyName) {
      const existing = await this.placementRepo.listCompanies(dto.companyName);
      if (existing.length > 0) {
        companyId = existing[0].id;
      } else {
        const newComp = await this.placementRepo.createCompany({
          name: dto.companyName,
          website: dto.website,
          industry: dto.industry,
          location: dto.location,
          size: dto.size,
        });
        companyId = newComp.id;
      }
    }

    if (!companyId) {
      throw new Error('Either companyId or companyName is required for recruiter registration.');
    }

    const existingRecruiter = await this.placementRepo.getRecruiterByUserId(userId);
    if (existingRecruiter) {
      return existingRecruiter;
    }

    return await this.placementRepo.registerRecruiter(userId, companyId, dto);
  }

  public async getRecruiterProfile(userId: string): Promise<RecruiterProfileDto | null> {
    return await this.placementRepo.getRecruiterByUserId(userId);
  }
}
