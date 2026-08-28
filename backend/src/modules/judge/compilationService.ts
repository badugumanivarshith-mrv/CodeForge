import { LanguageId } from '@codeforge/shared';
import { IExecutionProvider } from './ExecutionProvider';
import { CompilationRequest, CompilationResult } from './types';

export class CompilationService {
  constructor(private executionProvider: IExecutionProvider) {}

  public isCompilationRequired(languageId: LanguageId): boolean {
    return [
      LanguageId.CPP,
      LanguageId.C,
      LanguageId.JAVA,
      LanguageId.RUST,
      LanguageId.GO,
    ].includes(languageId);
  }

  public async compile(request: CompilationRequest): Promise<CompilationResult> {
    if (!this.isCompilationRequired(request.languageId)) {
      return {
        success: true,
        compileOutput: 'Compilation not required for interpreted language',
        compilationTimeMs: 0,
      };
    }

    return await this.executionProvider.compile(request);
  }
}
