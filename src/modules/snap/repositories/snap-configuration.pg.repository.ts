import { SnapLayer } from '../models/snap-layer';
import { SnapConfigurationRepository } from './snap-configuration.repository';
import { injectable, inject } from 'tsyringe';
import { IDatabase } from 'pg-promise';
import { BBox, Geometry } from 'geojson';
import logger from '@src/utils/logger';

interface DBSnapConfig {
  idsnap: string;
  layerName: string;
  schema: string;
  table: string;
  geometryField: string;
  srid: number;
  minscale: number;
  maxscale: number;
  bbox: number[];
  active: boolean;
}

@injectable()
export class SnapConfigurationPGRepository implements SnapConfigurationRepository {
  constructor(
    @inject('webdbapp') private webcnn: IDatabase<unknown>,
    @inject('geodb') private geocnn: IDatabase<unknown>
  ) {}

  public async getActiveSnapLayers(): Promise<SnapLayer[]> {
    const query = `SELECT idsnap, "layerName", schema, "table", "geometryField", srid, minscale, maxscale, bbox, active 
      FROM webapi.snap 
      WHERE active = true
    ;`;
    try {
      const configuration: DBSnapConfig[] = await this.webcnn.any<DBSnapConfig>(query);
      return configuration.map((snapConfig: DBSnapConfig): SnapLayer => this.createSnapLayerFromDBResponse(snapConfig));
    } catch (e) {
      logger.error(`[SNAP-CONFIG][PG REPOSITORY] ${e.message}`, e);
      throw new Error('Error al leer snap configuration');
    }
  }

  public async getSnapLayer(id: string): Promise<SnapLayer> {
    const query = `SELECT idsnap, "layerName", schema, "table", "geometryField", srid, minscale, maxscale, bbox, active 
      FROM webapi.snap 
      WHERE idsnap = $1 AND active = true
    ;`;
    try {
      const configuration: DBSnapConfig = await this.webcnn.oneOrNone<DBSnapConfig>(query, [id]);
      if (configuration) {
        return this.createSnapLayerFromDBResponse(configuration);
      } else {
        throw new Error(`Capa con el id '${id}' no existe`);
      }
    } catch (e) {
      logger.error(`[SNAP-CONFIG][PG REPOSITORY] ${e.message}`, e);
      throw new Error('Error al leer snap configuration');
    }
  }

  public async getAllSnapLayers(): Promise<SnapLayer[]> {
    const layers: SnapLayer[] = [].map(
      (l: SnapLayer): SnapLayer => {
        const ll = new SnapLayer();
        ll.id = l.id;
        ll.layer = l.layer;
        ll.schema = l.schema;
        ll.table = l.table;
        ll.geometryField = l.geometryField;
        ll.srid = l.srid;
        ll.scales = l.scales;
        ll.bbox = l.bbox;
        ll.status = l.status;
        return ll;
      }
    );
    return layers;
  }

  public async getGeometries(
    schema: string,
    table: string,
    geomField: string,
    srid: number,
    bbox: BBox
  ): Promise<Geometry[]> {
    const query = `SELECT st_asgeojson(${geomField}) as geometry
    FROM "${schema}"."${table}"
    WHERE st_intersects(${geomField}, ST_GeomFromText('POLYGON((${bbox[0]} ${bbox[1]}, 
      ${bbox[0]} ${bbox[3]}, ${bbox[2]} ${bbox[3]}, ${bbox[2]} ${bbox[1]}, ${bbox[0]} ${bbox[1]}))', ${srid}))
    ;`;

    const geometries = await this.geocnn.any<{ geometry: string }>(query);
    return geometries.map((g) => JSON.parse(g.geometry));
  }

  private createSnapLayerFromDBResponse(data: DBSnapConfig): SnapLayer {
    const ll = new SnapLayer();
    ll.id = data.idsnap;
    ll.layer = data.layerName;
    ll.schema = data.schema;
    ll.table = data.table;
    ll.geometryField = data.geometryField;
    ll.srid = data.srid;
    ll.scales = [data.minscale, data.maxscale];
    ll.bbox = data.bbox as BBox;
    ll.status = data.active ? 'ACTIVE' : 'INACTIVE';
    return ll;
  }
}
