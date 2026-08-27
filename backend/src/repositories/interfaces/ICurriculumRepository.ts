import { LanguageDto, TopicDto, LessonDto, LanguageId } from '@codeforge/shared';

export interface ICurriculumRepository {
  getAllLanguages(): Promise<LanguageDto[]>;
  getLanguageById(id: LanguageId): Promise<LanguageDto | null>;
  getTopicsByLanguage(languageId: LanguageId): Promise<TopicDto[]>;
  getTopicBySlug(languageId: LanguageId, slug: string): Promise<TopicDto | null>;
  getLessonsByTopic(topicId: string): Promise<LessonDto[]>;
  getLessonById(lessonId: string): Promise<LessonDto | null>;
}
