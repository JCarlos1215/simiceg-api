import { injectable } from 'tsyringe';
import { NewGraph } from './models/new-graph';
import { GraphData } from './models/graph-data';
import { GraphService } from './graph.service';

@injectable()
export class GraphController {
  constructor(private graphService: GraphService) {}

  public async getStadisticByIdLayer(idlayer: string, options: NewGraph): Promise<GraphData[]> {
    return this.graphService.getStadisticByIdLayer(idlayer, options);
  }
}
