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
exports.SnapService = void 0;
const tsyringe_1 = require("tsyringe");
const snap_configuration_pg_repository_1 = require("./repositories/snap-configuration.pg.repository");
let SnapService = class SnapService {
    constructor(snapConfigurationRepository) {
        this.snapConfigurationRepository = snapConfigurationRepository;
    }
    async getActiveSnapLayers() {
        return this.snapConfigurationRepository.getActiveSnapLayers();
    }
    async getSnapLayerById(id) {
        return this.snapConfigurationRepository.getSnapLayer(id);
    }
    async getAllSnapLayers() {
        return this.snapConfigurationRepository.getAllSnapLayers();
    }
    async getGeometries(schema, table, geomField, srid, bbox) {
        return this.snapConfigurationRepository.getGeometries(schema, table, geomField, srid, bbox);
    }
};
SnapService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'SnapConfigurationRepository', useClass: snap_configuration_pg_repository_1.SnapConfigurationPGRepository }]),
    __param(0, tsyringe_1.inject('SnapConfigurationRepository')),
    __metadata("design:paramtypes", [Object])
], SnapService);
exports.SnapService = SnapService;
//# sourceMappingURL=snap.service.js.map