import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import {
  CertificateTemplateDto,
  CreateCertificateTemplateDto,
  CertificationDto,
  IssueCertificationDto,
  CertificateVerificationResultDto,
} from '@codeforge/shared';
import { logger } from '../../core/utils/logger';

export class CertificationService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async createTemplate(data: CreateCertificateTemplateDto): Promise<CertificateTemplateDto> {
    if (!data.name || !data.issuerName) {
      throw new Error('Template name and issuer name are required.');
    }
    return this.enterpriseRepo.createCertificateTemplate(data);
  }

  async listTemplates(orgId?: string): Promise<CertificateTemplateDto[]> {
    return this.enterpriseRepo.listCertificateTemplates(orgId);
  }

  async issueCertificate(data: IssueCertificationDto): Promise<CertificationDto> {
    if (!data.recipientUserId || !data.skillName) {
      throw new Error('Recipient user ID and skill/credential name are required.');
    }
    const cert = await this.enterpriseRepo.issueCertification(data);
    logger.info(
      { certificateNumber: cert.certificateNumber, recipientUserId: data.recipientUserId },
      'Digital Certificate issued successfully',
    );
    return cert;
  }

  async getCertificate(id: string): Promise<CertificationDto | null> {
    return this.enterpriseRepo.getCertificationById(id);
  }

  async listUserCertificates(userId: string): Promise<CertificationDto[]> {
    return this.enterpriseRepo.listUserCertifications(userId);
  }

  async verifyCertificate(
    identifier: string,
    ip?: string,
    userAgent?: string,
  ): Promise<CertificateVerificationResultDto> {
    if (!identifier || identifier.trim().length === 0) {
      return {
        isValid: false,
        reason: 'Empty certificate identifier provided.',
        verifiedAt: new Date().toISOString(),
      };
    }
    return this.enterpriseRepo.verifyCertificate(identifier.trim(), ip, userAgent);
  }

  async revokeCertificate(certificateId: string): Promise<boolean> {
    const success = await this.enterpriseRepo.revokeCertificate(certificateId);
    if (success) {
      logger.warn({ certificateId }, 'Certificate has been revoked.');
    }
    return success;
  }
}

export const certificationService = new CertificationService();
