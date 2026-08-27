import { TopicMasteryDto, LanguageMasteryDto, LanguageId, LessonDto } from '@codeforge/shared';

export interface IProgressRepository {
  markLessonCompleted(userId: string, lessonId: string): Promise<{ isFirstCompletion: boolean }>;
  isLessonCompleted(userId: string, lessonId: string): Promise<boolean>;
  getUserCompletedLessons(userId: string): Promise<LessonDto[]>;
  getTopicMastery(userId: string, topicId: string): Promise<TopicMasteryDto | null>;
  getAllTopicMasteries(userId: string): Promise<TopicMasteryDto[]>;
  updateTopicMastery(userId: string, topicId: string, updates: Partial<TopicMasteryDto>): Promise<void>;
  getLanguageMastery(userId: string, languageId: LanguageId): Promise<LanguageMasteryDto | null>;
}
