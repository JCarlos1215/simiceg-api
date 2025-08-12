import * as promise from 'bluebird';
import { BBox } from 'geojson';
import { injectable } from 'tsyringe';

import { SnapData } from './models/snap-data';
import { SnapLayerPreview } from './models/snap-layer-preview';
import { SnapService } from './snap.service';

@injectable()
export class SnapController {
  constructor(private snapService: SnapService) {}

  public async getAvailableLayers(): Promise<SnapLayerPreview[]> {
    const layers = await this.snapService.getActiveSnapLayers();
    return layers.map(
      (layer): SnapLayerPreview => ({
        id: layer.id,
        layer: layer.layer,
        bbox: layer.bbox,
        scales: layer.scales,
        srid: layer.srid,
      })
    );
  }

  public async getAllSnapGeometries(bbox: BBox, scale: number): Promise<SnapData[]> {
    const snapLayers = await this.getSnapLayers(bbox, scale);
    const data: SnapData[] = await promise.getNewLibraryCopy().map(
      snapLayers,
      async (snapLayer): Promise<SnapData> => {
        const geometries = await this.snapService.getGeometries(
          snapLayer.schema,
          snapLayer.table,
          snapLayer.geometryField,
          snapLayer.srid,
          bbox
        );
        return {
          layer: snapLayer.layer,
          geometries,
        };
      }
    );
    return data;
  }

  public async getSnapGeometriesForLayer(idlayer: string, bbox: BBox, scale: number): Promise<SnapData> {
    const snapLayer = await this.getSnapLayerById(idlayer);
    if (!snapLayer) {
      throw new Error('Capa no existe');
    }

    if (snapLayer.isScaleValid(scale) && snapLayer.isVisible(bbox)) {
      const geometries = await this.snapService.getGeometries(
        snapLayer.schema,
        snapLayer.table,
        snapLayer.geometryField,
        snapLayer.srid,
        bbox
      );
      return {
        layer: snapLayer.layer,
        geometries,
      };
    }
    return { layer: snapLayer.layer, geometries: [] };
  }

  private async getSnapLayers(bbox: BBox, scale: number) {
    const layers = await this.snapService.getActiveSnapLayers();
    return layers.filter((l) => l.isScaleValid(scale) && l.isVisible(bbox));
  }

  private async getSnapLayerById(id: string) {
    return this.snapService.getSnapLayerById(id);
  }
}
