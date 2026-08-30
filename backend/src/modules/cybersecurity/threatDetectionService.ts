import { ICybersecurityRepository } from '../../repositories/interfaces/ICybersecurityRepository';
import { CreateThreatDto, ThreatDto, ThreatStatus, ThreatSeverity } from '@codeforge/shared';

export class ThreatDetectionService {
  constructor(private securityRepo: ICybersecurityRepository) {}

  public async detectAnomaly(eventLogs: string[]): Promise<ThreatDto | null> {
    if (eventLogs.length > 5) {
      // Trigger anomaly threat registration
      const threat = await this.securityRepo.createThreat({
        title: 'Anomaly: Excessive Traffic Burst',
        description: 'Multiple failed authorization requests detected from matching endpoints.',
        severity: ThreatSeverity.HIGH,
        status: ThreatStatus.ACTIVE,
        affectedSystems: ['auth-service'],
        mitigationSteps: ['Force IP block via firewall rules', 'Log security audit trail'],
      });
      return threat;
    }
    return null;
  }

  public async mitigateThreat(threatId: string): Promise<ThreatDto> {
    return this.securityRepo.updateThreatStatus(threatId, ThreatStatus.MITIGATED);
  }

  public async listThreats(): Promise<ThreatDto[]> {
    return this.securityRepo.listThreats();
  }
}
