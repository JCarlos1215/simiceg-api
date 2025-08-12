import { Toc } from '../models/toc';

export interface TocRepository {
  getToc(idRol: string): Promise<Toc>;
}
