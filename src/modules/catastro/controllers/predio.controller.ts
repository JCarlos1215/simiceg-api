import { Geometry } from 'geojson';
import { injectable } from 'tsyringe';
import { Predio } from '../models/predio';
import { PredioOption } from '../models/predio-option';
import { PredioService } from '../services/predio.service';

@injectable()
export class PredioController {
  constructor(private predioService: PredioService) {}

  public async getPredioByPoint(x: number, y: number, options?: PredioOption): Promise<Predio[]> {
    const pointGeometry = {
      type: 'Point',
      coordinates: [x, y],
      crs: {
        type: 'name',
        properties: {
          name: `EPSG:6369`,
        },
      },
    };

    return this.predioService.getPredioByGeometry(pointGeometry as Geometry, options);
  }

  public async getPredioByGeometry(geom: Geometry, options?: PredioOption): Promise<Predio[]> {
    return this.predioService.getPredioByGeometry(geom, options);
  }

  /*public async getPredioByClave(clave: string, isDownload = false): Promise<Predio> {
    return this.predioService.getPredioByClave(clave, isDownload);
  }*/

  public async getHeadingByIdPredioFrente(idPredioFrente: string): Promise<number> {
    return this.predioService.getHeadingByIdPredioFrente(idPredioFrente);
  }
}
