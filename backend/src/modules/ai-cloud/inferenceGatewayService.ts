import { IAICloudRepository, aiCloudRepository } from '../../repositories';
import { InferenceRequestDto, ClusterRegion } from '@codeforge/shared';

export class InferenceGatewayService {
  constructor(private repo: IAICloudRepository = aiCloudRepository) {}

  async routeInference(deploymentId: string, promptText: string): Promise<InferenceRequestDto> {
    const deployment = await this.repo.getDeploymentById(deploymentId);
    if (!deployment) {
      throw new Error(`Deployment ${deploymentId} not found`);
    }

    // Dynamic latency calculations based on prompt size
    const promptTokens = Math.floor(promptText.length / 4) + 10;
    const completionTokens = Math.floor(Math.random() * 300) + 50;
    const latencyMs = Math.round(15.0 + (promptTokens + completionTokens) * 0.15);

    // Route token pathway region
    const cluster = await this.repo.getClusterById(deployment.clusterId);
    const routedRegion = cluster?.region || ClusterRegion.US_EAST;

    const request = await this.repo.createInferenceRequest({
      deploymentId,
      promptTokens,
      completionTokens,
      latencyMs,
      statusCode: 200,
      routedRegion,
    });

    return request;
  }

  async listRequests(deploymentId?: string): Promise<InferenceRequestDto[]> {
    return this.repo.listInferenceRequests(deploymentId);
  }
}
export const inferenceGatewayService = new InferenceGatewayService();
