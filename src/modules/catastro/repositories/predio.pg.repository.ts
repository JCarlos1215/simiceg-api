import { IDatabase } from 'pg-promise';
import { injectable, inject } from 'tsyringe';

import logger from '@src/utils/logger';

import { PredioRepository } from './predio.repository';
import { Geometry } from 'geojson';
import { Predio } from '../models/predio';
import { PredioFrente } from '../models/predio-frente';

interface DBPredioDataResponse {
  clave_lote: string;
  idpredio: string;
  calle: string;
  colonia: string;
  geom: string;
}

interface DBPredioFrenteDataResponse {
  idprediofrente: string;
  idpredio: string;
  calle: string;
  medida: number;
  geom: string;
}

@injectable()
export class PredioPGRepository implements PredioRepository {
  constructor(@inject('geodb') private cnn: IDatabase<unknown>) {}

  public async getPredioByGeometry(geom: Geometry): Promise<Predio[]> {
    const query = `SELECT clave_lote, calle, colonia, idpredio, ST_AsGeoJSON(geom) as geom
      FROM geo."Predio"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
    ;`;
    try {
      const predioRows: DBPredioDataResponse[] = await this.cnn.any<DBPredioDataResponse>(query, [geom]);
      return predioRows.map((p: DBPredioDataResponse): Predio => this.createPredioFromDbResponse(p));
    } catch (err) {
      logger.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioByGeometry] Error: %s`, err.message);
      throw err;
    }
  }

  /*public async getPredioByClave(clave: string, isDownload: boolean): Promise<Predio> {
    let query = `SELECT clave_lote, calle, colonia, idpredio, `;
    query += isDownload ? `ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom ` : `ST_AsGeoJSON(geom) as geom `;
    query += `FROM geo."Predio"
      WHERE clave_lote = $1
    ;`;

    try {
      let predioRow: DBPredioDataResponse = await this.cnn.oneOrNone<DBPredioDataResponse>(query, [clave]);
      if (!predioRow) {
        predioRow = {
          clave_lote: '',
          calle: '',
          colonia: '',
          idpredio: '',
          geom: null,
        };
      }
      return this.createPredioFromDbResponse(predioRow);
    } catch (err) {
      logger.error(err, `[Modulo: Predio][PredioPGRepository][getPredioByClave] Error: %s`, err.message);
      throw err;
    }
  }*/

  public async getPredioFrenteById(idPredio: string): Promise<PredioFrente[]> {
    const query = `SELECT idprediofrente, idpredio, calle, medida, ST_AsGeoJSON(geom) as geom
      FROM valuacion."vmPredioFrenteSimplificado"
      WHERE idpredio = $1
    ;`;
    try {
      const predioFrenteRows: DBPredioFrenteDataResponse[] = await this.cnn.any<DBPredioFrenteDataResponse>(query, [
        idPredio,
      ]);
      return predioFrenteRows.map(
        (f: DBPredioFrenteDataResponse): PredioFrente => this.createPredioFrenteFromDbResponse(f)
      );
    } catch (err) {
      logger.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioFrenteById] Error: %s`, err.message);
      throw err;
    }
  }

  public async getHeadingByIdPredioFrente(idPredioFrente: string): Promise<number> {
    const query = `SELECT valuacion.sic_get_heading(geom) AS heading
      FROM valuacion."vmPredioFrenteSimplificado"
      WHERE idprediofrente = $1
    ;`;
    try {
      const result: { heading: number } = await this.cnn.oneOrNone<{ heading: number }>(query, [idPredioFrente]);
      return result.heading;
    } catch (e) {
      logger.error(
        e,
        `[Modulo: Catastro][PredioPgRepository: getHeadingByIdPredioFrente][idPredioFrente: ${idPredioFrente}] Error: %s`,
        e.message
      );
      throw new Error('Error al consultar');
    }
  }

  private createPredioFromDbResponse(predio: DBPredioDataResponse): Predio {
    return {
      clave: predio.clave_lote,
      idPredio: predio.idpredio,
      ubicacion: predio.calle,
      colonia: predio.colonia,
      frente: [],
      geometry: JSON.parse(predio.geom),
    };
  }

  private createPredioFrenteFromDbResponse(frente: DBPredioFrenteDataResponse): PredioFrente {
    return {
      idPredioFrente: frente.idprediofrente,
      idPredio: frente.idpredio,
      calle: frente.calle,
      medida: frente.medida,
      geometry: JSON.parse(frente.geom),
    };
  }
}
