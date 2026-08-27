import { IAIMentorProvider } from './IAIMentorProvider';
import { MockMentorProvider } from './MockMentorProvider';
import { GeminiMentorProvider } from './GeminiMentorProvider';
import { env } from '../../config/env';

export class MentorProviderFactory {
  public static createProvider(providerType?: string): IAIMentorProvider {
    const selected = providerType || env.AI_PROVIDER || 'mock';

    switch (selected.toLowerCase()) {
      case 'gemini':
        return new GeminiMentorProvider();
      case 'mock':
      default:
        return new MockMentorProvider();
    }
  }
}
