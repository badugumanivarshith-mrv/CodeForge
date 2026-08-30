import { ICybersecurityRepository } from '../../repositories/interfaces/ICybersecurityRepository';
import { CreateSecurityEventDto, SecurityEventDto } from '@codeforge/shared';

export class SecurityMonitoringService {
  constructor(private securityRepo: ICybersecurityRepository) {}

  public async logEvent(dto: CreateSecurityEventDto): Promise<SecurityEventDto> {
    const event = await this.securityRepo.createSecurityEvent(dto);
    return event;
  }

  public async listEvents(): Promise<SecurityEventDto[]> {
    return this.securityRepo.listSecurityEvents();
  }
}
