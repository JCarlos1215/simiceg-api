import { SnapLayer } from '../models/snap-layer';
import { BBox, Geometry } from 'geojson';

export interface SnapConfigurationRepository {
  getActiveSnapLayers(): Promise<SnapLayer[]>;
  getSnapLayer(id: string): Promise<SnapLayer>;
  getAllSnapLayers(): Promise<SnapLayer[]>;
  getGeometries(schema: string, table: string, geomField: string, srid: number, bbox: BBox): Promise<Geometry[]>;
}
