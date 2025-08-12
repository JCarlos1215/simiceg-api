import { injectable, inject, registry } from 'tsyringe';

import { TocPGRepository } from './repositories/toc.pg.repository';
import { TocRepository } from './repositories/toc.repository';
import { Toc } from './models/toc';

@injectable()
@registry([{ token: 'TocRepository', useClass: TocPGRepository }])
export class TocService {
  constructor(@inject('TocRepository') private tocRepository: TocRepository) {}

  public async getToc(idRol: string): Promise<Toc> {
    return this.tocRepository.getToc(idRol);
  }
}
