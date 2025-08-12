import { IDatabase } from 'pg-promise';
import { injectable, inject } from 'tsyringe';

import logger from '@src/utils/logger';

import { GraphRepository } from './graph.repository';
import { NewGraph } from '../models/new-graph';
import { GraphData } from '../models/graph-data';
import { GeoserverService } from '@src/services/geoserver.service';
import { GraphError } from '../errors/graph.error';

@injectable()
export class GraphPGRepository implements GraphRepository {
  constructor(@inject('geodb') private cnn: IDatabase<unknown>, private geoserverService: GeoserverService) {}

  public async getStadisticByIdLayer(idlayer: string, options: NewGraph): Promise<GraphData[]> {
    const graphData: GraphData[] = [];
    const workspace = options.service.split(':')[0];
    const validSymbolizers = new Set(['Point', 'Polygon', 'Line']);
    const unions = new Set(['AND', 'OR', 'NOT', 'LIKE', 'ILIKE', 'IS', 'NULL', 'IN']);
    try {
      const legendGraphicInfo = await this.geoserverService.getLegendGraphic(options.service);
      for (const legend of legendGraphicInfo.Legend) {
        let canGraph = false;
        const graph: GraphData = {
          chartColors: [{ backgroundColor: [] }],
          chartData: [],
          chartLabels: [],
          title: '',
          total: [{ type: 'Total', count: 0 }],
          extraData: [],
        };
        graph.title = legend.title === String.fromCharCode(160) ? legend.layerName : legend.title;
        const layerSource = await this.geoserverService.getLayerSource(workspace + ':' + legend.layerName);
        for (const rule of legend.rules) {
          if (rule.symbolizers) {
            for (const property in rule.symbolizers[0]) {
              if (validSymbolizers.has(property)) {
                canGraph = true;
                let optionFunctions = '';
                const aliases = [];
                if (options.graphOptions.options && options.graphOptions.options.length > 0) {
                  for (const chartOption of options.graphOptions.options) {
                    if (chartOption.schema === layerSource.schema && chartOption.table === layerSource.table) {
                      for (const funcion of chartOption.functions) {
                        optionFunctions += `, ${funcion.code} AS "${funcion.alias}" `;
                        aliases.push(funcion.alias);
                      }
                    }
                  }
                }
                const query = rule.filter
                  ? `SELECT COUNT(*) AS qty ${optionFunctions}
                  FROM ${layerSource.schema}."${layerSource.table}"
                  WHERE ${this.filterExpressionTokenizer(rule.filter.replace('[', '').replace(']', ''))
                    .map((x: string) => {
                      if (/^[a-z]/i.test(x)) {
                        if (unions.has(x.toUpperCase())) {
                          return x;
                        } else {
                          return `"${x}"`;
                        }
                      } else {
                        return x;
                      }
                    })
                    .join(' ')};`
                  : `SELECT COUNT(*) AS qty ${optionFunctions}
                  FROM ${layerSource.schema}."${layerSource.table}";
                `;

                const result = await this.cnn.one(query);
                switch (property) {
                  case 'Point':
                    graph.chartColors[0].backgroundColor.push(rule.symbolizers[0][property].graphics[0].fill);
                    break;
                  case 'Line':
                    graph.chartColors[0].backgroundColor.push(rule.symbolizers[0][property].stroke);
                    break;
                  case 'Polygon':
                    if (Object.prototype.hasOwnProperty.call(rule.symbolizers[0][property], 'fill')) {
                      graph.chartColors[0].backgroundColor.push(rule.symbolizers[0][property].fill);
                    } else {
                      graph.chartColors[0].backgroundColor.push(rule.symbolizers[0][property].stroke);
                    }
                    break;
                }
                const title = rule.title ? rule.title.trim() : rule.name.trim();
                graph.chartLabels.push(title);
                graph.chartData.push(Math.floor(result.qty));
                graph.total[0].count += Math.floor(result.qty);
                for (const alias of aliases) {
                  graph.extraData.push({
                    name: title,
                    data: Math.floor(result[alias]),
                    type: alias,
                  });
                  const index = graph.total.findIndex((x) => x.type === alias);
                  index >= 0
                    ? (graph.total[index].count += Math.floor(result[alias]))
                    : graph.total.push({ type: alias, count: Math.floor(result[alias]) });
                }
              }
            }
          }
        }
        if (canGraph) {
          graphData.push(graph);
        }
      }
      return graphData;
    } catch (err) {
      logger.error(err, `[Modulo: Graph][GraphPGRepository][getStadisticByIdLayer] Error: %s`, err.message, idlayer);
      throw new GraphError('No fue posible obtener los datos para graficar esta capa');
    }
  }

  private filterExpressionTokenizer(expression: string): string[] {
    const tokens = [];
    let partialToken = '';
    let stringFlag = false;
    for (let i = 0, il = expression.length; i < il; i++) {
      if (!stringFlag && expression[i] === ' ') {
        tokens.push(partialToken);
        partialToken = '';
        continue;
      } else if (expression[i] === "'" && stringFlag) {
        stringFlag = false;
      } else if (expression[i] === "'" && !stringFlag) {
        stringFlag = true;
      }
      partialToken += expression[i];
    }
    if (partialToken.length > 0) {
      tokens.push(partialToken);
    }
    return tokens;
  }
}
