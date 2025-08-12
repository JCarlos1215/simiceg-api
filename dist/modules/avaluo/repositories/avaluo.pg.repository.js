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
exports.AvaluoPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let AvaluoPGRepository = class AvaluoPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async executeIndividualAvaluo(idPredio, user) {
        const query = `CALL valuacion.avaluoindividual(
      $1, $2
    );`;
        try {
            await this.cnn.none(query, [idPredio, user]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][executeIndividualAvaluo] Error: %s`, err.message);
            throw err;
        }
    }
    async executeMultipleAvaluo(id, layer, user) {
        const query = `CALL valuacion.avaluomultiple_geo(
      $1, $2, $3
    );`;
        try {
            await this.cnn.none(query, [id, layer, user]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][executeMultipleAvaluo] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoFrenteById(idPredio) {
        const query = `SELECT idprediofrente, idpredio, idredvial, calle, medida, clavecalle, clavemunicipio, lotetipo, valorcalle, valorzona, n, adyacencia, idnext, orden, year, ST_AsGeoJSON(geom) as geom
      FROM valuacion."PredioFrenteSimplificado_i"
      WHERE idpredio = $1
    ;`;
        try {
            const predioFrenteRows = await this.cnn.any(query, [
                idPredio,
            ]);
            return predioFrenteRows.map((f) => this.createPredioFrenteFromDbResponse(f));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoFrenteById] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoClave(clave) {
        const query = `SELECT cuenta, clave, curt, forma, estado, region, municipio, zona, localidad, sector, 
      manzana, predio, edificio, unidad, area_carto, perimetro
      FROM sicam."vwClavesPredio"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [clave]);
            return this.createAvaluoClaveFromDbResponse(response);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoClave] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoUbication(clave) {
        const query = `SELECT cuenta, clave, ubicacion, num_exterior, num_interior, colonia, area_titulo
      FROM sicam."vwUbicacionPredio"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [
                clave,
            ]);
            return this.createAvaluoUbicationFromDbResponse(response);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoUbication] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoConstruction(clave) {
        const query = `SELECT idpredio, clave, cuenta, bloque, niveles, ce, volado, vu, valorinc, sc, valor, ST_AsGeoJson(geom) AS geom
      FROM sicam."vwAvaluoConstruccion_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [
                clave,
            ]);
            return response.map((ac, next) => this.createAvaluoConstructionFromDbResponse(ac, next));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoConstruction] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoTerrainNormal(clave) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerreno_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoTerrainNormal] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoTerrainIntern(clave) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerrenoInterno_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoTerrainIntern] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoTerrainMiddleNFront(clave) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerrenoIntermedionf_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoTerrainMiddleNFront] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoTerrainCorner(clave) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerrenoEsquina_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoTerrainCorner] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoCorner(clave) {
        const query = `SELECT idpredio, clave, callea, valorcallea, medidafrentea, calleb, valorcalleb, medidafrenteb, valorpromedio, factorzona, supesquina, valoresquina, uso
      FROM sicam."vwAvaluoEsquina_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((ac, next) => this.createAvaluoCornerFromDbResponse(ac, next));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoCorner] Error: %s`, err.message);
            throw err;
        }
    }
    async hasAvaluo(clave) {
        const query = `SELECT clave
      FROM valuacion."PredioAvaluo_i"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [clave]);
            return response ? true : false;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][hasAvaluo] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioClasification(idPredio) {
        const query = `SELECT clasificacion 
      FROM valuacion."PredioClasificacion" 
      WHERE idpredio = $1
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [
                idPredio,
            ]);
            return response.clasificacion;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getPredioClasification] Error: %s`, err.message);
            throw err;
        }
    }
    async deleteMultipleAvaluo() {
        //const queryDeleteFrente = `DELETE FROM valuacion."PredioFrente_m";`;
        // const queryDeleteFrenteSimplificado = `DELETE FROM valuacion."PredioFrenteSimplificado_m";`;
        const queryDeleteContraFrente = `DELETE FROM valuacion."PredioContraFrente_m";`;
        const queryDeleteProfundidad = `DELETE FROM valuacion."PredioProfundidad_m"`;
        const queryDeleteLindero = `DELETE FROM valuacion."PredioLindero_m";`;
        const queryDeleteDemerito = `DELETE FROM valuacion."PredioDemerito_m";`;
        const queryDeleteEsquina = `DELETE FROM valuacion."PredioEsquina_m";`;
        const queryDeleteEsquinaFrentes = `DELETE FROM valuacion."PredioEsquinaFrentes_m";`;
        const queryDeleteAvaluo = `DELETE FROM valuacion."PredioAvaluo_m";`;
        const queryDeleteAvaluoBloque = `DELETE FROM valuacion."PredioAvaluoBloque_m";`;
        const queryDeleteAvaluoEsquina = `DELETE FROM valuacion."PredioAvaluoEsquina_m";`;
        try {
            // await this.cnn.any(queryDeleteFrente);
            // await this.cnn.any(queryDeleteFrenteSimplificado);
            await this.cnn.any(queryDeleteContraFrente);
            await this.cnn.any(queryDeleteProfundidad);
            await this.cnn.any(queryDeleteLindero);
            await this.cnn.any(queryDeleteDemerito);
            await this.cnn.any(queryDeleteEsquina);
            await this.cnn.any(queryDeleteEsquinaFrentes);
            await this.cnn.any(queryDeleteAvaluo);
            await this.cnn.any(queryDeleteAvaluoBloque);
            await this.cnn.any(queryDeleteAvaluoEsquina);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][deleteMultipleAvaluo] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoPadronConstruction(clave) {
        const query = `SELECT bloque, niveles, clasificacion AS ce, vu, factor_con AS valorinc, super AS sc, valor
      FROM catastro.sic_getconstruccion_padron($1)
      ORDER BY bloque
    ;`;
        try {
            const response = await this.cnn.any(query, [
                clave,
            ]);
            return response.map((ac, next) => {
                ac.clave = clave;
                return this.createAvaluoConstructionFromDbResponse(ac, next);
            });
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoConstruction] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoPadronTerrain(idPredio) {
        const query = `SELECT clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM catastro.sic_getterreno_padron($1)
    ;`;
        try {
            const response = await this.cnn.any(query, [
                idPredio,
            ]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoTerrainNormal] Error: %s`, err.message);
            throw err;
        }
    }
    async getAvaluoPadronCorner(idPredio) {
        console.log(idPredio);
        const query = `SELECT clave, callea, valorcallea, medidafrentea, calleb, valorcalleb, medidafrenteb, valorpromedio, factorzona, supesquina, valoresquina, uso
      FROM catastro.sic_getesquina_padron($1)
    ;`;
        try {
            const response = await this.cnn.any(query, [idPredio]);
            return response.map((ac, next) => this.createAvaluoCornerFromDbResponse(ac, next));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getAvaluoCorner] Error: %s`, err.message);
            throw err;
        }
    }
    async getReferredAvaluoConstruction(clave, year) {
        const query = `SELECT idpredio, clave, cuenta, bloque, niveles, ce, volado, vu, valorinc, sc, valor
      FROM sicam."vwAvaluoConstruccion_r${year}"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [
                clave,
            ]);
            return response.map((ac, next) => this.createAvaluoConstructionFromDbResponse(ac, next));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoConstruction] Error: %s`, err.message);
            throw err;
        }
    }
    async getReferredAvaluoTerrainNormal(clave, year) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerreno_r${year}"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoTerrainNormal] Error: %s`, err.message);
            throw err;
        }
    }
    async getReferredAvaluoTerrainIntern(clave, year) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerrenoInterno_r${year}"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoTerrainIntern] Error: %s`, err.message);
            throw err;
        }
    }
    async getReferredAvaluoTerrainMiddleNFront(clave, year) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerrenoIntermedionf_r${year}"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoTerrainMiddleNFront] Error: %s`, err.message);
            throw err;
        }
    }
    async getReferredAvaluoTerrainCorner(clave, year) {
        const query = `SELECT idpredio, clave, valorcalle, valorzona, frente, profundidad, dfrente, dprofundidad, dsuperficie, factor, vreducido, vfraccion, areafraccion
      FROM sicam."vwAvaluoTerrenoEsquina_r${year}"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((t) => this.createAvaluoTerrainFromDbResponse(t));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoTerrainCorner] Error: %s`, err.message);
            throw err;
        }
    }
    async getReferredAvaluoCorner(clave, year) {
        const query = `SELECT idpredio, clave, callea, valorcallea, medidafrentea, calleb, valorcalleb, medidafrenteb, valorpromedio, factorzona, supesquina, valoresquina, uso
      FROM sicam."vwAvaluoEsquina_r${year}"
      WHERE clave = $1
    ;`;
        try {
            const response = await this.cnn.any(query, [clave]);
            return response.map((ac, next) => this.createAvaluoCornerFromDbResponse(ac, next));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][getReferredAvaluoCorner] Error: %s`, err.message);
            throw err;
        }
    }
    async hasReferredAvaluo(idPredio, year) {
        const query = `SELECT idpredio
      FROM valuacion."PredioAvaluo_r"
      WHERE idpredio = $1 AND year = $2
    ;`;
        try {
            const response = await this.cnn.oneOrNone(query, [idPredio, year]);
            return response ? true : false;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][hasReferredAvaluo] Error: %s`, err.message);
            throw err;
        }
    }
    async executeReferredAvaluo(idPredio, user, year) {
        const query = `CALL valuacion.avaluoreferido(
      $1, $2, $3
    );`;
        try {
            await this.cnn.none(query, [idPredio, user, year]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Avaluo][AvaluoPGRepository][executeReferredAvaluo] Error: %s`, err.message);
            throw err;
        }
    }
    createPredioFrenteFromDbResponse(frente) {
        return {
            idPredioFrente: frente.idprediofrente,
            idPredio: frente.idpredio,
            idRedVial: frente.idredvial,
            calle: frente.calle,
            medida: frente.medida,
            claveCalle: frente.clavecalle,
            claveMunicipio: frente.clavemunicipio,
            loteTipo: frente.lotetipo,
            valorCalle: frente.valorcalle,
            valorZona: frente.valorzona,
            numero: frente.n,
            adyacencia: frente.adyacencia,
            idNext: frente.idnext,
            orden: frente.orden,
            year: frente.year,
            geometry: JSON.parse(frente.geom),
        };
    }
    createAvaluoClaveFromDbResponse(clave) {
        return {
            cuenta: clave.cuenta,
            clave: clave.clave,
            CURT: clave.curt,
            forma: clave.forma,
            estado: clave.estado,
            region: clave.region,
            municipio: clave.municipio,
            zona: clave.zona,
            localidad: clave.localidad,
            sector: clave.sector,
            manzana: clave.manzana,
            predio: clave.predio,
            edificio: clave.edificio,
            unidad: clave.unidad,
            areaCartografica: +clave.area_carto,
            perimetro: +clave.perimetro,
        };
    }
    createAvaluoUbicationFromDbResponse(ubication) {
        return {
            cuenta: ubication.cuenta,
            clave: ubication.clave,
            ubicacion: ubication.ubicacion,
            numeroExterior: ubication.num_exterior,
            numeroInterior: ubication.num_interior,
            colonia: ubication.colonia,
            areaTitulo: +ubication.area_titulo,
        };
    }
    createAvaluoConstructionFromDbResponse(avaluo, next) {
        return {
            idPredio: avaluo.idpredio ? avaluo.idpredio : '',
            clave: avaluo.clave ? avaluo.clave : '',
            cuenta: avaluo.cuenta ? avaluo.cuenta : '',
            bloque: avaluo.bloque,
            nivel: +avaluo.niveles,
            ce: avaluo.ce,
            volado: avaluo.volado ? 'Si' : 'No',
            valorUnitario: +avaluo.vu,
            valorUnitarioIncrementado: +avaluo.valorinc,
            sc: +avaluo.sc,
            valor: +avaluo.valor,
            numero: next + 1,
            geometry: avaluo.geom ? JSON.parse(avaluo.geom) : null,
        };
    }
    createAvaluoTerrainFromDbResponse(avaluo) {
        return {
            idPredio: avaluo.idpredio,
            clave: avaluo.clave,
            valorCalle: +avaluo.valorcalle,
            valorZona: +avaluo.valorzona,
            frente: +avaluo.frente,
            profundidad: +avaluo.profundidad,
            demeritoFrente: +avaluo.dfrente,
            demeritoProfundidad: +avaluo.dprofundidad,
            demeritoSuperficie: +avaluo.dsuperficie,
            factor: +avaluo.factor,
            valorReducido: +avaluo.vreducido,
            valor: +avaluo.vfraccion,
            superficie: +avaluo.areafraccion,
        };
    }
    createAvaluoCornerFromDbResponse(corner, next) {
        return {
            idPredio: corner.idpredio ? corner.idpredio : '',
            clave: corner.clave,
            nombreCalleA: corner.callea,
            valorCalleA: +corner.valorcallea,
            medidaFrenteA: +corner.medidafrentea,
            nombreCalleB: corner.calleb,
            valorCalleB: +corner.valorcalleb,
            medidaFrenteB: +corner.medidafrenteb,
            valorPromedio: +corner.valorpromedio,
            factorZona: +corner.factorzona,
            superficieEsquina: +corner.supesquina,
            valorEsquina: +corner.valoresquina,
            uso: corner.uso,
            numero: next + 1,
        };
    }
};
AvaluoPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], AvaluoPGRepository);
exports.AvaluoPGRepository = AvaluoPGRepository;
//# sourceMappingURL=avaluo.pg.repository.js.map