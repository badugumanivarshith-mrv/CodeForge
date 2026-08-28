import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import { careerTwinService, CareerTwinService } from './careerTwinService';
import {
  CareerTimelineDto,
  CareerMilestoneDto,
} from '@codeforge/shared';

export class CareerTimelineService {
  constructor(
    private repo: ICareerOsRepository = careerOsRepository,
    private twinService: CareerTwinService = careerTwinService
  ) {}

  /**
   * Retrieves complete interactive timeline: Historical Events, Current Position, and Future Milestones
   */
  async getCareerTimeline(userId: string): Promise<CareerTimelineDto> {
    const twin = await this.twinService.getOrCreateTwin(userId);
    const historicalEvents = await this.repo.listEvents(userId);
    const milestones = await this.repo.listMilestones(userId);
    const goals = await this.repo.listGoals(userId);

    const futureMilestones = milestones
      .filter(m => !m.isAchieved)
      .map(m => ({
        title: m.title,
        expectedDate: m.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        category: m.category,
        associatedGoalTitle: goals[0]?.title || undefined,
      }));

    // If no future milestones exist yet, generate smart defaults
    if (futureMilestones.length === 0) {
      futureMilestones.push(
        {
          title: `Achieve ${twin.targetRole} Competencies`,
          expectedDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'PROMOTION',
          associatedGoalTitle: `Target ${twin.targetRole}`,
        },
        {
          title: 'Publish Distributed Systems Whitepaper',
          expectedDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'BRAND',
          associatedGoalTitle: 'Thought Leadership',
        },
        {
          title: 'Complete Staff Level Mock Interview Loop',
          expectedDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'INTERVIEW',
          associatedGoalTitle: 'Technical Interview Mastery',
        }
      );
    }

    return {
      userId,
      currentStanding: {
        role: twin.currentRole,
        level: twin.currentLevel,
        company: 'CodeForge Ecosystem Engineer',
        yearsOfExperience: twin.yearsOfExperience,
        healthScore: twin.healthScore,
      },
      historicalEvents,
      milestones,
      futureMilestones,
    };
  }

  async createMilestone(
    userId: string,
    title: string,
    description: string,
    category = 'TECHNICAL',
    targetDate?: string
  ): Promise<CareerMilestoneDto> {
    const twin = await this.twinService.getOrCreateTwin(userId);
    return this.repo.createMilestone(twin.id, userId, title, description, category, targetDate);
  }

  async markMilestoneAchieved(userId: string, milestoneId: string): Promise<CareerMilestoneDto | null> {
    return this.repo.achieveMilestone(milestoneId, userId);
  }
}

export const careerTimelineService = new CareerTimelineService();
