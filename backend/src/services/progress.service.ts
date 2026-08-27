import {
  IProgressRepository,
  IGamificationRepository,
  ICurriculumRepository,
  IUserRepository,
} from '../repositories';
import {
  ProgressDashboardDto,
  TopicDto,
  LanguageId,
  XP_VALUES,
  XPTransactionType,
  MasteryLevel,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class ProgressService {
  constructor(
    private progressRepo: IProgressRepository,
    private gamificationRepo: IGamificationRepository,
    private curriculumRepo: ICurriculumRepository,
    private userRepo: IUserRepository,
  ) {}

  public async completeLesson(
    userId: string,
    lessonId: string,
  ): Promise<{ isFirstCompletion: boolean; xpAwarded: number }> {
    const lesson = await this.curriculumRepo.getLessonById(lessonId);
    if (!lesson) {
      throw new NotFoundError(`Lesson with id "${lessonId}" not found`);
    }

    const { isFirstCompletion } = await this.progressRepo.markLessonCompleted(userId, lessonId);

    let xpAwarded = 0;
    if (isFirstCompletion) {
      xpAwarded = XP_VALUES.LESSON_COMPLETE;
      await this.gamificationRepo.addXp(
        userId,
        xpAwarded,
        XPTransactionType.LESSON_COMPLETE,
        `Completed lesson: ${lesson.title}`,
        lesson.id,
      );

      // Record streak activity
      await this.gamificationRepo.recordDailyActivity(userId);

      // Update topic mastery
      const currentMastery = await this.progressRepo.getTopicMastery(userId, lesson.topicId);
      const bkt = Math.min(0.95, Number(currentMastery?.bktProbability || 0.1) + 0.1);
      await this.progressRepo.updateTopicMastery(userId, lesson.topicId, {
        bktProbability: bkt,
        masteryScore: Math.round(bkt * 100),
      });
    }

    return { isFirstCompletion, xpAwarded };
  }

  public async getDashboard(userId: string): Promise<ProgressDashboardDto> {
    const gamification = await this.gamificationRepo.getGamificationSummary(userId);
    const profile = await this.userRepo.getProfile(userId);
    const preferredLangId = profile?.preferredLanguageId || LanguageId.PYTHON;
    const activeLanguage = await this.curriculumRepo.getLanguageById(preferredLangId);

    const topicMasteries = await this.progressRepo.getAllTopicMasteries(userId);
    const recentLessons = await this.progressRepo.getUserCompletedLessons(userId);

    // Determine next recommended topic
    const langTopics = await this.curriculumRepo.getTopicsByLanguage(preferredLangId);
    const completedLessonIds = await this.curriculumRepo.getUserCompletedLessonIds(userId);

    let recommendedTopic: TopicDto | null = null;
    for (const top of langTopics) {
      const topLessons = await this.curriculumRepo.getLessonsByTopic(top.id);
      const allDone =
        topLessons.length > 0 && topLessons.every(l => completedLessonIds.has(l.id));
      if (!allDone) {
        recommendedTopic = top;
        break;
      }
    }
    if (!recommendedTopic && langTopics.length > 0) {
      recommendedTopic = langTopics[0];
    }

    return {
      gamification,
      activeLanguage,
      topicMasteries,
      recentCompletedLessons: recentLessons,
      recommendedTopic,
    };
  }
}
