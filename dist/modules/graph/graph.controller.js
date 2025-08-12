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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphController = void 0;
const tsyringe_1 = require("tsyringe");
const graph_service_1 = require("./graph.service");
let GraphController = class GraphController {
    constructor(graphService) {
        this.graphService = graphService;
    }
    async getStadisticByIdLayer(idlayer, options, type) {
        switch (type) {
            case 'pie':
                return this.graphService.getPieStadisticByIdLayer(idlayer, options);
            case 'bar':
                return this.graphService.getBarStadisticByIdLayer(idlayer, options);
            default:
                return this.graphService.getPieStadisticByIdLayer(idlayer, options);
        }
    }
};
GraphController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [graph_service_1.GraphService])
], GraphController);
exports.GraphController = GraphController;
//# sourceMappingURL=graph.controller.js.map