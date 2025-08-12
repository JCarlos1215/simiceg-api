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
exports.ManzanaPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let ManzanaPGRepository = class ManzanaPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async getManzanaByGeometry(geom, isDownload) {
        let query = `SELECT idmanzana, zona, clave, `;
        query += isDownload ? `ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom ` : `ST_AsGeoJSON(geom) as geom `;
        query += `FROM gcm."Manzana"
      WHERE `;
        query += isDownload
            ? `ST_Intersects(ST_Transform(geom, 4326), ST_Centroid(ST_GeomFromGeoJSON($1)));`
            : `ST_Intersects(geom, ST_Centroid(ST_GeomFromGeoJSON($1)));`;
        try {
            const rows = await this.cnn.any(query, [geom]);
            return rows.map((m) => this.createManzanaFromDbResponse(m));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][ManzanaPGRepository][getManzanaByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getManzanaByField(id, field) {
        let query = `SELECT idmanzana, zona, clave, ST_AsGeoJSON(geom) as geom `;
        query += `FROM gcm."Manzana"	
      WHERE ${field} = $1
    ;`;
        try {
            const rows = await this.cnn.any(query, [id]);
            return rows.map((m) => this.createManzanaFromDbResponse(m));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][ManzanaPGRepository][getManzanaByField] Error: %s`, err.message);
            throw err;
        }
    }
    async getPlanoCertificadoData(clave) {
        const query = `SELECT id, idpredio, clave, clavecat, estado, region, municipio, zona, localidad, sector, manzana, predio, edificio, 
      unidad, curt, est, pv, rumbo, distancia, v, xutm, yutm, ST_AsGeoJSON(geom) as geom 
      FROM valuacion."vwPlanoCertificado" 
      WHERE clavecat LIKE $1
      LIMIT 1
    ;`;
        try {
            const planoRow = await this.cnn.oneOrNone(query, [
                `${clave}%`,
            ]);
            return this.createPlanoCertificadoFromDbResponse(planoRow);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][ManzanaPGRepository][getPlanoCertificadoData] Error: %s`, err.message);
            throw err;
        }
    }
    createManzanaFromDbResponse(manzana) {
        return {
            idManzana: manzana.idmanzana,
            manzana: manzana.zona,
            clave: manzana.clave,
            geometry: JSON.parse(manzana.geom),
        };
    }
    createPlanoCertificadoFromDbResponse(plano) {
        return {
            id: plano.id,
            idPredio: plano.idpredio,
            clave: plano.clave,
            formattedClave: plano.clavecat,
            estado: plano.estado,
            region: plano.region,
            municipio: plano.municipio,
            zona: plano.zona,
            localidad: plano.localidad,
            sector: plano.sector,
            manzana: plano.manzana,
            predio: plano.predio,
            edificio: plano.edificio,
            unidad: plano.unidad,
            CURT: plano.curt,
            est: plano.est,
            pv: plano.pv,
            rumbo: plano.rumbo,
            distancia: plano.distancia,
            v: plano.v,
            xUTM: +plano.xutm,
            yUTM: +plano.yutm,
            geometry: JSON.parse(plano.geom),
        };
    }
};
ManzanaPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], ManzanaPGRepository);
exports.ManzanaPGRepository = ManzanaPGRepository;
//# sourceMappingURL=manzana.pg.repository.js.map