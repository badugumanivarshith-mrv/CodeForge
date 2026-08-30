import { IDataIntelligenceRepository } from '../../repositories/interfaces/IDataIntelligenceRepository';
import { CreateDataSourceDto, DataSourceDto } from '@codeforge/shared';

export class DataPipelineService {
  constructor(private dataRepo: IDataIntelligenceRepository) {}

  public async importData(dto: CreateDataSourceDto): Promise<DataSourceDto> {
    return this.dataRepo.createDataSource(dto);
  }

  public async listSources(): Promise<DataSourceDto[]> {
    return this.dataRepo.listDataSources();
  }
}
