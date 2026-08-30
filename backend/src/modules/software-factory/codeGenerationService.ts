import { ISoftwareFactoryRepository } from '../../repositories/interfaces/ISoftwareFactoryRepository';
import { GeneratedArtifactDto, ArtifactType } from '@codeforge/shared';

export class CodeGenerationService {
  constructor(private repo: ISoftwareFactoryRepository) {}

  async generateArtifact(projectId: string, taskId: string, filePath: string): Promise<GeneratedArtifactDto> {
    const project = await this.repo.getProjectById(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    // Dynamic file content based on naming conventions
    let fileContent = '';
    let artifactType = ArtifactType.SOURCE_CODE;

    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      fileContent = `// Generated Code: ${filePath}\n// Project: ${project.name}\n`;
      if (filePath.includes('controller')) {
        fileContent += `export class ResourceController {\n  async getResource(req, res) {\n    return res.json({ success: true, timestamp: new Date() });\n  }\n}`;
      } else if (filePath.includes('service')) {
        fileContent += `export class ResourceService {\n  async processData(data) {\n    return { ok: true, data };\n  }\n}`;
      } else {
        fileContent += `console.log("Scaffolding finished.");`;
      }
    } else if (filePath.endsWith('.json') || filePath.endsWith('.yaml')) {
      artifactType = ArtifactType.CONFIGURATION;
      fileContent = JSON.stringify(
        {
          name: project.name.toLowerCase().replace(/ /g, '-'),
          version: '1.0.0',
          dependencies: project.dependencies.reduce((acc, dep) => {
            acc[dep] = 'latest';
            return acc;
          }, {} as Record<string, string>),
        },
        null,
        2
      );
    } else if (filePath.endsWith('.md')) {
      artifactType = ArtifactType.DOCUMENTATION;
      fileContent = `# ${project.name}\n\n${project.description}\n\n## Target Platform: ${project.targetPlatform}`;
    } else {
      fileContent = `// Scaffolder package default payload`;
    }

    const artifact = await this.repo.createArtifact({
      projectId,
      taskId,
      filePath,
      artifactType,
      fileContent,
    });

    return artifact;
  }

  async listArtifacts(projectId: string): Promise<GeneratedArtifactDto[]> {
    return this.repo.listArtifactsByProject(projectId);
  }
}
