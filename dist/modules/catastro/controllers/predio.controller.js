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
exports.PredioController = void 0;
const tsyringe_1 = require("tsyringe");
const predio_service_1 = require("../services/predio.service");
const croquis_1 = require("@src/utils/croquis");
const plano_simple_1 = require("../reports/plano-simple");
const path = __importStar(require("path"));
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const environment_1 = __importDefault(require("@src/utils/environment"));
const formatted_date_1 = require("@src/utils/formatted-date");
// import { getFormattedNumber } from '@src/utils/formatted-number';
const logger_1 = __importDefault(require("@src/utils/logger"));
const plano_certificado_predio_small_1 = require("../reports/plano-certificado-predio-small");
const plano_certificado_predio_big_1 = require("../reports/plano-certificado-predio-big");
const plano_certificado_predio_tabloid_1 = require("../reports/plano-certificado-predio-tabloid");
const ficha_tecnica_1 = require("../reports/ficha-tecnica");
const sicam_service_1 = require("@src/modules/sicam/sicam.service");
const fonts = {
    Roboto: {
        normal: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Regular.ttf`,
        bold: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Bold.ttf`,
        italics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Italic.ttf`,
        bolditalics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-SemiboldItalic.ttf`,
    },
};
let PredioController = class PredioController {
    constructor(predioService, croquisService, sicamService) {
        this.predioService = predioService;
        this.croquisService = croquisService;
        this.sicamService = sicamService;
    }
    async getPredioByPoint(x, y, options) {
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
        return this.predioService.getPredioByGeometry(pointGeometry, options);
    }
    async getPredioByGeometry(geom, options) {
        return this.predioService.getPredioByGeometry(geom, options);
    }
    async getConstructionByPoint(x, y) {
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
        return this.predioService.getConstructionByGeometry(pointGeometry);
    }
    async getConstructionByGeometry(geom) {
        return this.predioService.getConstructionByGeometry(geom);
    }
    async getPredioNumeroExteriorByPoint(x, y) {
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
        return this.predioService.getPredioNumeroExteriorByGeometry(pointGeometry);
    }
    async getPredioNumeroExteriorByGeometry(geom) {
        return this.predioService.getPredioNumeroExteriorByGeometry(geom);
    }
    async getPredioByClave(clave, isDownload = false, options) {
        return this.predioService.getPredioByClave(clave, isDownload, options);
    }
    async getHeadingByIdPredioFrente(idPredioFrente) {
        return this.predioService.getHeadingByIdPredioFrente(idPredioFrente);
    }
    async getHeadingReferredByIdPredioFrente(idPredioFrente) {
        return this.predioService.getHeadingReferredByIdPredioFrente(idPredioFrente);
    }
    async getPredioCotaByClave(clave, isDownload = false) {
        return this.predioService.getPredioCotaByClave(clave, isDownload);
    }
    async getReportPlanoSimple(printData) {
        const predio = await this.getPredioByClave(printData.clave);
        const idPredio = predio[0].idPredio;
        let heightCroquis;
        let widthCroquis;
        switch (printData.sizePage) {
            case 'carta':
                widthCroquis = 765;
                heightCroquis = 417;
                break;
            case 'oficio':
                widthCroquis = 907;
                heightCroquis = 417;
                break;
            case 'tabloide':
                widthCroquis = 1196;
                heightCroquis = 601;
                break;
            case '60':
                widthCroquis = 1672;
                heightCroquis = 1508;
                break;
            case '90':
                widthCroquis = 2140;
                heightCroquis = 2443;
                break;
            default:
                widthCroquis = 765;
                heightCroquis = 417;
                break;
        }
        const croquis = await this.croquisService.getMapInScale(predio[0].geometry, {
            width: widthCroquis,
            height: heightCroquis,
            typeScala: printData.scala,
            buffer: 0,
            scale: +printData.personalScala,
        }, {
            filter: `1=1;idpredio='${idPredio}';idpredio='${idPredio}';idpredio='${idPredio}'`,
            layer: `gcm:PlanoSimplePredio,gcm:Predio,gcm:prediovertice,gcm:PredioCota`,
            style: `,gcm:PredioResaltar,,gcm:CotaResaltar`,
        });
        const croquisScale = this.croquisService.Scale;
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            CLAVE_CATASTRAL: predio[0].formattedClave,
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
            CROQUIS: croquis,
            NORTE: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'norte.png'),
            OBSERVATION: printData.observation,
            //MONTO_PAGO: getFormattedNumber(printData.amount),
            //FECHA_PAGO: printData.payDate,
            ESCALA: croquisScale,
            TIPO_HOJA: printData.sizePage,
        };
        const reportPlanoSimple = plano_simple_1.generatePlanoSimpleDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportPlanoSimple);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/planos/plano-simple-${printData.clave}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    idPredio,
                    uri: `/reportes/planos/plano-simple-${printData.clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PredioController][getReportPlanoSimple]', e.message, e);
            return null;
        }
    }
    async getReportPlanoCertificado(printData, certificate) {
        const planoData = await this.predioService.getPlanoCertificadoData(printData.clave);
        const idPredio = planoData[0].idPredio;
        let heightCroquis;
        let widthCroquis;
        switch (printData.sizePage) {
            case 'carta':
                widthCroquis = 524;
                heightCroquis = 397;
                break;
            case 'oficio':
                widthCroquis = 666;
                heightCroquis = 397;
                break;
            case 'tabloide':
                widthCroquis = 950;
                heightCroquis = 601;
                break;
            case '60':
                widthCroquis = 1290;
                heightCroquis = 1593;
                break;
            case '90':
                widthCroquis = 2523;
                heightCroquis = 2358;
                break;
            default:
                widthCroquis = 524;
                heightCroquis = 425;
                break;
        }
        const cotaLayer = certificate.hasCotaLegal ? 'gcm:PredioCotaLegal' : 'gcm:PredioCota';
        const cotaStyle = certificate.hasCotaLegal ? 'gcm:CotaLegal' : 'gcm:PlotCota';
        const croquis = await this.croquisService.getMapInScale(planoData[0].geometry, {
            width: widthCroquis,
            height: heightCroquis,
            typeScala: printData.scala,
            buffer: 0,
            scale: +printData.personalScala,
        }, {
            filter: `1=1;idpredio='${idPredio}';idpredio='${idPredio}';idpredio='${idPredio}'`,
            layer: `gcm:Certificado,gcm:Predio,gcm:prediovertice,${cotaLayer}`,
            style: `,gcm:PredioResaltar,gcm:PlotVertice,${cotaStyle}`,
        });
        const croquisScale = this.croquisService.Scale;
        const currentDate = new Date(Date.now());
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            //TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            FECHA_EMISION: formatted_date_1.getFormattedDate(currentDate),
            FECHA_LETRA: formatted_date_1.getFormattedDate(currentDate, '', 'letra'),
            CROQUIS: croquis,
            NORTE: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'norte.png'),
            PLANO_CERTIFICATE: planoData,
            NOMBRE_JEFE_CERTIFICACIONES: '',
            TITULO_JEFE_CERTIFICACIONES: 'Director de Catastro',
            LEYENDA_JEFE_CERTIFICACIONES: '',
            PRINT_DATA: printData,
            CERTIFICATE_DATA: certificate,
            SIMBOLOGIA: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'simbologia-predio.png'),
            DIRECTOR_CATASTRO: '',
            ESCALA: croquisScale,
            TIPO_HOJA: printData.sizePage,
        };
        let reportPlanoCertificado = {};
        if (printData.sizePage === 'carta' || printData.sizePage === 'oficio') {
            reportPlanoCertificado = plano_certificado_predio_small_1.generatePlanoCertificatePredioSmallDocumentDefinition(data);
        }
        else if (printData.sizePage === 'tabloide') {
            reportPlanoCertificado = plano_certificado_predio_tabloid_1.generatePlanoCertificatePredioTabloidDocumentDefinition(data);
        }
        else {
            reportPlanoCertificado = plano_certificado_predio_big_1.generatePlanoCertificatePredioBigDocumentDefinition(data);
        }
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportPlanoCertificado);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/planos/plano-certificado-predio-${printData.clave}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    idPredio,
                    uri: `/reportes/planos/plano-certificado-predio-${printData.clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PredioController][getReportPlanoCertificado]', e.message, e);
            return null;
        }
    }
    async createPrediCotaLegal(idPredio) {
        return this.predioService.createPrediCotaLegal(idPredio);
    }
    async getPredioUrbanInformationByPoint(x, y) {
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
        return this.predioService.getPredioUrbanInformationByGeometry(pointGeometry);
    }
    async getPredioUrbanInformationByGeometry(geom) {
        return this.predioService.getPredioUrbanInformationByGeometry(geom);
    }
    async getPredioUPInformationByPoint(x, y) {
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
        return this.predioService.getPredioUPInformationByGeometry(pointGeometry);
    }
    async getPredioUPInformationByGeometry(geom) {
        return this.predioService.getPredioUPInformationByGeometry(geom);
    }
    async getPredioParcelaInformationByPoint(x, y) {
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
        return this.predioService.getPredioParcelaInformationByGeometry(pointGeometry);
    }
    async getPredioParcelaInformationByGeometry(geom) {
        return this.predioService.getPredioParcelaInformationByGeometry(geom);
    }
    async getPredioRusticoInformationByPoint(x, y) {
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
        return this.predioService.getPredioRusticoInformationByGeometry(pointGeometry);
    }
    async getPredioRusticoInformationByGeometry(geom) {
        return this.predioService.getPredioRusticoInformationByGeometry(geom);
    }
    async getFichaTecnica(clave, typePredio) {
        let predio;
        let croquisFilter = '';
        let croquisLayer = '';
        let croquisStyles = '';
        switch (typePredio) {
            case 'urbano':
                predio = await this.predioService.getPredioUrbanInformationByClave(clave);
                croquisFilter = `1=1;idpredio='${predio.idPredio}';idpredio='${predio.idPredio}';idpredio='${predio.idPredio}'`;
                croquisLayer = `gcm:MapaBaseFichaUrbano,gcm:Predio,gcm:PredioCota,gcm:PredioNumeroExterior`;
                croquisStyles = `,gcm:PredioResaltarFichaUrbano,gcm:PredioCotaFichaUrbano,gcm:PredioNumeroExterior`;
                break;
            case 'up':
                predio = await this.predioService.getPredioUPInformationByClave(clave);
                croquisFilter = `1=1;idup='${predio.idPredio}'`;
                croquisLayer = `gcm:MapaBaseFichaUPS,gcm:vwUps`;
                croquisStyles = `,gcm:PredioResaltarFichaUPS`;
                break;
            case 'parcela':
                predio = await this.predioService.getPredioParcelaInformationByClave(clave);
                croquisFilter = `1=1;1=1;idparcela='${predio.idPredio}';idpredio='${predio.idPredio}'`;
                croquisLayer = `gcm:sentinel,gcm:MapaBaseFichaParcela,gcm:vwParcela,gcm:vwParcelaCota`;
                croquisStyles = `raster,,gcm:PredioResaltarFichaParcela,gcm:PredioCotaFichaParcela`;
                break;
            case 'rustico':
                predio = await this.predioService.getPredioRusticoInformationByClave(clave);
                croquisFilter = `1=1;idpredio='${predio.idPredio}';idpredio='${predio.idPredio}'`;
                croquisLayer = `gcm:MapaBaseFichaRustico,gcm:vwPredioR,gcm:PredioCota`;
                croquisStyles = `,gcm:PredioResaltarFichaRustico,gcm:PredioCotaFichaRustico`;
                break;
            default:
                break;
        }
        const historyData = await this.sicamService.getHistorySICAM('', 0, predio.formattedClave);
        const simicegData = await this.predioService.getFichaSIMICEGData(clave);
        const croquisPredio = await this.croquisService.getMapToCover(predio.geometry, 583, 283, {
            filter: croquisFilter,
            layer: croquisLayer,
            style: croquisStyles,
        }, 5);
        const data = {
            CROQUIS: croquisPredio,
            NORTE: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'norte.png'),
            SIMICEG_DATA: simicegData,
            HISTORY_SICAM: historyData.length > 0
                ? historyData[0]
                : {
                    idCuenta: 0,
                    recaudadora: 0,
                    clave: clave,
                    subpredio: 0,
                    idMovimineto: 0,
                    descripcion: '',
                    yearComprobante: 0,
                    folioComprobante: 0,
                },
        };
        const reportAvaluoSimple = ficha_tecnica_1.generateFichaSIMICEGDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            console.log('reporte:', reportAvaluoSimple);
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportAvaluoSimple);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/fichas/ficha-simiceg-${clave}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    clave,
                    uri: `/reportes/fichas/ficha-simiceg-${clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PredioController][getFichaTecnica]', e.message, e);
            return null;
        }
    }
};
PredioController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [predio_service_1.PredioService,
        croquis_1.CroquisService,
        sicam_service_1.SICAMService])
], PredioController);
exports.PredioController = PredioController;
//# sourceMappingURL=predio.controller.js.map