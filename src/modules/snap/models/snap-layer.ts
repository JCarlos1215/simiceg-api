import { BBox } from 'geojson';

export class SnapLayer {
  public id: string;
  public layer: string;
  public schema: string;
  public table: string;
  public geometryField: string;
  public srid: number;
  public scales: [number, number];
  public bbox: BBox;
  public status: 'ACTIVE' | 'INACTIVE';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public isScaleValid(scale: number): boolean {
    return this.scales[0] <= scale && scale <= this.scales[1];
  }

  public isVisible(bbox: BBox): boolean {
    if (this.bbox[3] < bbox[1] || this.bbox[1] > bbox[3] || this.bbox[2] < bbox[0] || this.bbox[0] > bbox[2]) {
      return false;
    }
    return true;
  }
}
