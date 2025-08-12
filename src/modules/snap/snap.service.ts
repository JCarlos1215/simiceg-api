import { inject, injectable, registry } from 'tsyringe';
import { BBox, Geometry } from 'geojson';

import { SnapLayer } from './models/snap-layer';

import { SnapConfigurationPGRepository } from './repositories/snap-configuration.pg.repository';
import { SnapConfigurationRepository } from './repositories/snap-configuration.repository';

@injectable()
@registry([{ token: 'SnapConfigurationRepository', useClass: SnapConfigurationPGRepository }])
export class SnapService {
  constructor(
    @inject('SnapConfigurationRepository') private snapConfigurationRepository: SnapConfigurationRepository
  ) {}

  public async getActiveSnapLayers(): Promise<SnapLayer[]> {
    return this.snapConfigurationRepository.getActiveSnapLayers();
  }

  public async getSnapLayerById(id: string): Promise<SnapLayer> {
    return this.snapConfigurationRepository.getSnapLayer(id);
  }

  public async getAllSnapLayers(): Promise<SnapLayer[]> {
    return this.snapConfigurationRepository.getAllSnapLayers();
  }

  public async getGeometries(
    schema: string,
    table: string,
    geomField: string,
    srid: number,
    bbox: BBox
  ): Promise<Geometry[]> {
    return this.snapConfigurationRepository.getGeometries(schema, table, geomField, srid, bbox);
  }
}
