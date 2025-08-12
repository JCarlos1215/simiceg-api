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
exports.AvaluoController = void 0;
const tsyringe_1 = require("tsyringe");
const avaluo_service_1 = require("./avaluo.service");
const avaluo_error_1 = require("./errors/avaluo.error");
const environment_1 = __importDefault(require("@src/utils/environment"));
const croquis_1 = require("@src/utils/croquis");
const avaluo_simple_1 = require("./reports/avaluo-simple");
const path = __importStar(require("path"));
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const formatted_date_1 = require("@src/utils/formatted-date");
const logger_1 = __importDefault(require("@src/utils/logger"));
const manzana_service_1 = require("../catastro/services/manzana.service");
const predio_service_1 = require("../catastro/services/predio.service");
const fonts = {
    Roboto: {
        normal: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Regular.ttf`,
        bold: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Bold.ttf`,
        italics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Italic.ttf`,
        bolditalics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-SemiboldItalic.ttf`,
    },
};
let AvaluoController = class AvaluoController {
    constructor(avaluoService, croquisService, manzanaService, predioService) {
        this.avaluoService = avaluoService;
        this.croquisService = croquisService;
        this.manzanaService = manzanaService;
        this.predioService = predioService;
    }
    async executeIndividualAvaluo(idPredio, user) {
        return this.avaluoService.executeIndividualAvaluo(idPredio, user);
    }
    async executeReferredAvaluo(idPredio, user, year) {
        return this.avaluoService.executeReferredAvaluo(idPredio, user, year);
    }
    async executeMultipleAvaluo(id, layer, user) {
        return this.avaluoService.executeMultipleAvaluo(id, layer, user);
    }
    async getAvaluoData(idPredio) {
        try {
            const clasificacion = await this.avaluoService.getPredioClasification(idPredio);
            const predio = await this.predioService.getPredioById(idPredio);
            const front = await this.avaluoService.getAvaluoFrenteById(idPredio);
            let avaluoTerrain = [];
            let avaluoCorner = [];
            let avaluoConstruction = [];
            let avaluoClave = {
                cuenta: '',
                clave: '',
                CURT: '',
                forma: '',
                estado: '',
                region: '',
                municipio: '',
                zona: '',
                localidad: '',
                sector: '',
                manzana: '',
                predio: '',
                edificio: '',
                unidad: '',
                areaCartografica: -1,
                perimetro: -1,
            };
            let avaluoUbication = {
                cuenta: '',
                clave: '',
                ubicacion: '',
                numeroExterior: '',
                numeroInterior: '',
                colonia: '',
                areaTitulo: -1,
            };
            let valorTotalTerreno = 0;
            let valorTotalEsquina = 0;
            let valorTotalConstruction = 0;
            let superficieTotalConstruction = 0;
            if (predio[0].clave) {
                avaluoClave = await this.avaluoService.getAvaluoClave(predio[0].clave);
                avaluoUbication = await this.avaluoService.getAvaluoUbication(predio[0].clave);
                avaluoConstruction = await this.avaluoService.getAvaluoConstruction(predio[0].clave);
                switch (clasificacion) {
                    case 'INTERMEDIO CON MAS DE UN FRENTE':
                        avaluoTerrain = await this.avaluoService.getAvaluoTerrainMiddleNFront(predio[0].clave);
                        break;
                    case 'INTERMEDIO CON UN SOLO FRENTE':
                        avaluoTerrain = await this.avaluoService.getAvaluoTerrainNormal(predio[0].clave);
                        break;
                    case 'INTERNO':
                        avaluoTerrain = await this.avaluoService.getAvaluoTerrainIntern(predio[0].clave);
                        break;
                    case 'MANZANERO':
                    case 'CABECERO':
                    case 'ESQUINA':
                        avaluoTerrain = await this.avaluoService.getAvaluoTerrainCorner(predio[0].clave);
                        avaluoCorner = await this.avaluoService.getAvaluoCorner(predio[0].clave);
                        break;
                    default:
                        break;
                }
                avaluoTerrain.map((t) => {
                    valorTotalTerreno += t.valor;
                });
                avaluoCorner.map((e) => {
                    valorTotalEsquina += e.valorEsquina;
                });
                avaluoConstruction.map((c) => {
                    valorTotalConstruction += c.valor;
                    superficieTotalConstruction += c.sc;
                });
            }
            return {
                predio: predio[0],
                clasification: clasificacion,
                clave: avaluoClave,
                ubication: avaluoUbication,
                construction: avaluoConstruction,
                totalConstruction: superficieTotalConstruction,
                totalConstructionValue: valorTotalConstruction,
                terrain: avaluoTerrain,
                totalTerrainValue: valorTotalTerreno,
                corner: avaluoCorner,
                totalCornerValue: valorTotalEsquina,
                frente: front,
                totalTerrainCornerValue: valorTotalEsquina + valorTotalTerreno,
                totalValue: valorTotalEsquina + valorTotalTerreno + valorTotalConstruction,
            };
        }
        catch (error) {
            throw new avaluo_error_1.AvaluoError(error);
        }
    }
    async getReferredAvaluoData(idPredio, year) {
        try {
            const clasificacion = await this.avaluoService.getPredioClasification(idPredio);
            const predio = await this.predioService.getPredioById(idPredio);
            const avaluoClave = await this.avaluoService.getAvaluoClave(predio[0].clave);
            const avaluoUbication = await this.avaluoService.getAvaluoUbication(predio[0].clave);
            const avaluoConstruction = await this.avaluoService.getReferredAvaluoConstruction(predio[0].clave, year);
            const front = await this.predioService.getPredioFrenteReferredById(idPredio, year);
            let avaluoTerrain = [];
            let avaluoCorner = [];
            let valorTotalTerreno = 0;
            let valorTotalEsquina = 0;
            let valorTotalConstruction = 0;
            let superficieTotalConstruction = 0;
            switch (clasificacion) {
                case 'INTERMEDIO CON MAS DE UN FRENTE':
                    avaluoTerrain = await this.avaluoService.getReferredAvaluoTerrainMiddleNFront(predio[0].clave, year);
                    break;
                case 'INTERMEDIO CON UN SOLO FRENTE':
                    avaluoTerrain = await this.avaluoService.getReferredAvaluoTerrainNormal(predio[0].clave, year);
                    break;
                case 'INTERNO':
                    avaluoTerrain = await this.avaluoService.getReferredAvaluoTerrainIntern(predio[0].clave, year);
                    break;
                case 'MANZANERO':
                case 'CABECERO':
                case 'ESQUINA':
                    avaluoTerrain = await this.avaluoService.getReferredAvaluoTerrainCorner(predio[0].clave, year);
                    avaluoCorner = await this.avaluoService.getReferredAvaluoCorner(predio[0].clave, year);
                    break;
                default:
                    break;
            }
            avaluoTerrain.map((t) => {
                valorTotalTerreno += t.valor;
            });
            avaluoCorner.map((e) => {
                valorTotalEsquina += e.valorEsquina;
            });
            avaluoConstruction.map((c) => {
                valorTotalConstruction += c.valor;
                superficieTotalConstruction += c.sc;
            });
            return {
                predio: predio[0],
                clasification: clasificacion,
                clave: avaluoClave,
                ubication: avaluoUbication,
                construction: avaluoConstruction,
                totalConstruction: superficieTotalConstruction,
                totalConstructionValue: valorTotalConstruction,
                terrain: avaluoTerrain,
                totalTerrainValue: valorTotalTerreno,
                corner: avaluoCorner,
                totalCornerValue: valorTotalEsquina,
                frente: front,
                totalTerrainCornerValue: valorTotalEsquina + valorTotalTerreno,
                totalValue: valorTotalEsquina + valorTotalTerreno + valorTotalConstruction,
            };
        }
        catch (error) {
            throw new avaluo_error_1.AvaluoError(error);
        }
    }
    async getPadronAvaluoData(idPredio) {
        try {
            const clasificacion = await this.avaluoService.getPredioClasification(idPredio);
            const predio = await this.predioService.getPredioById(idPredio);
            const front = await this.avaluoService.getAvaluoFrenteById(idPredio);
            const avaluoClave = await this.avaluoService.getAvaluoClave(predio[0].clave);
            const avaluoUbication = await this.avaluoService.getAvaluoUbication(predio[0].clave);
            const avaluoConstruction = await this.avaluoService.getAvaluoPadronConstruction(predio[0].clave);
            const avaluoTerrain = await this.avaluoService.getAvaluoPadronTerrain(idPredio);
            // let avaluoTerrain: AvaluoTerrain[] = [];
            let avaluoCorner = [];
            let valorTotalTerreno = 0;
            let valorTotalEsquina = 0;
            let valorTotalConstruction = 0;
            let superficieTotalConstruction = 0;
            switch (clasificacion) {
                case 'INTERMEDIO CON MAS DE UN FRENTE':
                    // avaluoTerrain = await this.avaluoService.getAvaluoTerrainMiddleNFront(predio[0].clave);
                    break;
                case 'INTERMEDIO CON UN SOLO FRENTE':
                    // avaluoTerrain = await this.avaluoService.getAvaluoTerrainNormal(predio[0].clave);
                    break;
                case 'INTERNO':
                    // avaluoTerrain = await this.avaluoService.getAvaluoTerrainIntern(predio[0].clave);
                    break;
                case 'MANZANERO':
                case 'CABECERO':
                case 'ESQUINA':
                    // avaluoTerrain = await this.avaluoService.getAvaluoTerrainCorner(predio[0].clave);
                    avaluoCorner = await this.avaluoService.getAvaluoPadronCorner(idPredio);
                    break;
                default:
                    break;
            }
            avaluoTerrain.map((t) => {
                valorTotalTerreno += t.valor;
            });
            avaluoCorner.map((e) => {
                valorTotalEsquina += e.valorEsquina;
            });
            avaluoConstruction.map((c) => {
                valorTotalConstruction += c.valor;
                superficieTotalConstruction += c.sc;
            });
            return {
                predio: predio[0],
                clasification: clasificacion,
                clave: avaluoClave,
                ubication: avaluoUbication,
                construction: avaluoConstruction,
                totalConstruction: superficieTotalConstruction,
                totalConstructionValue: valorTotalConstruction,
                terrain: avaluoTerrain,
                totalTerrainValue: valorTotalTerreno,
                corner: avaluoCorner,
                totalCornerValue: valorTotalEsquina,
                frente: front,
                totalTerrainCornerValue: valorTotalEsquina + valorTotalTerreno,
                totalValue: valorTotalEsquina + valorTotalTerreno + valorTotalConstruction,
            };
        }
        catch (error) {
            throw new avaluo_error_1.AvaluoError(error);
        }
    }
    async getReportAvaluo(idPredio, usuario, type) {
        let avaluoData;
        let typeTitle = '';
        let folio = 'cartografico';
        if (type === 'p') {
            typeTitle = 'Padrón';
            avaluoData = await this.getPadronAvaluoData(idPredio);
            folio = `padron`;
        }
        else {
            typeTitle = 'Cartográfico';
            avaluoData = await this.getAvaluoData(idPredio);
        }
        const manzana = await this.manzanaService.getManzanaByGeometry(avaluoData.predio.geometry);
        const croquisPredio = await this.croquisService.getMapToCover(avaluoData.predio.geometry, 285, 263, {
            filter: `1=1;1=1;idpredio='${idPredio}'`,
            layer: `gcm:MapaBaseAvaluo,gcm:MapaCatastralAvaluo,gcm:Predio`,
            style: `,,gcm:PredioResaltar`,
        }, 5);
        const croquisManzana = await this.croquisService.getMapToCover(manzana[0].geometry, 285, 263, {
            filter: `1=1;1=1;idpredio='${idPredio}'`,
            layer: `gcm:MapaBaseAvaluo,gcm:Manzana,gcm:Predio`,
            style: `,,gcm:PredioResaltar`,
        }, 5);
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            AVALUO_DATA: avaluoData,
            CROQUIS_PREDIO: croquisPredio,
            CROQUIS_MANZANA: croquisManzana,
            TYPE_TITLE: typeTitle,
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
            OBSERVACIONES: '',
            VALUADOR: '',
            REVISO: '',
        };
        const reportAvaluoSimple = avaluo_simple_1.generateAvaluoSimpleDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportAvaluoSimple);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/avaluos/avaluo-${folio}-${avaluoData.clave.clave}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    idPredio,
                    uri: `/reportes/avaluos/avaluo-${folio}-${avaluoData.clave.clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[AvaluoController][getAvaluo]', e.message, e);
            return null;
        }
    }
    async hasAvaluo(clave) {
        return this.avaluoService.hasAvaluo(clave);
    }
    async hasReferredAvaluo(idPredio, year) {
        return this.avaluoService.hasReferredAvaluo(idPredio, year);
    }
    async deleteMultipleAvaluo() {
        return this.avaluoService.deleteMultipleAvaluo();
    }
};
AvaluoController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [avaluo_service_1.AvaluoService,
        croquis_1.CroquisService,
        manzana_service_1.ManzanaService,
        predio_service_1.PredioService])
], AvaluoController);
exports.AvaluoController = AvaluoController;
//# sourceMappingURL=avaluo.controller.js.map