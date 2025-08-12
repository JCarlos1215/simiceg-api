"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdicionController = void 0;
const tsyringe_1 = require("tsyringe");
const edicion_service_1 = require("../services/edicion.service");
const edicion_error_1 = require("../errors/edicion.error");
const environment_1 = __importDefault(require("@src/utils/environment"));
const croquis_1 = require("@src/utils/croquis");
const path = __importStar(require("path"));
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const logger_1 = __importDefault(require("@src/utils/logger"));
const xml2js = require("xml2js");
const deslinde_catastral_report_1 = require("../reports/deslinde-catastral-report");
const formatted_date_1 = require("@src/utils/formatted-date");
const predio_service_1 = require("../services/predio.service");
const fonts = {
    Roboto: {
        normal: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Regular.ttf`,
        bold: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Bold.ttf`,
        italics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Italic.ttf`,
        bolditalics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-SemiboldItalic.ttf`,
    },
};
let EdicionController = class EdicionController {
    constructor(edicionService, croquisService, predioService) {
        this.edicionService = edicionService;
        this.croquisService = croquisService;
        this.predioService = predioService;
    }
    async createFusion(json, user, tramite) {
        let fusion = {
            idFusion: '',
            json: '',
            user: '',
            fecha: null,
            tramite: '',
            generado: false,
            geometry: null,
        };
        try {
            const idFusion = await this.edicionService.insertFusion(json, user, tramite);
            if (idFusion) {
                await this.edicionService.generateFusion(idFusion);
                fusion = await this.edicionService.getFusion(idFusion);
            }
            else {
                throw new edicion_error_1.EdicionError('Error al insertar fusión');
            }
            return fusion;
        }
        catch (error) {
            throw new edicion_error_1.EdicionError(error);
        }
    }
    async applyFusion(idFusion, idPredominante) {
        return this.edicionService.applyFusion(idFusion, idPredominante);
    }
    async validateFusion(claves) {
        return this.edicionService.validateFusion(claves);
    }
    async validateDebtOwnerFusion(claves) {
        return this.edicionService.validateDebtOwnerFusion(claves);
    }
    async getLinderos(idPredio, user) {
        try {
            const canDivide = await this.edicionService.executeDivisionLinderos(idPredio, user);
            if (canDivide) {
                return await this.edicionService.getLinderos(idPredio);
            }
            else {
                throw new edicion_error_1.EdicionError('Error al generar linderos');
            }
        }
        catch (error) {
            throw new edicion_error_1.EdicionError(error);
        }
    }
    async deleteLinderos(idPredio) {
        return this.edicionService.deleteLinderos(idPredio);
    }
    async divideLindero(lindero) {
        return this.edicionService.divideLindero(lindero);
    }
    async createParalela(lindero) {
        return this.edicionService.createParalela(lindero);
    }
    async cleanEditionPredio(idPredio) {
        return this.edicionService.cleanEditionPredio(idPredio);
    }
    async createDivision(json, id, user, tramite) {
        let division = {
            idDivision: '',
            idGeometry: '',
            lineJSON: '',
            user: '',
            fecha: null,
            tramite: '',
            generado: false,
            geometry: null,
        };
        try {
            const idDivision = await this.edicionService.insertDivision(json, id, user, tramite);
            if (idDivision) {
                await this.edicionService.generateDivision(idDivision);
                division = await this.edicionService.getDivision(idDivision);
            }
            else {
                throw new edicion_error_1.EdicionError('Error al insertar subdivisión');
            }
            return division;
        }
        catch (error) {
            throw new edicion_error_1.EdicionError(error);
        }
    }
    async applyDivision(idDivision) {
        return this.edicionService.applyDivision(idDivision);
    }
    async validateDivision(claves) {
        return this.edicionService.validateDivision(claves);
    }
    async getEditionLayers() {
        return this.edicionService.getEditionLayers();
    }
    async getEditionAttributeByIdLayer(idLayer) {
        return this.edicionService.getEditionAttributeByIdLayer(idLayer);
    }
    async existClasificationConstruction(clave) {
        return this.edicionService.existClasificationConstruction(clave);
    }
    async updateAttributes(layer, attributes, id) {
        return this.edicionService.updateAttributes(layer, attributes, id);
    }
    async getEditionObjectByPoint(layer, attributes, x, y) {
        const pointGeometry = {
            type: 'Point',
            coordinates: [x, y],
            crs: {
                type: 'name',
                properties: {
                    name: `EPSG:32613`,
                },
            },
        };
        return this.edicionService.getEditionObjectByGeometry(layer, attributes, pointGeometry);
    }
    async deleteObjectById(layer, id) {
        return this.edicionService.deleteObjectById(layer, id);
    }
    async getEditionObjectByGeometry(layer, attributes, geom) {
        return this.edicionService.getEditionObjectByGeometry(layer, attributes, geom);
    }
    async getReportDeslindeCatastral(idPredio, usuario) {
        await this.edicionService.executeDeslindeCatastral(idPredio, usuario);
        const deslindeData = await this.edicionService.getDeslindeCatastral(idPredio);
        const predio = await this.predioService.getPredioById(idPredio);
        const croquis = await this.croquisService.getMapToCover(predio[0].geometry, 583, 263, {
            filter: `1=1;idpredio='${idPredio}';clave='${predio[0].clave}'`,
            layer: `gcm:PlanoCertificadoPredio,gcm:vwColindancias,gcm:PredioCota`,
            style: `,gcm:colindancias,gcm:CotaResaltar`,
        }, 5);
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            CROQUIS: croquis,
            NORTE: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'norte.png'),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
            DESLINDE: deslindeData,
        };
        const reportDeslindeCatastral = deslinde_catastral_report_1.generateDeslindeCatastralDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportDeslindeCatastral);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/deslinde-catastral/deslinde-catastral-${idPredio}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    idPredio,
                    uri: `/reportes/deslinde-catastral/deslinde-catastral-${idPredio}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[EditionController][getReportDeslindeCatastral]', e.message, e);
            return null;
        }
    }
    async getParalelas(idPredio, user) {
        return this.edicionService.getParalelas(idPredio, user);
    }
    async alignLindero(idPredio, tolerance) {
        if (tolerance >= 0 && tolerance <= 0.35) {
            return this.edicionService.alignLindero(idPredio, tolerance);
        }
        else {
            throw new edicion_error_1.EdicionError('La tolerencia debe estar en rango 0 - 0.35');
        }
    }
    async splitConstruction(idPredio) {
        return this.edicionService.splitConstruction(idPredio);
    }
    async addKMLGeometries(upload, user) {
        const parser = new xml2js.Parser();
        const data = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parser.parseString(upload.kml, (err, result) => {
            const typeGeoms = result.kml.Document[0].Schema.length;
            for (let i = 0; i < typeGeoms; i++) {
                if (i === 0) {
                    if (result.kml.Document[0].Folder[i]) {
                        const numGeoms = result.kml.Document[0].Folder[i].Placemark.length;
                        for (let j = 0; j < numGeoms; j++) {
                            if (result.kml.Document[0].Folder[i].Placemark[j].Polygon) {
                                const coords = result.kml.Document[0].Folder[i].Placemark[j].Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0].trim();
                                const coordinates = [];
                                const arrayPoints = coords.split(' ');
                                for (const p of arrayPoints) {
                                    if (p !== '') {
                                        const coordinate = p.split(',');
                                        const point = [+coordinate[0], +coordinate[1]];
                                        coordinates.push([...point]);
                                    }
                                }
                                data.push({ type: 'Polygon', geom: { type: 'Polygon', coordinates: [[...coordinates]] } });
                            }
                            else if (result.kml.Document[0].Folder[i].Placemark[j].Point) {
                                const coords = result.kml.Document[0].Folder[i].Placemark[j].Point[0].coordinates[0].trim();
                                const coordinates = [];
                                const coordinate = coords.split(',');
                                const point = [+coordinate[0], +coordinate[1]];
                                coordinates.push(...point);
                                data.push({ type: 'Point', geom: { type: 'Point', coordinates: [...coordinates] } });
                            }
                            else if (result.kml.Document[0].Folder[i].Placemark[j].LineString) {
                                const coords = result.kml.Document[0].Folder[i].Placemark[j].LineString[0].coordinates[0].trim();
                                const coordinates = [];
                                const arrayPoints = coords.split(' ');
                                for (const p of arrayPoints) {
                                    if (p !== '') {
                                        const coordinate = p.split(',');
                                        const point = [+coordinate[0], +coordinate[1]];
                                        coordinates.push([...point]);
                                    }
                                }
                                data.push({ type: 'Linestring', geom: { type: 'LineString', coordinates: [...coordinates] } });
                            }
                        }
                    }
                }
                else {
                    if (result.kml.Document[0].Document[i - 1]) {
                        const numGeoms = result.kml.Document[0].Document[i - 1].Placemark.length;
                        for (let j = 0; j < numGeoms; j++) {
                            if (result.kml.Document[0].Document[i - 1].Placemark[j].Polygon) {
                                const coords = result.kml.Document[0].Document[i - 1].Placemark[j].Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0].trim();
                                const coordinates = [];
                                const arrayPoints = coords.split(' ');
                                for (const p of arrayPoints) {
                                    if (p !== '') {
                                        const coordinate = p.split(',');
                                        const point = [+coordinate[0], +coordinate[1]];
                                        coordinates.push([...point]);
                                    }
                                }
                                data.push({ type: 'Polygon', geom: { type: 'Polygon', coordinates: [[...coordinates]] } });
                            }
                            else if (result.kml.Document[0].Document[i - 1].Placemark[j].Point) {
                                const coords = result.kml.Document[0].Document[i - 1].Placemark[j].Point[0].coordinates[0].trim();
                                const coordinates = [];
                                const coordinate = coords.split(',');
                                const point = [+coordinate[0], +coordinate[1]];
                                coordinates.push(...point);
                                data.push({ type: 'Point', geom: { type: 'Point', coordinates: [...coordinates] } });
                            }
                            else if (result.kml.Document[0].Document[i - 1].Placemark[j].LineString) {
                                const coords = result.kml.Document[0].Document[i - 1].Placemark[j].LineString[0].coordinates[0].trim();
                                const coordinates = [];
                                const arrayPoints = coords.split(' ');
                                for (const p of arrayPoints) {
                                    if (p !== '') {
                                        const coordinate = p.split(',');
                                        const point = [+coordinate[0], +coordinate[1]];
                                        coordinates.push([...point]);
                                    }
                                }
                                data.push({ type: 'Linestring', geom: { type: 'LineString', coordinates: [...coordinates] } });
                            }
                        }
                    }
                }
            }
        });
        let index = 0;
        for (const g of data) {
            await this.edicionService.addGeomKML(g.geom, upload, user, index);
            index++;
        }
        return this.edicionService.getKMLGeometries(upload.name);
    }
    async getStreetViewTaking(streetViewTake, user) {
        return this.edicionService.getStreetViewTaking(streetViewTake, user);
    }
    async deleteStreetViewTaking(user) {
        return this.edicionService.deleteStreetViewTaking(user);
    }
};
EdicionController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [edicion_service_1.EdicionService,
        croquis_1.CroquisService,
        predio_service_1.PredioService])
], EdicionController);
exports.EdicionController = EdicionController;
//# sourceMappingURL=edicion.controller.js.map