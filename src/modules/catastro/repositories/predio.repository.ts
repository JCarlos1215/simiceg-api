import { Geometry } from 'geojson';
import { Predio } from '../models/predio';
import { PredioFrente } from '../models/predio-frente';

export interface PredioRepository {
  getPredioByGeometry(geom: Geometry): Promise<Predio[]>;
  // getPredioByClave(clave: string, isDownload: boolean): Promise<Predio>;
  getPredioFrenteById(idPredio: string): Promise<PredioFrente[]>;
  getHeadingByIdPredioFrente(idPredioFrente: string): Promise<number>;
}
