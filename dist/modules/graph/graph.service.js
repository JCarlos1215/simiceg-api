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
exports.GraphService = void 0;
const tsyringe_1 = require("tsyringe");
const graph_pg_repository_1 = require("./repositories/graph.pg.repository");
let GraphService = class GraphService {
    constructor(graphRepository) {
        this.graphRepository = graphRepository;
    }
    async getPieStadisticByIdLayer(idlayer, options) {
        return this.graphRepository.getPieStadisticByIdLayer(idlayer, options);
    }
    async getBarStadisticByIdLayer(idlayer, options) {
        return this.graphRepository.getBarStadisticByIdLayer(idlayer, options);
    }
};
GraphService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'GraphRepository', useClass: graph_pg_repository_1.GraphPGRepository }]),
    __param(0, tsyringe_1.inject('GraphRepository')),
    __metadata("design:paramtypes", [Object])
], GraphService);
exports.GraphService = GraphService;
//# sourceMappingURL=graph.service.js.map