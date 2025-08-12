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
exports.AvaluoService = void 0;
const tsyringe_1 = require("tsyringe");
const avaluo_pg_repository_1 = require("./repositories/avaluo.pg.repository");
let AvaluoService = class AvaluoService {
    constructor(avaluoRepository) {
        this.avaluoRepository = avaluoRepository;
    }
    async executeIndividualAvaluo(idPredio, user) {
        return this.avaluoRepository.executeIndividualAvaluo(idPredio, user);
    }
    async executeReferredAvaluo(idPredio, user, year) {
        return this.avaluoRepository.executeReferredAvaluo(idPredio, user, year);
    }
    async executeMultipleAvaluo(id, layer, user) {
        return this.avaluoRepository.executeMultipleAvaluo(id, layer, user);
    }
    async hasAvaluo(clave) {
        return this.avaluoRepository.hasAvaluo(clave);
    }
    async hasReferredAvaluo(idPredio, year) {
        return this.avaluoRepository.hasReferredAvaluo(idPredio, year);
    }
    async getPredioClasification(idPredio) {
        return this.avaluoRepository.getPredioClasification(idPredio);
    }
    async deleteMultipleAvaluo() {
        return this.avaluoRepository.deleteMultipleAvaluo();
    }
    async getAvaluoFrenteById(idPredio) {
        return this.avaluoRepository.getAvaluoFrenteById(idPredio);
    }
    async getAvaluoClave(clave) {
        return this.avaluoRepository.getAvaluoClave(clave);
    }
    async getAvaluoUbication(clave) {
        return this.avaluoRepository.getAvaluoUbication(clave);
    }
    async getAvaluoConstruction(clave) {
        return this.avaluoRepository.getAvaluoConstruction(clave);
    }
    async getAvaluoTerrainNormal(clave) {
        return this.avaluoRepository.getAvaluoTerrainNormal(clave);
    }
    async getAvaluoTerrainIntern(clave) {
        return this.avaluoRepository.getAvaluoTerrainIntern(clave);
    }
    async getAvaluoTerrainMiddleNFront(clave) {
        return this.avaluoRepository.getAvaluoTerrainMiddleNFront(clave);
    }
    async getAvaluoTerrainCorner(clave) {
        return this.avaluoRepository.getAvaluoTerrainCorner(clave);
    }
    async getAvaluoCorner(clave) {
        return this.avaluoRepository.getAvaluoCorner(clave);
    }
    async getAvaluoPadronConstruction(clave) {
        return this.avaluoRepository.getAvaluoPadronConstruction(clave);
    }
    async getAvaluoPadronTerrain(idPredio) {
        return this.avaluoRepository.getAvaluoPadronTerrain(idPredio);
    }
    async getAvaluoPadronCorner(idPredio) {
        return this.avaluoRepository.getAvaluoPadronCorner(idPredio);
    }
    async getReferredAvaluoConstruction(idPredio, year) {
        return this.avaluoRepository.getReferredAvaluoConstruction(idPredio, year);
    }
    async getReferredAvaluoTerrainNormal(clave, year) {
        return this.avaluoRepository.getReferredAvaluoTerrainNormal(clave, year);
    }
    async getReferredAvaluoTerrainIntern(clave, year) {
        return this.avaluoRepository.getReferredAvaluoTerrainIntern(clave, year);
    }
    async getReferredAvaluoTerrainMiddleNFront(clave, year) {
        return this.avaluoRepository.getReferredAvaluoTerrainMiddleNFront(clave, year);
    }
    async getReferredAvaluoTerrainCorner(clave, year) {
        return this.avaluoRepository.getReferredAvaluoTerrainCorner(clave, year);
    }
    async getReferredAvaluoCorner(clave, year) {
        return this.avaluoRepository.getReferredAvaluoCorner(clave, year);
    }
};
AvaluoService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'AvaluoRepository', useClass: avaluo_pg_repository_1.AvaluoPGRepository }]),
    __param(0, tsyringe_1.inject('AvaluoRepository')),
    __metadata("design:paramtypes", [Object])
], AvaluoService);
exports.AvaluoService = AvaluoService;
//# sourceMappingURL=avaluo.service.js.map