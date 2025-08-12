import { IDatabase } from 'pg-promise';
import { injectable, inject } from 'tsyringe';

import logger from '@src/utils/logger';

import { SearchRepository } from './search.repository';
import { SearchGroup } from '../models/search-group';
import { SearchResult } from '../models/search-result';

@injectable()
export class SearchPGRepository implements SearchRepository {
  constructor(@inject('geodb') private cnn: IDatabase<unknown>) {}

  public async executeSearch(searchTerm: string): Promise<SearchGroup<SearchResult<unknown>>[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapResult = (result: any, finished = true) => ({ finished, data: result });
    const catchError = () => wrapResult(null, false);

    const results = await Promise.all([
      this.searchClave(searchTerm).then(wrapResult).catch(catchError),
      this.searchColonia(searchTerm).then(wrapResult).catch(catchError),
      this.searchCalle(searchTerm).then(wrapResult).catch(catchError),
    ]);

    const searches = results
      .filter((x) => x && x.finished)
      .map((x) => x.data)
      .reduce((a, b) => a.concat(b), []);

    const searchGroups: SearchGroup<SearchResult<unknown>>[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searches.map((s: any) => {
      const index = searchGroups.findIndex((x) => x.group === s.type);
      if (index >= 0) {
        searchGroups[index].items.push({
          display: s.location,
          data: s,
        });
      } else {
        searchGroups.push({
          term: searchTerm,
          group: s.type,
          items: [
            {
              display: s.location,
              data: s,
            },
          ],
        });
      }
    });

    return searchGroups;
  }

  private async searchClave(searchTerm: string): Promise<unknown[]> {
    interface DbResponse {
      clave_lote: string;
      idpredio: string;
      calle: string;
      colonia: string;
      geom: string;
    }
    const query = `SELECT clave_lote, idpredio, calle, colonia, ST_AsGeoJson(geom) AS geom
      FROM geo."Predio"
      WHERE unaccent(clave_lote) ILIKE unaccent($1)
    ;`;

    try {
      const dbResponse: DbResponse[] = await this.cnn.any<DbResponse>(query, [`${searchTerm}%`]);
      return dbResponse.map((row: DbResponse) => {
        return {
          type: 'CLAVE',
          clave: row.clave_lote,
          idPredio: row.idpredio,
          calle: row.calle,
          colonia: row.colonia,
          location: row.clave_lote + ' - ' + row.calle + ' Col. ' + row.colonia,
          geometry: JSON.parse(row.geom),
        };
      });
    } catch (err) {
      logger.error(err);
      throw new Error('Error al buscar clave');
    }
  }

  private async searchColonia(searchTerm: string): Promise<unknown[]> {
    interface DbResponse {
      colonia: string;
      geom: string;
    }
    const query = `SELECT colonia, ST_AsGeoJson(geom) AS geom
      FROM geo."Colonia"
      WHERE unaccent(colonia) ILIKE unaccent($1)
    ;`;

    try {
      const dbResponse: DbResponse[] = await this.cnn.any<DbResponse>(query, [`%${searchTerm}%`]);
      return dbResponse.map((row: DbResponse) => {
        return {
          type: 'COLONIA',
          colonia: row.colonia,
          location: row.colonia,
          geometry: JSON.parse(row.geom),
        };
      });
    } catch (err) {
      logger.error(err);
      throw new Error('Error al buscar colonia');
    }
  }

  private async searchCalle(searchTerm: string): Promise<unknown[]> {
    interface DbResponse {
      nombre: string;
      idredvial: string;
      geom: string;
    }
    const query = `SELECT nombre, idredvial, ST_AsGeoJson(geom) AS geom
      FROM geo."RedVial"
      WHERE unaccent(nombre) ILIKE unaccent($1)
    ;`;

    try {
      const dbResponse: DbResponse[] = await this.cnn.any<DbResponse>(query, [`%${searchTerm}%`]);
      return dbResponse.map((row: DbResponse) => {
        return {
          type: 'CALLE',
          calle: row.nombre,
          idRedVial: row.idredvial,
          location: row.nombre,
          geometry: JSON.parse(row.geom),
        };
      });
    } catch (err) {
      logger.error(err);
      throw new Error('Error al buscar calle');
    }
  }
}
