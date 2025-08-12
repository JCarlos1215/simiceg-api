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
exports.PaymentPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let PaymentPGRepository = class PaymentPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async getDebtByGeomColonia(geom) {
        const query = `SELECT idpredio, colonia, tipo_predio, cuenta, clave_catastral, clavecat,
      ubicacion, TRIM(num_exterior, '0') as num_exterior, total_pago, ST_AsGeoJSON(pgeom) AS pgeom, ST_AsGeoJSON(cgeom) AS cgeom
      FROM sicam."vmAdeudoxColonia"
      WHERE ST_Intersects(cgeom, ST_GeomFromGeoJSON($1))
      ORDER BY clave_catastral, ubicacion, num_exterior
    ;`;
        try {
            const rows = await this.cnn.any(query, [geom]);
            return rows.map((p) => this.createPredioDebtFromColonyDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Payment][PaymentPGRepository][getDebtsByGeomColonia] Error: %s`, err.message);
            throw err;
        }
    }
    async getPaidByGeomColonia(geom) {
        const query = `SELECT idpredio, colonia, tipo_predio, cuenta, clave_catastral, clavecat,
      ubicacion, TRIM(num_exterior, '0') as num_exterior, folio, total_pago, fecha, hora, ST_AsGeoJSON(pgeom) AS pgeom, ST_AsGeoJSON(clgeom) AS cgeom
      FROM sicam."vmPagosxColonia"
      WHERE ST_Intersects(clgeom, ST_GeomFromGeoJSON($1))
      ORDER BY clave_catastral, ubicacion, num_exterior
    ;`;
        try {
            const rows = await this.cnn.any(query, [geom]);
            return rows.map((p) => this.createPredioPaidFromColonyDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Payment][PaymentPGRepository][getPaidByGeomColonia] Error: %s`, err.message);
            throw err;
        }
    }
    async getDebtByColonia(colonia) {
        const query = `SELECT idpredio, colonia, tipo_predio, cuenta, clave_catastral, clavecat, 
      ubicacion, TRIM(num_exterior, '0') as num_exterior, total_pago, ST_AsGeoJSON(pgeom) AS pgeom, ST_AsGeoJSON(cgeom) AS cgeom
      FROM sicam."vmAdeudoxColonia"
      WHERE colonia = $1
      ORDER BY clave_catastral, ubicacion, num_exterior
    ;`;
        try {
            const rows = await this.cnn.any(query, [colonia]);
            return rows.map((p) => this.createPredioDebtFromColonyDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Payment][PaymentPGRepository][getDebtsByGeomColonia] Error: %s`, err.message);
            throw err;
        }
    }
    async getPaidByColonia(colonia) {
        const query = `SELECT idpredio, colonia, tipo_predio, cuenta, clave_catastral, clavecat, 
      ubicacion, TRIM(num_exterior, '0') as num_exterior, folio, total_pago, fecha, hora, ST_AsGeoJSON(pgeom) AS pgeom, ST_AsGeoJSON(clgeom) AS cgeom
      FROM sicam."vmPagosxColonia"
      WHERE colonia = $1
      ORDER BY clave_catastral, ubicacion, num_exterior
    ;`;
        try {
            const rows = await this.cnn.any(query, [colonia]);
            return rows.map((p) => this.createPredioPaidFromColonyDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Payment][PaymentPGRepository][getPaidByGeomColonia] Error: %s`, err.message);
            throw err;
        }
    }
    async getDebtByManzana(manzana) {
        const query = `SELECT idpredio, colonia, tipo_predio, cuenta, clave_catastral, clavecat, 
      ubicacion, TRIM(num_exterior, '0') as num_exterior, total_pago, ST_AsGeoJSON(pgeom) AS pgeom, ST_AsGeoJSON(cgeom) AS cgeom
      FROM sicam."vmAdeudoxColonia"
      WHERE clavecat ILIKE $1
      ORDER BY clave_catastral, ubicacion, num_exterior
    ;`;
        try {
            const rows = await this.cnn.any(query, [`${manzana}%`]);
            return rows.map((p) => this.createPredioDebtFromColonyDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Payment][PaymentPGRepository][getDebtByManzana] Error: %s`, err.message);
            throw err;
        }
    }
    async getPaidByManzana(manzana) {
        const query = `SELECT idpredio, colonia, tipo_predio, cuenta, clave_catastral, clavecat, 
      ubicacion, TRIM(num_exterior, '0') as num_exterior, folio, total_pago, fecha, hora, ST_AsGeoJSON(pgeom) AS pgeom, ST_AsGeoJSON(clgeom) AS cgeom
      FROM sicam."vmPagosxColonia"
      WHERE clavecat ILIKE $1
      ORDER BY clave_catastral, ubicacion, num_exterior
    ;`;
        try {
            const rows = await this.cnn.any(query, [`${manzana}%`]);
            return rows.map((p) => this.createPredioPaidFromColonyDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Payment][PaymentPGRepository][getPaidByManzana] Error: %s`, err.message);
            throw err;
        }
    }
    createPredioDebtFromColonyDbResponse(predio) {
        return {
            idPredio: predio.idpredio,
            colonia: predio.colonia,
            manzana: '',
            predioType: predio.tipo_predio,
            cuenta: predio.cuenta,
            claveCatastral: predio.clave_catastral,
            formattedClave: predio.clavecat,
            ubicacion: predio.ubicacion,
            numberExterior: predio.num_exterior,
            saldo: +predio.total_pago,
            predioGeometry: JSON.parse(predio.pgeom),
            colonyGeometry: JSON.parse(predio.cgeom),
        };
    }
    createPredioPaidFromColonyDbResponse(predio) {
        return {
            idPredio: predio.idpredio,
            colonia: predio.colonia,
            manzana: '',
            predioType: predio.tipo_predio,
            cuenta: predio.cuenta,
            claveCatastral: predio.clave_catastral,
            formattedClave: predio.clavecat,
            ubicacion: predio.ubicacion,
            numberExterior: predio.num_exterior,
            folio: predio.folio,
            totalPago: +predio.total_pago,
            fecha: new Date(predio.fecha),
            hora: predio.hora,
            predioGeometry: JSON.parse(predio.pgeom),
            colonyGeometry: JSON.parse(predio.cgeom),
        };
    }
};
PaymentPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], PaymentPGRepository);
exports.PaymentPGRepository = PaymentPGRepository;
//# sourceMappingURL=payment.pg.repository.js.map