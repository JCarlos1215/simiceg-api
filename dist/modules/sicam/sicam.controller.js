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
exports.SICAMController = void 0;
const tsyringe_1 = require("tsyringe");
const sicam_error_1 = require("./errors/sicam.error");
const sicam_service_1 = require("./sicam.service");
const formatted_date_1 = require("@src/utils/formatted-date");
const path = __importStar(require("path"));
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const croquis_1 = require("@src/utils/croquis");
const environment_1 = __importDefault(require("@src/utils/environment"));
const logger_1 = __importDefault(require("@src/utils/logger"));
const ficha_tecnica_1 = require("./reports/ficha-tecnica");
const predio_service_1 = require("../catastro/services/predio.service");
const fonts = {
    Roboto: {
        normal: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Regular.ttf`,
        bold: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Bold.ttf`,
        italics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Italic.ttf`,
        bolditalics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-SemiboldItalic.ttf`,
    },
};
let SICAMController = class SICAMController {
    constructor(sicamService, croquisService, predioService) {
        this.sicamService = sicamService;
        this.croquisService = croquisService;
        this.predioService = predioService;
    }
    async getPredioSICAM(claveManzana) {
        return this.sicamService.getPredioSICAM(claveManzana);
    }
    async getSICAMData(tipoPredio, cuenta, clave) {
        try {
            const avaluo = await this.sicamService.getAvaluoSICAM(tipoPredio, cuenta, clave);
            const debt = await this.sicamService.getDebtSICAM(tipoPredio, cuenta, clave);
            const paid = await this.sicamService.getPaidSICAM(tipoPredio, cuenta, clave);
            const history = await this.sicamService.getHistorySICAM(tipoPredio, cuenta, clave);
            return {
                avaluoSICAM: avaluo,
                debtSICAM: debt,
                paidSICAM: paid,
                historySICAM: history,
            };
        }
        catch (error) {
            throw new sicam_error_1.SICAMError(error);
        }
    }
    async getCertificateData(folio) {
        return this.sicamService.getCertificateData(folio);
    }
    async createAvaluoSICAM(idPredio, user, folio, observation, year) {
        return this.sicamService.createAvaluoSICAM(idPredio, user, folio, observation, year);
    }
    async getFichaTecnica(idPredio) {
        const predio = await this.predioService.getPredioById(idPredio);
        const predioCartografia = predio[0];
        const predioSICAM = await this.sicamService.getPredioSICAMById(predioCartografia.formattedClave.substring(0, 12), predioCartografia.idPredio);
        const sicamData = await this.getSICAMData(predioSICAM.tipoPredio, predioSICAM.cuenta, predioSICAM.clave);
        const croquisPredio = await this.croquisService.getMapToCover(predioSICAM.geometry, 583, 433, {
            filter: `1=1;idpredio='${idPredio}';1=1`,
            layer: `gcm:MapaBaseFicha,gcm:Predio,gcm:PredioCota`,
            style: `,gcm:PredioResaltarFicha,PredioCotaFicha`,
        }, 5);
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            SEGUNDO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
            CROQUIS: croquisPredio,
            NORTE: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'norte.png'),
            PREDIO_SICAM: predioSICAM,
            PREDIO_CARTO: predioCartografia,
            SICAM_DATA: sicamData,
        };
        const reportAvaluoSimple = ficha_tecnica_1.generateFichaTecnicaDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportAvaluoSimple);
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/fichas/ficha-tecnica-${predioCartografia.clave}.pdf`)));
                pdfDoc.on('end', () => resolve({
                    idPredio,
                    uri: `/reportes/fichas/ficha-tecnica-${predioCartografia.clave}.pdf`,
                }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[SICAMController][getFichaTecnica]', e.message, e);
            return null;
        }
    }
};
SICAMController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [sicam_service_1.SICAMService,
        croquis_1.CroquisService,
        predio_service_1.PredioService])
], SICAMController);
exports.SICAMController = SICAMController;
//# sourceMappingURL=sicam.controller.js.map