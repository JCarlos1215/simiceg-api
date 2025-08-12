import { IDatabase } from 'pg-promise';
import { injectable, inject } from 'tsyringe';

import logger from '@src/utils/logger';

import { TocRepository } from './toc.repository';
import { Toc } from '../models/toc';

interface TocDbResponse {
  titulo: string;
  servidor: string;
  servicio: string;
  leyenda: string;
  atribucion: string;
  tipo: 'TILE' | 'WMTS' | 'IMAGE' | 'VECTORTILE';
  opciones: string;
  isvisible: boolean;
  opacity: number;
  hasidentify: boolean;
  zindex: number;
  graphoption: string;
  groupname: string;
  icon: string;
}

@injectable()
export class TocPGRepository implements TocRepository {
  constructor(@inject('webdbapp') private cnn: IDatabase<unknown>) {}

  public async getToc(idRol: string): Promise<Toc> {
    const query = `SELECT l.titulo, l.servidor, l.servicio, l.leyenda, l.atribucion, l.tipo, l.opciones,
      tl.isvisible, tl.opacity, tl.hasidentify, tl.zindex, tl.graphoption, 
      tg.groupname, tg.icon
      FROM webapi."permission_per_rol" pr
      INNER JOIN webapi."permission_type" t ON t.idpermissiontype = pr.idpermissiontype
      INNER JOIN webapi."layer" l ON pr.idvinculo = l.idlayer
      INNER JOIN webapi."toc_layer" tl ON tl.idlayer = l.idlayer
      INNER JOIN webapi."toc_element" te ON tl.idtocelement = te.idtocelement
      INNER JOIN webapi."toc_group" tg ON tg.idtocelement = te.idtocparent
      WHERE t."permissiontype" = 'layer' AND pr.idrol = $1
      ORDER by tg.groupname, l.titulo
    ;`;

    try {
      const tocData: TocDbResponse[] = await this.cnn.any<TocDbResponse>(query, [idRol]);
      const toc: Toc = { groups: [] };
      for (const row of tocData) {
        const index = toc.groups.findIndex((x) => x.group === row.groupname);
        if (index >= 0) {
          // Ya existe el grupo
          toc.groups[index].content.push({
            title: row.titulo,
            type: row.tipo,
            server: row.servidor,
            service: row.servicio,
            legend: row.leyenda,
            attribution: row.atribucion,
            isVisible: row.isvisible,
            opacity: row.opacity,
            options: row.opciones,
            hasIdentify: row.hasidentify,
            zIndex: row.zindex,
            graphOptions: JSON.parse(JSON.stringify(row.graphoption)),
          });
        } else {
          // Crea el grupo
          toc.groups.push({
            group: row.groupname,
            icon: row.icon,
            content: [
              {
                title: row.titulo,
                type: row.tipo,
                server: row.servidor,
                service: row.servicio,
                legend: row.leyenda,
                attribution: row.atribucion,
                isVisible: row.isvisible,
                options: row.opciones,
                opacity: row.opacity,
                hasIdentify: row.hasidentify,
                zIndex: row.zindex,
                graphOptions: JSON.parse(JSON.stringify(row.graphoption)),
              },
            ],
          });
        }
      }
      return toc;
    } catch (err) {
      logger.error(err, `[Modulo: Toc][TocPGRepository][getToc] Error: %s`, err.message);
      throw new Error('Error al consultar toc');
    }
  }
}
