import { injectable } from 'tsyringe';
import { Toc } from './models/toc';
import { TocService } from './toc.service';

@injectable()
export class TocController {
  constructor(private tocService: TocService) {}

  public async getToc(idRol: string): Promise<Toc> {
    return this.tocService.getToc(idRol);
  }
}
