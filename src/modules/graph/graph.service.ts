import { injectable, inject, registry } from 'tsyringe';

import { GraphPGRepository } from './repositories/graph.pg.repository';
import { GraphRepository } from './repositories/graph.repository';
import { NewGraph } from './models/new-graph';
import { GraphData } from './models/graph-data';

@injectable()
@registry([{ token: 'GraphRepository', useClass: GraphPGRepository }])
export class GraphService {
  constructor(@inject('GraphRepository') private graphRepository: GraphRepository) {}

  public async getStadisticByIdLayer(idlayer: string, options: NewGraph): Promise<GraphData[]> {
    return this.graphRepository.getStadisticByIdLayer(idlayer, options);
  }
}
