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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoserverService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const geoserver_params_service_1 = require("@src/services/geoserver-params.service");
const environment_1 = __importDefault(require("@src/utils/environment"));
const axios_1 = __importDefault(require("axios"));
const tsyringe_1 = require("tsyringe");
const geoserver = environment_1.default.GEOSERVER;
let GeoserverService = class GeoserverService {
    constructor() {
        this.http = axios_1.default;
    }
    async describeLayer(serviceName) {
        const parameters = new geoserver_params_service_1.GeoserverParams();
        parameters.service = 'WMS';
        parameters.version = '1.1.1';
        parameters.request = 'DescribeLayer';
        parameters.outputFormat = 'application/json';
        parameters.layers = serviceName;
        return this.execute(geoserver + 'wms', parameters);
    }
    async getAttributes(layerName) {
        const parameters = new geoserver_params_service_1.GeoserverParams();
        const idLayerArray = layerName.split(':');
        const workspace = Array.isArray(idLayerArray) ? idLayerArray[0] : undefined;
        parameters.service = 'WFS';
        parameters.version = '2.0.0';
        parameters.request = 'DescribeFeatureType';
        parameters.outputFormat = 'application/json';
        parameters.typeNames = layerName;
        return this.execute(geoserver + workspace + '/wfs', parameters);
    }
    async getFeatures(layerName, cqlFilter) {
        const parameters = this.iniConfigQueryParams();
        const idLayerArray = layerName.split(':');
        const workspace = Array.isArray(idLayerArray) ? idLayerArray[0] : undefined;
        parameters.typeNames = layerName;
        parameters.cqlFilter = encodeURIComponent(cqlFilter);
        return this.execute(geoserver + workspace + '/wfs', parameters);
    }
    async getLegendGraphic(layerName) {
        const parameters = new geoserver_params_service_1.GeoserverParams();
        parameters.service = 'WMS';
        parameters.version = '1.1.0';
        parameters.request = 'GetLegendGraphic';
        parameters.format = 'application/json';
        parameters.layer = layerName;
        return this.execute(geoserver + 'wms', parameters);
    }
    getAlphanumericalQuery(campo, campo2, criterio, criterio2, comodin) {
        switch (comodin) {
            case geoserver_params_service_1.Comodin.QUECONTENGA:
                return campo + `%20ilike%20'%25` + criterio.toUpperCase() + `%25'`;
            case geoserver_params_service_1.Comodin.QUEEMPIEZECON:
                return campo + `%20ilike%20'` + criterio.toUpperCase() + `%25'`;
            case geoserver_params_service_1.Comodin.QUETERMINECON:
                return campo + `%20ilike%20'%25` + criterio.toUpperCase() + `'`;
            case geoserver_params_service_1.Comodin.IGUALA:
                return campo + `%20=%20'` + criterio.toUpperCase() + `'`;
            case geoserver_params_service_1.Comodin.MAYORQUE:
                return campo + `%20>%20'` + criterio.toUpperCase() + `'`;
            case geoserver_params_service_1.Comodin.MENORQUE:
                return campo + `%20<%20'` + criterio.toUpperCase() + `'`;
            case geoserver_params_service_1.Comodin.MAYOROIGUALA:
                return campo + `%20>=%20'` + criterio.toUpperCase() + `'`;
            case geoserver_params_service_1.Comodin.MENOROIGUALA:
                return campo + `%20<=%20'` + criterio.toUpperCase() + `'`;
            case geoserver_params_service_1.Comodin.ENTRE:
                return (campo +
                    `%20>=%20'` +
                    criterio.toUpperCase() +
                    `'%20AND%20` +
                    campo +
                    `%20<=%20'` +
                    criterio2.toUpperCase() +
                    `'`);
            case geoserver_params_service_1.Comodin.QUECONTENGAENTRE2:
                return (campo +
                    `%20ilike%20'%25` +
                    criterio.toUpperCase() +
                    `%25'%20AND%20` +
                    campo2 +
                    `%20ilike%20'%25` +
                    criterio2.toUpperCase() +
                    `%25'`);
            case geoserver_params_service_1.Comodin.EN:
                return `${campo}%20IN%20(${criterio})`;
            case geoserver_params_service_1.Comodin.TODOS:
                return '1=1';
            default:
                return campo + `%20ilike%20'%25` + criterio.toUpperCase() + `%25'`;
        }
    }
    async getLayerSource(layerName) {
        const url = `${geoserver}rest/layers/${layerName}.json`;
        const header = {
            Authorization: environment_1.default.GEOSERVER_AUTH,
            'User-Agent': 'Request-Promise',
        };
        let layerSource;
        let result = await this.http.get(url, {
            headers: header,
        });
        const attributes = [];
        if (result.data.layer && result.data.layer.resource) {
            result = await this.http.get(result.data.layer.resource.href, { headers: header });
            if (result.data.featureType && result.data.featureType.nativeName && result.data.featureType.store) {
                const nativeName = result.data.featureType.nativeName;
                for (const attribute of result.data.featureType.attributes.attribute) {
                    if (attribute.name !== 'geom') {
                        attributes.push(attribute.name);
                    }
                }
                result = await this.http.get(result.data.featureType.store.href, { headers: header });
                if (result.data.dataStore &&
                    result.data.dataStore.connectionParameters &&
                    result.data.dataStore.connectionParameters.entry) {
                    let schema = '';
                    for (const entry of result.data.dataStore.connectionParameters.entry) {
                        if (entry['@key'] === 'schema') {
                            schema = entry.$;
                            break;
                        }
                    }
                    layerSource = {
                        attributes,
                        schema,
                        table: nativeName,
                    };
                }
            }
        }
        return layerSource;
    }
    iniConfigQueryParams() {
        const parameters = new geoserver_params_service_1.GeoserverParams();
        parameters.service = 'WFS';
        parameters.version = '2.0.0';
        parameters.request = 'GetFeature';
        parameters.outputFormat = 'application/json';
        parameters.srsName = 'EPSG:100000';
        // parameters.maxFeatures = '50';
        return parameters;
    }
    async execute(url, params) {
        const paramsEncode = params.url_encode();
        const header = {
            'User-Agent': 'Request-Promise',
        };
        const result = await this.http.get(url + paramsEncode, { headers: header });
        return result.data;
    }
};
GeoserverService = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [])
], GeoserverService);
exports.GeoserverService = GeoserverService;
//# sourceMappingURL=geoserver.service.js.map