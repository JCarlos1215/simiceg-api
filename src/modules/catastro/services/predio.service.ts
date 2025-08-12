import { Geometry } from 'geojson';
import { injectable, inject, registry } from 'tsyringe';
import { Predio } from '../models/predio';
import { PredioOption } from '../models/predio-option';

import { PredioPGRepository } from '../repositories/predio.pg.repository';
import { PredioRepository } from '../repositories/predio.repository';
import bluebird from 'bluebird';
import { PredioFrente } from '../models/predio-frente';

@injectable()
@registry([{ token: 'PredioRepository', useClass: PredioPGRepository }])
export class PredioService {
  constructor(@inject('PredioRepository') private predioRepository: PredioRepository) {}

  public async getPredioByGeometry(geom: Geometry, option: PredioOption = { frentes: false }): Promise<Predio[]> {
    const predioData: Predio[] = await this.predioRepository.getPredioByGeometry(geom);
    if (option.frentes) {
      await bluebird.map(
        predioData,
        async (row: Predio) => {
          const frentes: PredioFrente[] = await this.predioRepository.getPredioFrenteById(row.idPredio);
          row.frente = frentes;
        },
        { concurrency: 4 }
      );
    }
    return predioData;
  }

  /*public async getPredioByClave(idPredio: string, isDownload: boolean): Promise<Predio> {
    return this.predioRepository.getPredioByClave(idPredio, isDownload);
  }*/

  public async getHeadingByIdPredioFrente(idPredioFrente: string): Promise<number> {
    return this.predioRepository.getHeadingByIdPredioFrente(idPredioFrente);
  }
}
