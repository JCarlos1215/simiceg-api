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
exports.ColoniaController = void 0;
const tsyringe_1 = require("tsyringe");
const colonia_service_1 = require("../services/colonia.service");
let ColoniaController = class ColoniaController {
    constructor(coloniaService) {
        this.coloniaService = coloniaService;
    }
    async getColoniaByPoint(x, y) {
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
        return this.coloniaService.getColoniaByGeometry(pointGeometry);
    }
    async getColoniaByGeometry(geom) {
        return this.coloniaService.getColoniaByGeometry(geom);
    }
};
ColoniaController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [colonia_service_1.ColoniaService])
], ColoniaController);
exports.ColoniaController = ColoniaController;
//# sourceMappingURL=colonia.controller.js.map