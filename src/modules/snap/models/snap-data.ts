import { Geometry } from 'geojson';

export interface SnapData {
  layer: string;
  geometries: Geometry[];
}
