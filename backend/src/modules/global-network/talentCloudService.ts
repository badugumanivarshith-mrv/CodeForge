import { IGlobalEcosystemRepository, globalEcosystemRepository } from '../../repositories';
import {
  TalentProfileDto,
  VerifiedSkillDto,
  SkillVerificationRequestDto,
  TalentMatchScoreDto,
  ReputationTier,
  EcosystemEventCategory,
} from '@codeforge/shared';

export class TalentCloudService {
  constructor(private repo: IGlobalEcosystemRepository = globalEcosystemRepository) {}

  async createOrUpdateProfile(userId: string, data: Partial<TalentProfileDto>): Promise<TalentProfileDto> {
    const existing = await this.repo.getTalentProfileByUserId(userId);
    if (existing) {
      Object.assign(existing, data);
      return existing;
    }
    return this.repo.createTalentProfile(userId, data);
  }

  async getProfile(userId: string): Promise<TalentProfileDto | null> {
    return this.repo.getTalentProfileByUserId(userId);
  }

  async searchTalent(query: { tier?: ReputationTier; minScore?: number; skill?: string }): Promise<TalentProfileDto[]> {
    let profiles = await this.repo.listTalentProfiles(query.tier, query.minScore);
    if (query.skill) {
      // Filter by skill
      const filtered: TalentProfileDto[] = [];
      for (const p of profiles) {
        const skills = await this.repo.listVerifiedSkills(p.id);
        if (skills.some(s => s.skillName.toLowerCase().includes(query.skill!.toLowerCase()))) {
          filtered.push(p);
        }
      }
      return filtered;
    }
    return profiles;
  }

  async requestSkillVerification(userId: string, req: SkillVerificationRequestDto): Promise<any> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error(`Talent profile not found for user ${userId}.`);
    }

    const request = await this.repo.createSkillVerificationRequest(profile.id, req);

    // Auto-verify if score >= 80
    if ((req.assessmentScore || 0) >= 80) {
      await this.repo.addVerifiedSkill(profile.id, req.skillName, 'expert', req.assessmentScore);
      await this.repo.updateReputation(userId, 25, 20);
      await this.repo.recordEvent(
        EcosystemEventCategory.SKILL_VERIFIED,
        `Skill Verified: ${req.skillName}`,
        `User ${profile.fullName} verified skill "${req.skillName}" with assessment score ${req.assessmentScore}%.`,
        { userId, skill: req.skillName }
      );
    }

    return request;
  }

  async verifySkill(
    talentProfileId: string,
    skillName: string,
    proficiencyLevel: string = 'advanced',
    score: number = 90.0
  ): Promise<VerifiedSkillDto> {
    return this.repo.addVerifiedSkill(talentProfileId, skillName, proficiencyLevel, score);
  }

  async matchTalentForRole(
    roleTitleOrParams: string | { roleTitle: string; requiredSkills: string[]; budgetHourlyMaxUsd?: number },
    requiredSkillsArg?: string[]
  ): Promise<TalentMatchScoreDto[]> {
    const roleTitle = typeof roleTitleOrParams === 'string' ? roleTitleOrParams : roleTitleOrParams.roleTitle;
    const requiredSkills = typeof roleTitleOrParams === 'string' ? (requiredSkillsArg || []) : (roleTitleOrParams.requiredSkills || []);

    const allProfiles = await this.repo.listTalentProfiles();
    const matches: TalentMatchScoreDto[] = [];

    for (const talent of allProfiles) {
      const verified = await this.repo.listVerifiedSkills(talent.id);
      const verifiedNames = verified.map(v => v.skillName.toLowerCase());

      const matching = requiredSkills.filter(s => verifiedNames.includes(s.toLowerCase()));
      const missing = requiredSkills.filter(s => !verifiedNames.includes(s.toLowerCase()));

      const matchRatio = requiredSkills.length ? (matching.length / requiredSkills.length) : 1;
      const matchScore = Math.round(matchRatio * 70 + (talent.reputationScore / 500) * 30);

      matches.push({
        talent,
        matchScore: Math.min(99, Math.max(75, matchScore)),
        matchingSkills: matching,
        missingSkills: missing,
        fitSummary: `${matching.length}/${requiredSkills.length} required skills verified with ${talent.reputationTier} standing.`,
      });
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const talentCloudService = new TalentCloudService();
