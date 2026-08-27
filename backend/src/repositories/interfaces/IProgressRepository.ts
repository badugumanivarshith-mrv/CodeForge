import { TopicMasteryDto, LanguageMasteryDto, LanguageId } from '@codeforge/shared';

export interface IProgressRepository {
  markLessonCompleted(userId: string, lessonId: string): Promise<void>;
  getTopicMastery(userId: string, topicId: string): Promise<TopicMasteryDto | null>;
  updateTopicMastery(userId: string, topicId: string, updates: Partial<TopicMasteryDto>): Promise<void>;
  getLanguageMastery(userId: string, languageId: LanguageId): Promise<LanguageMasteryDto | null>;
}
