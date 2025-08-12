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
exports.PaymentController = void 0;
const tsyringe_1 = require("tsyringe");
const payment_service_1 = require("./payment.service");
const paid_report_layout_1 = require("./reports/paid-report-layout");
const path = __importStar(require("path"));
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const environment_1 = __importDefault(require("@src/utils/environment"));
const formatted_date_1 = require("@src/utils/formatted-date");
const formatted_number_1 = require("@src/utils/formatted-number");
const logger_1 = __importDefault(require("@src/utils/logger"));
const debt_report_layout_1 = require("./reports/debt-report-layout");
const fonts = {
    Roboto: {
        normal: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Regular.ttf`,
        bold: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Bold.ttf`,
        italics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-Italic.ttf`,
        bolditalics: `${environment_1.default.BASE_PATH}/dist/resources/fonts/Lato-SemiboldItalic.ttf`,
    },
};
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async getDebtByPoint(x, y) {
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
        return this.paymentService.getDebtByGeomColonia(pointGeometry);
    }
    async getPaidByPoint(x, y) {
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
        return this.paymentService.getPaidByGeomColonia(pointGeometry);
    }
    async getDebtByColonia(colonia) {
        return this.paymentService.getDebtByColonia(colonia);
    }
    async getPaidByColonia(colonia) {
        return this.paymentService.getPaidByColonia(colonia);
    }
    async getDebtByManzana(manzana) {
        const debt = await this.paymentService.getDebtByManzana(manzana.clave);
        debt.map((d) => {
            d.manzana = manzana.clave;
            d.colonyGeometry = manzana.geometry;
        });
        return debt;
    }
    async getPaidByManzana(manzana) {
        const paid = await this.paymentService.getPaidByManzana(manzana.clave);
        paid.map((p) => {
            p.manzana = manzana.clave;
            p.colonyGeometry = manzana.geometry;
        });
        return paid;
    }
    async getPaidReportXCol(colonia) {
        const paidData = await this.getPaidByColonia(colonia);
        let total = 0;
        paidData.map((p) => {
            total += p.totalPago;
        });
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            TIPO_SELECCION: 'Colonia',
            SELECCION: paidData[0].colonia,
            PREDIO_PAID: paidData,
            TOTAL: formatted_number_1.getFormattedNumber(total),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
        };
        const reportPaid = paid_report_layout_1.generatePaidReportDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportPaid);
                const folio = colonia;
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/pagos/pagado-${folio}.pdf`)));
                pdfDoc.on('end', () => resolve({ folio, uri: `/reportes/pagos/pagado-${folio}.pdf` }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PaymentController][getPaidReportXCol]', e.message, e);
            return null;
        }
    }
    async getDebtReportxCol(colonia) {
        const debtData = await this.getDebtByColonia(colonia);
        let total = 0;
        debtData.map((p) => {
            total += p.saldo;
        });
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            TIPO_SELECCION: 'Colonia',
            SELECCION: debtData[0].colonia,
            PREDIO_DEBT: debtData,
            TOTAL: formatted_number_1.getFormattedNumber(total),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
        };
        const reportDebt = debt_report_layout_1.generateDebtReportDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportDebt);
                const folio = colonia;
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/pagos/adeudo-${folio}.pdf`)));
                pdfDoc.on('end', () => resolve({ folio, uri: `/reportes/pagos/adeudo-${folio}.pdf` }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PaymentController][getDebtReportxCol]', e.message, e);
            return null;
        }
    }
    async getPaidReportXMnz(manzana) {
        const paidData = await this.paymentService.getPaidByManzana(manzana);
        let total = 0;
        paidData.map((p) => {
            total += p.totalPago;
        });
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            TIPO_SELECCION: 'Manzana',
            SELECCION: manzana,
            PREDIO_PAID: paidData,
            TOTAL: formatted_number_1.getFormattedNumber(total),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
        };
        const reportPaid = paid_report_layout_1.generatePaidReportDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportPaid);
                const folio = manzana;
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/pagos/pagado-${folio}.pdf`)));
                pdfDoc.on('end', () => resolve({ folio, uri: `/reportes/pagos/pagado-${folio}.pdf` }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PaymentController][getPaidReportXMnz]', e.message, e);
            return null;
        }
    }
    async getDebtReportxMnz(manzana) {
        const debtData = await this.paymentService.getDebtByManzana(manzana);
        let total = 0;
        debtData.map((p) => {
            total += p.saldo;
        });
        const data = {
            MANZANILLO_LOGO: path.join(environment_1.default.BASE_PATH, 'src', 'resources', 'img', 'logo.png'),
            // TESORERIA_LOGO: path.join(environment.BASE_PATH, 'src', 'resources', 'img', 'tesoreria.png'),
            TIPO_SELECCION: 'Manzana',
            SELECCION: manzana,
            PREDIO_DEBT: debtData,
            TOTAL: formatted_number_1.getFormattedNumber(total),
            FECHA_EMISION: formatted_date_1.getFormattedDate(new Date(Date.now())),
        };
        const reportDebt = debt_report_layout_1.generateDebtReportDocumentDefinition(data);
        const printer = new PdfPrinter(fonts);
        try {
            return await new Promise((resolve) => {
                const pdfDoc = printer.createPdfKitDocument(reportDebt);
                const folio = manzana;
                pdfDoc.pipe(fs.createWriteStream(path.join(`${environment_1.default.BASE_PATH}/dist/public/reportes/pagos/adeudo-${folio}.pdf`)));
                pdfDoc.on('end', () => resolve({ folio, uri: `/reportes/pagos/adeudo-${folio}.pdf` }));
                pdfDoc.end();
            });
        }
        catch (e) {
            logger_1.default.error('[PaymentController][getDebtReportxMnz]', e.message, e);
            return null;
        }
    }
};
PaymentController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map