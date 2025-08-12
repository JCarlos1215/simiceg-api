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
exports.SectorService = void 0;
const tsyringe_1 = require("tsyringe");
const sector_pg_repository_1 = require("../repositories/sector.pg.repository");
let SectorService = class SectorService {
    constructor(sectorRepository) {
        this.sectorRepository = sectorRepository;
    }
    async getSectorByGeometry(geom) {
        return this.sectorRepository.getSectorByGeometry(geom);
    }
};
SectorService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'SectorRepository', useClass: sector_pg_repository_1.SectorPGRepository }]),
    __param(0, tsyringe_1.inject('SectorRepository')),
    __metadata("design:paramtypes", [Object])
], SectorService);
exports.SectorService = SectorService;
//# sourceMappingURL=sector.service.js.map