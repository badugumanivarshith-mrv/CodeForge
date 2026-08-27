import { LanguageDto, TopicDto, LessonDto, LessonDetailDto, LanguageId } from '@codeforge/shared';

export interface ICurriculumRepository {
  getAllLanguages(): Promise<LanguageDto[]>;
  getLanguageById(id: LanguageId): Promise<LanguageDto | null>;
  getLanguageBySlug(slug: string): Promise<LanguageDto | null>;
  getTopicsByLanguage(languageId: LanguageId): Promise<TopicDto[]>;
  getTopicBySlug(languageId: LanguageId, slug: string): Promise<TopicDto | null>;
  getTopicById(topicId: string): Promise<TopicDto | null>;
  getLessonsByTopic(topicId: string): Promise<LessonDto[]>;
  getLessonById(lessonId: string): Promise<LessonDto | null>;
  getLessonDetail(lessonId: string): Promise<LessonDetailDto | null>;
  getUserCompletedLessonIds(userId: string): Promise<Set<string>>;
}
