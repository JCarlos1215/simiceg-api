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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const tsyringe_1 = require("tsyringe");
const payment_pg_repository_1 = require("./repositories/payment.pg.repository");
let PaymentService = class PaymentService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async getDebtByGeomColonia(geom) {
        return this.paymentRepository.getDebtByGeomColonia(geom);
    }
    async getPaidByGeomColonia(geom) {
        return this.paymentRepository.getPaidByGeomColonia(geom);
    }
    async getDebtByColonia(colonia) {
        return this.paymentRepository.getDebtByColonia(colonia);
    }
    async getPaidByColonia(colonia) {
        return this.paymentRepository.getPaidByColonia(colonia);
    }
    async getDebtByManzana(manzana) {
        return this.paymentRepository.getDebtByManzana(manzana);
    }
    async getPaidByManzana(manzana) {
        return this.paymentRepository.getPaidByManzana(manzana);
    }
};
PaymentService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'PaymentRepository', useClass: payment_pg_repository_1.PaymentPGRepository }]),
    __param(0, tsyringe_1.inject('PaymentRepository')),
    __metadata("design:paramtypes", [Object])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map