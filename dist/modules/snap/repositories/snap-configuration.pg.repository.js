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
exports.SnapConfigurationPGRepository = void 0;
const snap_layer_1 = require("../models/snap-layer");
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let SnapConfigurationPGRepository = class SnapConfigurationPGRepository {
    constructor(webcnn, geocnn) {
        this.webcnn = webcnn;
        this.geocnn = geocnn;
    }
    async getActiveSnapLayers() {
        const query = `SELECT idsnap, "layerName", schema, "table", "geometryField", srid, minscale, maxscale, bbox, active 
      FROM webapi.snap 
      WHERE active = true
    ;`;
        try {
            const configuration = await this.webcnn.any(query);
            return configuration.map((snapConfig) => this.createSnapLayerFromDBResponse(snapConfig));
        }
        catch (e) {
            logger_1.default.error(`[SNAP-CONFIG][PG REPOSITORY] ${e.message}`, e);
            throw new Error('Error al leer snap configuration');
        }
    }
    async getSnapLayer(id) {
        const query = `SELECT idsnap, "layerName", schema, "table", "geometryField", srid, minscale, maxscale, bbox, active 
      FROM webapi.snap 
      WHERE idsnap = $1 AND active = true
    ;`;
        try {
            const configuration = await this.webcnn.oneOrNone(query, [id]);
            if (configuration) {
                return this.createSnapLayerFromDBResponse(configuration);
            }
            else {
                throw new Error(`Capa con el id '${id}' no existe`);
            }
        }
        catch (e) {
            logger_1.default.error(`[SNAP-CONFIG][PG REPOSITORY] ${e.message}`, e);
            throw new Error('Error al leer snap configuration');
        }
    }
    async getAllSnapLayers() {
        const layers = [].map((l) => {
            const ll = new snap_layer_1.SnapLayer();
            ll.id = l.id;
            ll.layer = l.layer;
            ll.schema = l.schema;
            ll.table = l.table;
            ll.geometryField = l.geometryField;
            ll.srid = l.srid;
            ll.scales = l.scales;
            ll.bbox = l.bbox;
            ll.status = l.status;
            return ll;
        });
        return layers;
    }
    async getGeometries(schema, table, geomField, srid, bbox) {
        const query = `SELECT st_asgeojson(${geomField}) as geometry
    FROM "${schema}"."${table}"
    WHERE st_intersects(${geomField}, ST_GeomFromText('POLYGON((${bbox[0]} ${bbox[1]}, 
      ${bbox[0]} ${bbox[3]}, ${bbox[2]} ${bbox[3]}, ${bbox[2]} ${bbox[1]}, ${bbox[0]} ${bbox[1]}))', ${srid}))
    ;`;
        const geometries = await this.geocnn.any(query);
        return geometries.map((g) => JSON.parse(g.geometry));
    }
    createSnapLayerFromDBResponse(data) {
        const ll = new snap_layer_1.SnapLayer();
        ll.id = data.idsnap;
        ll.layer = data.layerName;
        ll.schema = data.schema;
        ll.table = data.table;
        ll.geometryField = data.geometryField;
        ll.srid = data.srid;
        ll.scales = [data.minscale, data.maxscale];
        ll.bbox = data.bbox;
        ll.status = data.active ? 'ACTIVE' : 'INACTIVE';
        return ll;
    }
};
SnapConfigurationPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('webdbapp')),
    __param(1, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object, Object])
], SnapConfigurationPGRepository);
exports.SnapConfigurationPGRepository = SnapConfigurationPGRepository;
//# sourceMappingURL=snap-configuration.pg.repository.js.map