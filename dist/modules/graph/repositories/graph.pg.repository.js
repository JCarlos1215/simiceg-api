"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
const geoserver_service_1 = require("@src/services/geoserver.service");
const graph_error_1 = require("../errors/graph.error");
let GraphPGRepository = class GraphPGRepository {
    constructor(cnn, geoserverService) {
        this.cnn = cnn;
        this.geoserverService = geoserverService;
    }
    async getPieStadisticByIdLayer(idlayer, options) {
        const graphData = [];
        const workspace = options.service.split(':')[0];
        const validSymbolizers = new Set(['Point', 'Polygon', 'Line']);
        const unions = new Set(['AND', 'OR', 'NOT', 'LIKE', 'ILIKE', 'IS', 'NULL', 'IN']);
        try {
            const legendGraphicInfo = await this.geoserverService.getLegendGraphic(options.service);
            for (const legend of legendGraphicInfo.Legend) {
                let canGraph = false;
                const graph = {
                    chartColors: [{ backgroundColor: [] }],
                    chartData: [],
                    chartLabels: [],
                    title: '',
                    total: [{ type: 'Total', count: 0 }],
                    extraData: [],
                };
                const totalNumber = [];
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
                                        .map((x) => {
                                        if (/^[a-z]/i.test(x)) {
                                            if (unions.has(x.toUpperCase())) {
                                                return x;
                                            }
                                            else {
                                                return `"${x}"`;
                                            }
                                        }
                                        else {
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
                                        }
                                        else {
                                            graph.chartColors[0].backgroundColor.push(rule.symbolizers[0][property].stroke);
                                        }
                                        break;
                                }
                                const title = rule.title ? rule.title.trim() : rule.name.trim();
                                graph.chartLabels.push(title);
                                totalNumber.push(Math.floor(result.qty));
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
                    graph.chartData = totalNumber;
                    graphData.push(graph);
                }
            }
            return graphData;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Graph][GraphPGRepository][getPieStadisticByIdLayer] Error: %s`, err.message, idlayer);
            throw new graph_error_1.GraphError('No fue posible obtener los datos para graficar esta capa');
        }
    }
    async getBarStadisticByIdLayer(idlayer, options) {
        const graphData = [];
        const workspace = options.service.split(':')[0];
        const validSymbolizers = new Set(['Point', 'Polygon', 'Line']);
        const unions = new Set(['AND', 'OR', 'NOT', 'LIKE', 'ILIKE', 'IS', 'NULL', 'IN']);
        try {
            const legendGraphicInfo = await this.geoserverService.getLegendGraphic(options.service);
            for (const legend of legendGraphicInfo.Legend) {
                if (legend.layerName === 'pt_rutas') {
                    continue;
                }
                let canGraph = false;
                const graph = {
                    chartColors: [{ backgroundColor: [] }],
                    chartData: [],
                    chartLabels: [],
                    title: '',
                    total: [{ type: 'Total', count: 0 }],
                    extraData: [],
                };
                graph.title = legend.title === String.fromCharCode(160) ? legend.layerName : legend.title;
                const layerSource = await this.geoserverService.getLayerSource(workspace + ':' + legend.layerName);
                const timeLabel = await this.getTimeBar(`${layerSource.schema}."${layerSource.table}"`, options.graphOptions.time);
                graph.chartLabels = timeLabel;
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
                                        .map((x) => {
                                        if (/^[a-z]/i.test(x)) {
                                            if (unions.has(x.toUpperCase())) {
                                                return x;
                                            }
                                            else {
                                                return `"${x}"`;
                                            }
                                        }
                                        else {
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
                                        }
                                        else {
                                            graph.chartColors[0].backgroundColor.push(rule.symbolizers[0][property].stroke);
                                        }
                                        break;
                                }
                                const title = rule.title ? rule.title.trim() : rule.name.trim();
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
                    const serieData = [];
                    for (const rule of legend.rules) {
                        const serieRes = { data: [], label: rule.name };
                        for (const currentTime of timeLabel) {
                            const query = rule.filter
                                ? `SELECT SUM(${options.graphOptions.count}) AS qty 
                  FROM ${layerSource.schema}."${layerSource.table}"
                  WHERE ${options.graphOptions.time} = $1 AND 
                  ${this.filterExpressionTokenizer(rule.filter.replace('[', '').replace(']', ''))
                                    .map((x) => {
                                    if (/^[a-z]/i.test(x)) {
                                        if (unions.has(x.toUpperCase())) {
                                            return x;
                                        }
                                        else {
                                            return `"${x}"`;
                                        }
                                    }
                                    else if (x[0] === "'") {
                                        const num = x.split("'");
                                        return isNaN(Number(num[1])) ? `unaccent(${x})` : x;
                                    }
                                    else {
                                        return x;
                                    }
                                })
                                    .join(' ')};`
                                : `SELECT SUM(${options.graphOptions.count}) AS qty
                  FROM ${layerSource.schema}."${layerSource.table}"
                  WHERE ${options.graphOptions.time} = $1;
              `;
                            const result = await this.cnn.one(query, [currentTime]);
                            const total = result.qty !== null ? Math.floor(result.qty) : 0;
                            serieRes.data.push(total);
                            graph.total[0].count += total;
                        }
                        serieData.push(serieRes);
                    }
                    graph.chartData = serieData;
                    graphData.push(graph);
                }
            }
            return graphData;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Graph][GraphPGRepository][getBarStadisticByIdLayer] Error: %s`, err.message, idlayer);
            throw new graph_error_1.GraphError('No fue posible obtener los datos para graficar esta capa');
        }
    }
    async getTimeBar(table, time) {
        const query = `SELECT DISTINCT ${time} as time
      FROM ${table}
      ORDER BY ${time}
    ;`;
        try {
            const response = await this.cnn.any(query);
            return response.map((result) => result.time);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Graph][GraphPGRepository][getTimeBar] Error: %s`, err.message);
            throw err;
        }
    }
    filterExpressionTokenizer(expression) {
        const tokens = [];
        let partialToken = '';
        let stringFlag = false;
        for (let i = 0, il = expression.length; i < il; i++) {
            if (!stringFlag && expression[i] === ' ') {
                tokens.push(partialToken);
                partialToken = '';
                continue;
            }
            else if (expression[i] === "'" && stringFlag) {
                stringFlag = false;
            }
            else if (expression[i] === "'" && !stringFlag) {
                stringFlag = true;
            }
            partialToken += expression[i];
        }
        if (partialToken.length > 0) {
            tokens.push(partialToken);
        }
        return tokens;
    }
};
GraphPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object, geoserver_service_1.GeoserverService])
], GraphPGRepository);
exports.GraphPGRepository = GraphPGRepository;
//# sourceMappingURL=graph.pg.repository.js.map