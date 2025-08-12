"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroquisService = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const environment_1 = __importDefault(require("./environment"));
const FIXED_SCALES = [
    {
        meter: 100,
        name: '1:100',
        factor: 0.1,
    },
    {
        meter: 150,
        name: '1:150',
        factor: 0.15,
    },
    {
        meter: 200,
        name: '1:200',
        factor: 0.2,
    },
    {
        meter: 250,
        name: '1:250',
        factor: 0.25,
    },
    {
        meter: 500,
        name: '1:500',
        factor: 0.5,
    },
    {
        meter: 750,
        name: '1:750',
        factor: 0.75,
    },
    {
        meter: 1000,
        name: '1:1000',
        factor: 1,
    },
    {
        meter: 1100,
        name: '1:1100',
        factor: 1.1,
    },
    {
        meter: 1200,
        name: '1:1200',
        factor: 1.2,
    },
    {
        meter: 1500,
        name: '1:1500',
        factor: 1.5,
    },
    {
        meter: 1750,
        name: '1:1750',
        factor: 1.75,
    },
    {
        meter: 2000,
        name: '1:2000',
        factor: 2,
    },
];
class CroquisService {
    get Scale() {
        return this.scale;
    }
    async getMapToCover(geom, width, height, values, buffer = 0) {
        const bbox = this.getBboxFromGeom(geom);
        let scaleOpt = this.calcDynamicScale(bbox, buffer, width, height);
        const scaleRounded = Math.round(scaleOpt.scale / 50) * 50;
        const centerX = bbox[0] + (bbox[2] - bbox[0]) / 2;
        const centerY = bbox[1] + (bbox[3] - bbox[1]) / 2;
        const resolution = this.getResolutionFromScale(1 / scaleRounded);
        const bounds = this.calculateBounds({ x: centerX, y: centerY }, resolution, width, height);
        scaleOpt = this.calcDynamicScale(bounds, buffer, width, height);
        this.scale = scaleOpt.scale;
        const areax = bounds[2] + bounds[0];
        const areay = bounds[3] + bounds[1];
        const imageUrl = this.getMapUrl({
            x: areax / 2,
            y: areay / 2,
        }, {
            dpi: 180,
            url: `${environment_1.default.GEOSERVER}wms`,
            height: scaleOpt.height,
            width: scaleOpt.width,
            area_x: scaleOpt.area_x,
            area_y: scaleOpt.area_y,
        }, {
            filter: values.filter,
            layer: values.layer,
            style: values.style,
        });
        const response = await axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
        return `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    }
    async getMapInScale(geom, config, values) {
        const bbox = this.getBboxFromGeom(geom);
        const scaleOpt = this.calcScale(bbox, config);
        this.scale = scaleOpt.scale;
        const imageUrl = this.getMapUrl({
            x: (bbox[0] + bbox[2]) / 2,
            y: (bbox[1] + bbox[3]) / 2,
        }, {
            dpi: 180,
            url: `${environment_1.default.GEOSERVER}wms`,
            height: scaleOpt.height,
            width: scaleOpt.width,
            area_x: scaleOpt.area_x,
            area_y: scaleOpt.area_y,
        }, {
            filter: values.filter,
            layer: values.layer,
            style: values.style,
        });
        const response = await axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
        return `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    }
    getBboxFromGeom(geom) {
        const outerRing = geom.coordinates[0];
        let [xmax, ymax] = outerRing[0];
        let [xmin, ymin] = outerRing[0];
        outerRing.forEach((coords) => {
            xmax = Math.max(xmax, coords[0]);
            xmin = Math.min(xmin, coords[0]);
            ymax = Math.max(ymax, coords[1]);
            ymin = Math.min(ymin, coords[1]);
        });
        return [xmin, ymin, xmax, ymax];
    }
    getMapUrl({ x, y }, { dpi = 180, url, width, height, area_x, area_y, }, { filter, layer, style }) {
        const bbox = [x - area_x / 2, y - area_y / 2, x + area_x / 2, y + area_y / 2];
        const query = {
            REQUEST: 'GetMap',
            SERVICE: 'WMS',
            BBOX: bbox.join(','),
            CQL_FILTER: `${filter}`,
            CRS: 'EPSG:32613',
            FORMAT: 'image/png',
            LAYERS: `${layer}`,
            exceptions: 'application/vnd.ogc.se_inimage',
            STYLES: `${style}`,
            TRANSPARENT: 'true',
            VERSION: '1.3.0',
            HEIGHT: Math.round((height * dpi) / 90),
            WIDTH: Math.round((width * dpi) / 90),
            format_options: 'dpi=' + dpi,
        };
        return url + '?' + querystring_1.default.stringify(query);
    }
    calcDynamicScale(bbox, buffer, imageWidth, imageHeight) {
        const dx = Math.abs(bbox[0] - bbox[2]) + buffer;
        const dy = Math.abs(bbox[1] - bbox[3]) + buffer;
        // pixeles / 72 * 2.54 * 10
        const fx = (imageWidth / 72) * 2.54;
        const fy = (imageHeight / 72) * 2.54;
        const scaleFactor = Math.max(Math.ceil(dx / fx), Math.ceil(dy / fy));
        return {
            area_x: fx * scaleFactor,
            area_y: fy * scaleFactor,
            meter: 10 * scaleFactor * 10,
            name: '1:' + 10 * scaleFactor * 10,
            width: imageWidth,
            height: imageHeight,
            scale: 10 * scaleFactor * 10,
        };
    }
    getResolutionFromScale(scale) {
        const DOTS_PER_INCH = 72;
        const INCHES_PER_METRE = 39.37;
        const resolution = 1 / (scale * INCHES_PER_METRE * DOTS_PER_INCH);
        return resolution;
    }
    calculateBounds(center, resolution, width, height) {
        const halfWDeg = (width * resolution) / 2;
        const halfHDeg = (height * resolution) / 2;
        const xmin = center.x - halfWDeg;
        const ymin = center.y - halfHDeg;
        const xmax = center.x + halfWDeg;
        const ymax = center.y + halfHDeg;
        return [xmin, ymin, xmax, ymax];
    }
    calcScale(bbox, config) {
        let scale;
        if (config.typeScala === 'personalizado' && !isNaN(config.scale)) {
            scale = this.calcCustomScale(config.width, config.height, config.scale);
        }
        else if (config.typeScala === 'fijo') {
            scale = this.calcFixedScale(bbox, config.buffer, config.width, config.height);
        }
        else if (config.typeScala === 'dinamico') {
            scale = this.calcDynamicScale(bbox, config.buffer, config.width, config.height);
        }
        else {
            scale = undefined;
        }
        return scale;
    }
    calcFixedScale(bbox, buffer, imageWidth, imageHeight) {
        const dx = Math.abs(bbox[0] - bbox[2]);
        const dy = Math.abs(bbox[1] - bbox[3]);
        // pixeles / 72 * 2.54 * 10
        const x = (imageWidth / 72) * 2.54 * 10;
        const y = (imageHeight / 72) * 2.54 * 10;
        return FIXED_SCALES.reduce((accumulator, currentValue) => {
            if (accumulator) {
                return accumulator;
            }
            if (dx + buffer <= x * currentValue.factor && dy + buffer <= y * currentValue.factor) {
                return {
                    area_x: x * currentValue.factor,
                    area_y: y * currentValue.factor,
                    meter: currentValue.meter,
                    name: currentValue.name,
                    width: imageWidth,
                    height: imageHeight,
                    scale: currentValue.factor * 1000,
                };
            }
            else {
                return undefined;
            }
        }, undefined);
    }
    calcCustomScale(imageWidth, imageHeight, scale) {
        // pixeles / 72 * 2.54 * 10
        const fx = ((imageWidth / 72) * 2.54) / 100;
        const fy = ((imageHeight / 72) * 2.54) / 100;
        return {
            area_x: fx * scale,
            area_y: fy * scale,
            meter: scale,
            name: '1:' + scale,
            width: imageWidth,
            height: imageHeight,
            scale: scale,
        };
    }
}
exports.CroquisService = CroquisService;
//# sourceMappingURL=croquis.js.map