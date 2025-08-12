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
exports.ManzanaController = void 0;
const tsyringe_1 = require("tsyringe");
const manzana_service_1 = require("../services/manzana.service");
const path = __importStar(require("path"));
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const environment_1 = __importDefault(require("@src/utils/environment"));
const formatted_date_1 = require("@src/utils/formatted-date");
// import { getFormattedNumber } from '@src/utils/formatted-number';
const logger_1 = __importDefault(require("@src/utils/logger"));
const croquis_1 = require("@src/utils/croquis");
const plano_simple_1 = require("../reports/plano-simple");
const plano_certificado_manzana_small_1 = require("../reports/plano-certificado-manzana-small");
const plano_certificado_manzana_tabloid_1 = require("../reports/plano-certificado-manzana-tabloid");
const plano_certificado_manzana_big_1 = require("../reports/plano-certificado-manzana-big");
const fonts = {
    Roboto: {
        normal: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Regular.ttf`,
        bold: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Bold.ttf`,
        italics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Italic.ttf`,
        bolditalics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-SemiboldItalic.ttf`,
    },
};
let ManzanaController = class ManzanaController {
    constructor(manzanaService, croquisService) {
        this.manzanaService = manzanaService;
        this.croquisService = croquisService;
    }
    async getManzanaByPoint(x, y) {
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
        return this.manzanaService.getManzanaByGeometry(pointGeometry);
    }
    async getManzanaByGeometry(geom, isDownload = false) {
        return this.manzanaService.getManzanaByGeometry(geom, isDownload);
    }
    async getManzanaByClave(clave) {
        return this.manzanaService.getManzanaByClave(clave);
    }
    async getReportPlanoSimple(printData) {
        const manzana = await this.getManzanaByClave(printData.clave);
        const idManzana = manzana[0].idManzana;
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
                widthCroquis = 2523;
                heightCroquis = 2358;
                break;
            default:
                widthCroquis = 765;
                heightCroquis = 417;
                break;
        }
        const croquis = await this.croquisService.getMapInScale(manzana[0].geometry, {
            width: widthCroquis,
            height: heightCroquis,
            typeScala: printData.scala,
            buffer: 0,
            scale: +printData.personalScala,
        }, {
            filter: `1=1;idmanzana='${idManzana}'`,
            layer: `gcm:PlanoCertificadoManzana,gcm:Manzana`,
            style: `,gcm:ManzanaResaltar`,
        });
        const croquisScale = this.croquisService.Scale;
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            CLAVE_CATASTRAL: printData.clave,
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
            CROQUIS: croquis,
            NORTE: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'norte.png'),
            OBSERVATION: printData.observation,
            // MONTO_PAGO: getFormattedNumber(printData.amount),
            // FECHA_PAGO: printData.payDate,
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
                    idManzana,
                    uri: `/reportes/planos/plano-simple-${printData.clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[ManzanaController][getReportPlanoSimple]', e.message, e);
            return null;
        }
    }
    async getReportPlanoCertificado(printData, certificate) {
        const planoData = await this.manzanaService.getPlanoCertificadoData(printData.clave);
        const manzana = await this.getManzanaByClave(printData.clave);
        const idManzana = manzana[0].idManzana;
        let heightCroquis;
        let widthCroquis;
        switch (printData.sizePage) {
            case 'carta':
                widthCroquis = 524;
                heightCroquis = 459;
                break;
            case 'oficio':
                widthCroquis = 663;
                heightCroquis = 459;
                break;
            case 'tabloide':
                widthCroquis = 950;
                heightCroquis = 607;
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
        const croquis = await this.croquisService.getMapInScale(manzana[0].geometry, {
            width: widthCroquis,
            height: heightCroquis,
            typeScala: printData.scala,
            buffer: 0,
            scale: +printData.personalScala,
        }, {
            filter: `1=1;clave='${manzana[0].clave}'`,
            layer: `gcm:Certificado,gcm:Manzana`,
            style: `,gcm:ManzanaResaltar`,
        });
        const croquisScale = this.croquisService.Scale;
        const currentDate = new Date(Date.now());
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
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
            SIMBOLOGIA: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'simbologia-manzana.png'),
            DIRECTOR_CATASTRO: '',
            ESCALA: croquisScale,
            TIPO_HOJA: printData.sizePage,
        };
        let reportPlanoCertificado = {};
        if (printData.sizePage === 'carta' || printData.sizePage === 'oficio') {
            reportPlanoCertificado = plano_certificado_manzana_small_1.generatePlanoCertificateManzanaSmallDocumentDefinition(data);
        }
        else if (printData.sizePage === 'tabloide') {
            reportPlanoCertificado = plano_certificado_manzana_tabloid_1.generatePlanoCertificateManzanaTabloidDocumentDefinition(data);
        }
        else {
            reportPlanoCertificado = plano_certificado_manzana_big_1.generatePlanoCertificateManzanaBigDocumentDefinition(data);
        }
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportPlanoCertificado);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/planos/plano-certificado-manzana-${printData.clave}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    idManzana,
                    uri: `/reportes/planos/plano-certificado-manzana-${printData.clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PredioController][getReportPlanoCertificado]', e.message, e);
            return null;
        }
    }
};
ManzanaController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [manzana_service_1.ManzanaService, croquis_1.CroquisService])
], ManzanaController);
exports.ManzanaController = ManzanaController;
//# sourceMappingURL=manzana.controller.js.map