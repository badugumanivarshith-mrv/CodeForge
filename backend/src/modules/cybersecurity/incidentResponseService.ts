import { ICybersecurityRepository } from '../../repositories/interfaces/ICybersecurityRepository';
import { CreateIncidentDto, IncidentDto, IncidentStatus } from '@codeforge/shared';

export class IncidentResponseService {
  constructor(private securityRepo: ICybersecurityRepository) {}

  public async declareIncident(dto: CreateIncidentDto): Promise<IncidentDto> {
    return this.securityRepo.createIncident(dto, IncidentStatus.OPEN);
  }

  public async applyContainment(id: string, action: string): Promise<IncidentDto> {
    return this.securityRepo.updateIncidentStatus(id, IncidentStatus.CONTAINED, action);
  }

  public async resolveIncident(id: string): Promise<IncidentDto> {
    return this.securityRepo.updateIncidentStatus(id, IncidentStatus.RESOLVED);
  }

  public async listIncidents(): Promise<IncidentDto[]> {
    return this.securityRepo.listIncidents();
  }
}
