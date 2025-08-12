import { BBox } from 'geojson';

export interface SnapLayerPreview {
  id: string;
  layer: string;
  srid: number;
  scales: [number, number];
  bbox: BBox;
}
