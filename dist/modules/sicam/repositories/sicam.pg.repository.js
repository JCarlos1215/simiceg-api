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
exports.SICAMPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let SICAMPGRepository = class SICAMPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async getPredioSICAM(claveManzana) {
        const query = `SELECT idpredio, clase, clave, tipo_predio, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, 
      n_exterior, n_interior, colonia, ST_AsGeoJson(geom) AS geom
      FROM catastro.sic_getinformacionmanzana($1)
      ORDER BY clave
    ;`;
        try {
            const response = await this.cnn.any(query, [
                claveManzana,
            ]);
            return response.map((p) => this.createPredioSICAMFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getPredioSICAM] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioSICAMById(claveManzana, idPredio) {
        const query = `SELECT idpredio, clase, clave, tipo_predio, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, 
      n_exterior, n_interior, colonia, ST_AsGeoJson(geom) AS geom
      FROM catastro.sic_getinformacionmanzana($1)
      WHERE idpredio = $2
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [
                claveManzana,
                idPredio,
            ]);
            return response ? this.createPredioSICAMFromDbResponse(response) : null;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getPredioSICAMById] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoSICAM(tipoPredio, cuenta, clave) {
        const query = `SELECT id_cuenta, clave, cuenta, sup_terreno, sup_construc, valor_terreno, valor_construc, valor_fiscal, indiviso,
      frente, profundidad, perimetro, distancia_esquina, izq_der, agua, alumbrado, banqueta, drenaje, electricidad, telefono, pavimento,
      aplicado, tipo_valuacion, area_titulo, capturista, fecha
      FROM catastro.sic_getavaluossicam($1, $2, $3)
    ;`;
        try {
            const response = await this.cnn.any(query, [
                tipoPredio,
                cuenta,
                clave,
            ]);
            return response.map((a) => this.createAvaluoSICAMFromDbResponse(a));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getAvaluoSICAM] Error: %s`, err.message);
            throw err;
        }
    }
    async getDebtSICAM(tipoPredio, cuenta, clave) {
        const query = `SELECT id_cuenta, recaudadora, clave, subpredio, id_tasa, imp_adeudado, rec_adeudado, multas, saldo
      FROM catastro.sic_getadeudossicam($1, $2, $3)
    ;`;
        try {
            const response = await this.cnn.any(query, [
                tipoPredio,
                cuenta,
                clave,
            ]);
            return response.map((d) => this.createDebtSICAMFromDbResponse(d));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getDebtSICAM] Error: %s`, err.message);
            throw err;
        }
    }
    async getPaidSICAM(tipoPredio, cuenta, clave) {
        const query = `SELECT id_cuenta, recaudadora, clave, subpredio, id_tasa, fecha, folio, imp_pagado
      FROM catastro.sic_getpagossicam($1, $2, $3)
    ;`;
        try {
            const response = await this.cnn.any(query, [
                tipoPredio,
                cuenta,
                clave,
            ]);
            return response.map((p) => this.createPaidSICAMFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getPaidSICAM] Error: %s`, err.message);
            throw err;
        }
    }
    async getHistorySICAM(tipoPredio, cuenta, clave) {
        const query = `SELECT id_cuenta, recaudadora, clave, subpredio, id_movimineto, descripcion, axo_comprobante, folio_comprobante
      FROM catastro.sic_gethistoriasicam($1, $2, $3)
    ;`;
        try {
            const response = await this.cnn.any(query, [
                tipoPredio,
                cuenta,
                clave,
            ]);
            return response.map((h) => this.createHistorySICAMFromDbResponse(h));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getHistorySICAM] Error: %s`, err.message);
            throw err;
        }
    }
    async getCertificateData(folio) {
        const query = `SELECT solicitante, capturista
      FROM catastro.sic_getdatoscertificado($1)
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [folio]);
            return this.createCertificateDataFromDbResponse(response);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: SICAM][SICAMPGRepository][getCertificateData] Error: %s`, err.message);
            throw err;
        }
    }
    async createAvaluoSICAM(idPredio, user, folio, observation, year) {
        const query = `SELECT valuacion.sic_generaavaluosicam($1, $2, $3, $4, $5) AS avaluo;`;
        try {
            const result = await this.cnn.oneOrNone(query, [
                idPredio,
                user,
                folio,
                observation,
                year,
            ]);
            return result.avaluo;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: SICAM][SICAMPGRepository][createAvaluoSICAM] Error: %s`, e.message);
            throw new Error('Error al enviar a SICAM');
        }
    }
    createPredioSICAMFromDbResponse(predio) {
        return {
            idPredio: predio.idpredio,
            clase: +predio.clase,
            clave: predio.clave,
            subpredio: '',
            tipoPredio: predio.tipo_predio,
            cuenta: +predio.cuenta,
            areaCartografica: +predio.area_carto,
            areaPadron: +predio.area_padron,
            porcentaje: +predio.porcentaje,
            propietario: predio.propietario,
            ubicacion: predio.ubicacion,
            numExterior: predio.n_exterior,
            numInterior: predio.n_interior,
            colonia: predio.colonia,
            geometry: JSON.parse(predio.geom),
        };
    }
    createAvaluoSICAMFromDbResponse(avaluo) {
        return {
            idCuenta: +avaluo.id_cuenta,
            clave: avaluo.clave,
            cuenta: +avaluo.cuenta,
            superficieTerreno: +avaluo.sup_terreno,
            superficieConstruccion: +avaluo.sup_construc,
            valorTerreno: +avaluo.valor_terreno,
            valorConstruccion: +avaluo.valor_construc,
            valorFiscal: +avaluo.valor_fiscal,
            indiviso: +avaluo.indiviso,
            frente: +avaluo.frente,
            profundidad: +avaluo.profundidad,
            perimetro: +avaluo.perimetro,
            distanciaEsquina: +avaluo.distancia_esquina,
            izquierdaDerecha: avaluo.izq_der,
            agua: avaluo.agua,
            alumbrado: avaluo.alumbrado,
            banqueta: avaluo.banqueta,
            drenaje: avaluo.drenaje,
            electricidad: avaluo.electricidad,
            telefono: avaluo.telefono,
            pavimento: avaluo.pavimento,
            aplicado: avaluo.aplicado,
            tipoValuacion: avaluo.tipo_valuacion,
            areaTitulo: +avaluo.area_titulo,
            capturista: avaluo.capturista,
            fecha: new Date(avaluo.fecha),
        };
    }
    createDebtSICAMFromDbResponse(debt) {
        return {
            idCuenta: +debt.id_cuenta,
            recaudadora: +debt.recaudadora,
            clave: debt.clave,
            subpredio: debt.subpredio,
            idTasa: +debt.id_tasa,
            importeAdeudado: +debt.imp_adeudado,
            recargoAdeudado: +debt.rec_adeudado,
            multas: +debt.multas,
            saldo: +debt.saldo,
        };
    }
    createPaidSICAMFromDbResponse(paid) {
        return {
            idCuenta: +paid.id_cuenta,
            recaudadora: +paid.recaudadora,
            clave: paid.clave,
            subpredio: paid.subpredio,
            idTasa: +paid.id_tasa,
            fecha: new Date(paid.fecha),
            folio: +paid.folio,
            importePagado: +paid.imp_pagado,
        };
    }
    createHistorySICAMFromDbResponse(history) {
        return {
            idCuenta: +history.id_cuenta,
            recaudadora: +history.recaudadora,
            clave: history.clave,
            subpredio: +history.subpredio,
            idMovimineto: +history.id_movimineto,
            descripcion: history.descripcion,
            yearComprobante: +history.axo_comprobante,
            folioComprobante: +history.folio_comprobante,
        };
    }
    createCertificateDataFromDbResponse(certificate) {
        let certificateData = {
            applicant: '',
            capture: '',
        };
        if (certificate) {
            certificateData = {
                applicant: certificate.solicitante,
                capture: certificate.capturista,
            };
        }
        return certificateData;
    }
};
SICAMPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], SICAMPGRepository);
exports.SICAMPGRepository = SICAMPGRepository;
//# sourceMappingURL=sicam.pg.repository.js.map