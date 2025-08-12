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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapController = void 0;
const promise = __importStar(require("bluebird"));
const tsyringe_1 = require("tsyringe");
const snap_service_1 = require("./snap.service");
let SnapController = class SnapController {
    constructor(snapService) {
        this.snapService = snapService;
    }
    async getAvailableLayers() {
        const layers = await this.snapService.getActiveSnapLayers();
        return layers.map((layer) => ({
            id: layer.id,
            layer: layer.layer,
            bbox: layer.bbox,
            scales: layer.scales,
            srid: layer.srid,
        }));
    }
    async getAllSnapGeometries(bbox, scale) {
        const snapLayers = await this.getSnapLayers(bbox, scale);
        const data = await promise.getNewLibraryCopy().map(snapLayers, async (snapLayer) => {
            const geometries = await this.snapService.getGeometries(snapLayer.schema, snapLayer.table, snapLayer.geometryField, snapLayer.srid, bbox);
            return {
                layer: snapLayer.layer,
                geometries,
            };
        });
        return data;
    }
    async getSnapGeometriesForLayer(idlayer, bbox, scale) {
        const snapLayer = await this.getSnapLayerById(idlayer);
        if (!snapLayer) {
            throw new Error('Capa no existe');
        }
        if (snapLayer.isScaleValid(scale) && snapLayer.isVisible(bbox)) {
            const geometries = await this.snapService.getGeometries(snapLayer.schema, snapLayer.table, snapLayer.geometryField, snapLayer.srid, bbox);
            return {
                layer: snapLayer.layer,
                geometries,
            };
        }
        return { layer: snapLayer.layer, geometries: [] };
    }
    async getSnapLayers(bbox, scale) {
        const layers = await this.snapService.getActiveSnapLayers();
        return layers.filter((l) => l.isScaleValid(scale) && l.isVisible(bbox));
    }
    async getSnapLayerById(id) {
        return this.snapService.getSnapLayerById(id);
    }
};
SnapController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [snap_service_1.SnapService])
], SnapController);
exports.SnapController = SnapController;
//# sourceMappingURL=snap.controller.js.map