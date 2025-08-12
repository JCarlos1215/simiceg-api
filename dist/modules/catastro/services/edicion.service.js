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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdicionService = void 0;
const tsyringe_1 = require("tsyringe");
const edicion_pg_repository_1 = require("../repositories/edicion.pg.repository");
const bluebird_1 = __importDefault(require("bluebird"));
let EdicionService = class EdicionService {
    constructor(edicionRepository) {
        this.edicionRepository = edicionRepository;
    }
    async insertFusion(json, user, tramite) {
        return this.edicionRepository.insertFusion(json, user, tramite);
    }
    async generateFusion(idFusion) {
        return this.edicionRepository.generateFusion(idFusion);
    }
    async getFusion(idFusion) {
        return this.edicionRepository.getFusion(idFusion);
    }
    async applyFusion(idFusion, idPredominante) {
        return this.edicionRepository.applyFusion(idFusion, idPredominante);
    }
    async validateFusion(claves) {
        return this.edicionRepository.validateFusion(claves);
    }
    async validateDebtOwnerFusion(claves) {
        return this.edicionRepository.validateDebtOwnerFusion(claves);
    }
    async executeDivisionLinderos(idPredio, user) {
        return this.edicionRepository.executeDivisionLinderos(idPredio, user);
    }
    async getLinderos(idPredio) {
        return this.edicionRepository.getLinderos(idPredio);
    }
    async deleteLinderos(idPredio) {
        return this.edicionRepository.deleteLinderos(idPredio);
    }
    async divideLindero(lindero) {
        return this.edicionRepository.divideLindero(lindero);
    }
    async createParalela(lindero) {
        return this.edicionRepository.createParalela(lindero);
    }
    async cleanEditionPredio(idPredio) {
        return this.edicionRepository.cleanEditionPredio(idPredio);
    }
    async insertDivision(json, id, user, tramite) {
        return this.edicionRepository.insertDivision(json, id, user, tramite);
    }
    async generateDivision(idDivision) {
        return this.edicionRepository.generateDivision(idDivision);
    }
    async getDivision(idDivision) {
        return this.edicionRepository.getDivision(idDivision);
    }
    async applyDivision(idDivision) {
        return this.edicionRepository.applyDivision(idDivision);
    }
    async validateDivision(claves) {
        return this.edicionRepository.validateDivision(claves);
    }
    async getEditionLayers() {
        return this.edicionRepository.getEditionLayers();
    }
    async getEditionAttributeByIdLayer(idLayer) {
        const attributes = await this.edicionRepository.getEditionAttributeByIdLayer(idLayer);
        await bluebird_1.default.map(attributes, async (row) => {
            if (row.hasCatalogue) {
                const catalogue = await this.edicionRepository.getCatalogue(row.queryCatalogue);
                row.catalogue = catalogue;
            }
        }, { concurrency: 4 });
        return attributes;
    }
    async existClasificationConstruction(clave) {
        return this.edicionRepository.existClasificationConstruction(clave);
    }
    async updateAttributes(layer, attributes, id) {
        return this.edicionRepository.updateAttributes(layer, attributes, id);
    }
    async getEditionObjectByGeometry(layer, attributes, geom) {
        return this.edicionRepository.getEditionObjectByGeometry(layer, attributes, geom);
    }
    async deleteObjectById(layer, id) {
        return this.edicionRepository.deleteObjectById(layer, id);
    }
    async executeDeslindeCatastral(idPredio, user) {
        return this.edicionRepository.executeDeslindeCatastral(idPredio, user);
    }
    async getDeslindeCatastral(idPredio) {
        return this.edicionRepository.getDeslindeCatastral(idPredio);
    }
    async getParalelas(idPredio, user) {
        return this.edicionRepository.getParalelas(idPredio, user);
    }
    async alignLindero(idPredio, tolerance) {
        return this.edicionRepository.alignLindero(idPredio, tolerance);
    }
    async splitConstruction(idPredio) {
        return this.edicionRepository.splitConstruction(idPredio);
    }
    async addGeomKML(geom, kmlData, user, index) {
        return this.edicionRepository.addGeomKML(geom, kmlData, user, index);
    }
    async getKMLGeometries(idName) {
        return this.edicionRepository.getKMLGeometries(idName);
    }
    async getStreetViewTaking(streetViewTake, user) {
        return this.edicionRepository.getStreetViewTaking(streetViewTake, user);
    }
    async deleteStreetViewTaking(user) {
        return this.edicionRepository.deleteStreetViewTaking(user);
    }
};
EdicionService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'EdicionRepository', useClass: edicion_pg_repository_1.EdicionPGRepository }]),
    __param(0, tsyringe_1.inject('EdicionRepository')),
    __metadata("design:paramtypes", [Object])
], EdicionService);
exports.EdicionService = EdicionService;
//# sourceMappingURL=edicion.service.js.map