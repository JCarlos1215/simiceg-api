import { Predio } from '../models/predio';

export interface PredioPlanoAPI {
  type: string;
  properties: unknown;
  geometry: unknown;
}

export class PredioPresenter {
  constructor(private predio: Predio) {}

  public getPredioPlanoAPI(): PredioPlanoAPI {
    return {
      type: 'Feature',
      properties: {
        idPredio: this.predio.idPredio,
        claveLote: this.predio.clave,
        ubicacion: this.predio.ubicacion === null ? null : this.predio.ubicacion,
        colonia: this.predio.colonia === null ? null : this.predio.colonia,
      },
      geometry: {
        ...this.predio.geometry,
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        },
      },
    };
  }
}
