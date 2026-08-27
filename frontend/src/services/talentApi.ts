import { apiClient } from './apiClient';
import {
  ApiResponse,
  TalentProfileSummaryDto,
  TalentSearchQueryDto,
} from '@codeforge/shared';

export const talentApi = {
  searchTalent: async (params: TalentSearchQueryDto): Promise<{ profiles: TalentProfileSummaryDto[]; candidates: TalentProfileSummaryDto[]; total: number }> => {
    const res = await apiClient.get<ApiResponse<{ profiles: TalentProfileSummaryDto[]; total: number }>>('/talent/search', { params });
    const data = res.data.data;
    return {
      profiles: data.profiles,
      candidates: data.profiles,
      total: data.total,
    };
  },
};

