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
exports.ColoniaPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let ColoniaPGRepository = class ColoniaPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async getColoniaByGeometry(geom) {
        const query = `SELECT idcolonia, nombre, codigopostal, idtipoasentamiento, ST_AsGeoJson(geom) AS geom
      FROM geobase."Colonia"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
    ;`;
        try {
            const rows = await this.cnn.any(query, [geom]);
            return rows.map((m) => this.createColoniaFromDbResponse(m));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][ColoniaPGRepository][getColoniaByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    createColoniaFromDbResponse(colonia) {
        return {
            idColonia: colonia.idcolonia,
            nombre: colonia.nombre,
            idtipoasentamiento: colonia.idtipoasentamiento ? colonia.idtipoasentamiento : '',
            codigopostal: colonia.codigopostal,
            geometry: JSON.parse(colonia.geom),
        };
    }
};
ColoniaPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], ColoniaPGRepository);
exports.ColoniaPGRepository = ColoniaPGRepository;
//# sourceMappingURL=colonia.pg.repository.js.map