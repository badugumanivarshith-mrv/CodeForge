import {
  ICurriculumRepository,
  IProblemRepository,
  IQuizRepository,
  IProgressRepository,
} from '../repositories';
import {
  LanguageDto,
  LanguageRoadmapDto,
  TopicProgressSummaryDto,
  TopicDetailDto,
  LessonDetailDto,
  LanguageId,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class CurriculumService {
  constructor(
    private curriculumRepo: ICurriculumRepository,
    private problemRepo: IProblemRepository,
    private quizRepo: IQuizRepository,
    private progressRepo: IProgressRepository,
  ) {}

  public async getAllLanguages(): Promise<LanguageDto[]> {
    return await this.curriculumRepo.getAllLanguages();
  }

  public async getLanguageRoadmap(
    languageSlug: string,
    userId?: string,
  ): Promise<LanguageRoadmapDto> {
    const language = await this.curriculumRepo.getLanguageBySlug(languageSlug);
    if (!language) {
      throw new NotFoundError(`Language with slug "${languageSlug}" not found`);
    }

    const topics = await this.curriculumRepo.getTopicsByLanguage(language.id);
    const completedLessonIds = userId
      ? await this.curriculumRepo.getUserCompletedLessonIds(userId)
      : new Set<string>();

    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    const topicSummaries: TopicProgressSummaryDto[] = [];
    let previousTopicCompleted = true; // Topic 1 is unlocked by default

    for (const topic of topics) {
      const topicLessons = await this.curriculumRepo.getLessonsByTopic(topic.id);
      const topicProblems = await this.problemRepo.findByTopic(topic.id);
      const quiz = await this.quizRepo.getQuizByTopicId(topic.id);

      const topicCompletedLessons = topicLessons.filter(l => completedLessonIds.has(l.id)).length;
      totalLessonsCount += topicLessons.length;
      completedLessonsCount += topicCompletedLessons;

      let quizPassed = false;
      let quizBestScore = 0;
      if (userId && quiz) {
        const attempt = await this.quizRepo.getUserBestQuizAttempt(userId, quiz.id);
        if (attempt) {
          quizPassed = attempt.isPassed;
          quizBestScore = attempt.scorePercentage;
        }
      }

      const mastery = userId ? await this.progressRepo.getTopicMastery(userId, topic.id) : null;
      const isTopicLessonsDone = topicLessons.length > 0 && topicCompletedLessons === topicLessons.length;
      const isCompleted = isTopicLessonsDone && (quiz ? quizPassed : true);

      const isUnlocked = topic.sequence === 1 || previousTopicCompleted;
      previousTopicCompleted = isCompleted;

      topicSummaries.push({
        ...topic,
        isUnlocked,
        isCompleted,
        lessonsTotal: topicLessons.length,
        lessonsCompleted: topicCompletedLessons,
        problemsTotal: topicProblems.length,
        problemsSolved: mastery?.problemsSolvedCount || 0,
        quizPassed,
        masteryScore: mastery?.masteryScore || 0,
      });
    }

    const overallProgressPercentage =
      totalLessonsCount > 0
        ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
        : 0;

    return {
      language,
      topics: topicSummaries,
      overallProgressPercentage,
    };
  }

  public async getTopicDetail(
    languageSlug: string,
    topicSlug: string,
    userId?: string,
  ): Promise<TopicDetailDto> {
    const language = await this.curriculumRepo.getLanguageBySlug(languageSlug);
    if (!language) {
      throw new NotFoundError(`Language with slug "${languageSlug}" not found`);
    }

    const topic = await this.curriculumRepo.getTopicBySlug(language.id, topicSlug);
    if (!topic) {
      throw new NotFoundError(`Topic with slug "${topicSlug}" not found in language "${languageSlug}"`);
    }

    const rawLessons = await this.curriculumRepo.getLessonsByTopic(topic.id);
    const completedLessonIds = userId
      ? await this.curriculumRepo.getUserCompletedLessonIds(userId)
      : new Set<string>();

    const lessons = rawLessons.map(l => ({
      ...l,
      isCompleted: completedLessonIds.has(l.id),
    }));

    const quiz = await this.quizRepo.getQuizByTopicId(topic.id);
    let quizSummary: TopicDetailDto['quiz'] = null;
    if (quiz) {
      let isPassed = false;
      let bestScore = 0;
      if (userId) {
        const attempt = await this.quizRepo.getUserBestQuizAttempt(userId, quiz.id);
        if (attempt) {
          isPassed = attempt.isPassed;
          bestScore = attempt.scorePercentage;
        }
      }
      quizSummary = {
        id: quiz.id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        questionCount: quiz.questions?.length || 0,
        isPassed,
        bestScore,
      };
    }

    const problems = await this.problemRepo.findByTopic(topic.id);
    const problemsWithSolved = problems.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      isSolved: false, // In Phase 4 submissions engine
    }));

    return {
      topic,
      language,
      lessons,
      quiz: quizSummary,
      problems: problemsWithSolved,
    };
  }

  public async getLessonDetail(lessonId: string, userId?: string): Promise<LessonDetailDto> {
    const detail = await this.curriculumRepo.getLessonDetail(lessonId);
    if (!detail) {
      throw new NotFoundError(`Lesson with id "${lessonId}" not found`);
    }

    if (userId) {
      const isCompleted = await this.progressRepo.isLessonCompleted(userId, lessonId);
      detail.isCompleted = isCompleted;
      detail.lesson.isCompleted = isCompleted;
    }

    return detail;
  }
}
