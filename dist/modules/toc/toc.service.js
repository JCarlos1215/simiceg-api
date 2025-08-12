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
exports.TocService = void 0;
const tsyringe_1 = require("tsyringe");
const toc_pg_repository_1 = require("./repositories/toc.pg.repository");
let TocService = class TocService {
    constructor(tocRepository) {
        this.tocRepository = tocRepository;
    }
    async getToc(idRol, multilevel) {
        return this.tocRepository.getToc(idRol, multilevel);
    }
    async updateLayerToc(refresh) {
        return this.tocRepository.updateLayerToc(refresh);
    }
    async getAllLayers() {
        return this.tocRepository.getAllLayers();
    }
    async getLayersByRol(idRol) {
        return this.tocRepository.getLayersByRol(idRol);
    }
    async deleteLayersPermissions(idRol) {
        return this.tocRepository.deleteLayersPermissions(idRol);
    }
    async addLayerPermission(idRol, idLayer) {
        return this.tocRepository.addLayerPermission(idRol, idLayer);
    }
};
TocService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'TocRepository', useClass: toc_pg_repository_1.TocPGRepository }]),
    __param(0, tsyringe_1.inject('TocRepository')),
    __metadata("design:paramtypes", [Object])
], TocService);
exports.TocService = TocService;
//# sourceMappingURL=toc.service.js.map