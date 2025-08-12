import { NewGraph } from '../models/new-graph';
import { GraphData } from '../models/graph-data';

export interface GraphRepository {
  getStadisticByIdLayer(idlayer: string, options: NewGraph): Promise<GraphData[]>;
}
