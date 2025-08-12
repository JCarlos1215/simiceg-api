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
exports.PredioPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let PredioPGRepository = class PredioPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async getPredioByGeometry(geom) {
        const query = `SELECT idpredio, clave, curt, caso, forma, sct, clavemanzana, noficial, supconst, descrip, observa, predio, clavecat, ST_AsGeoJson(geom) AS geom
      FROM gcm."Predio"
      WHERE clave ILIKE '07%' AND ST_Intersects(geom, ST_GeomFromGeoJSON($1))
    ;`;
        try {
            const predioRows = await this.cnn.any(query, [geom]);
            return predioRows.map((p) => this.createPredioFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioByField(id, field, isDownload) {
        let query = `SELECT idpredio, clave, curt, caso, forma, sct, clavemanzana, noficial, supconst, descrip, observa, predio, clavecat, `;
        query += isDownload ? `ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom ` : `ST_AsGeoJSON(geom) as geom `;
        query += `FROM gcm."Predio" 
      WHERE ${field} = $1
    ;`;
        try {
            const predioRows = await this.cnn.any(query, [id]);
            return predioRows.map((p) => this.createPredioFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioByField] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioFrenteById(idPredio) {
        const query = `SELECT idprediofrente, idpredio, idredvial, calle, medida, clavecalle, clavemunicipio, lotetipo, valorcalle, valorzona, n, adyacencia, idnext, orden, ST_AsGeoJSON(geom) as geom
      FROM valuacion."PredioFrenteSimplificado"
      WHERE idpredio = $1
    ;`;
        try {
            const predioFrenteRows = await this.cnn.any(query, [
                idPredio,
            ]);
            return predioFrenteRows.map((f) => this.createPredioFrenteFromDbResponse(f));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioFrenteById] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioFrenteReferredById(idPredio, year) {
        const query = `SELECT idprediofrente, idpredio, idredvial, calle, medida, clavecalle, clavemunicipio, lotetipo, 
      valorcalle, valorzona, n, adyacencia, idnext, orden, year, ST_AsGeoJSON(geom) as geom
      FROM valuacion."PredioFrenteSimplificado_r"
      WHERE idpredio = $1 AND year = $2
    ;`;
        try {
            const predioFrenteRows = await this.cnn.any(query, [
                idPredio,
                year,
            ]);
            return predioFrenteRows.map((f) => this.createPredioFrenteFromDbResponse(f));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioFrenteReferredById] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioConstruction(geom, isDownload) {
        let query = `SELECT idconstruccion, bloque, niveles, codigoedificacion, fechaconstruccion, tipo, dato_edif, clasificacion, 
    cuenta, status, clavemanzana, idpredio, sc, `;
        query += isDownload ? `ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom ` : `ST_AsGeoJSON(geom) as geom `;
        query += `FROM geobase."Construccion"
      WHERE `;
        query += isDownload
            ? `ST_Intersects(ST_GeomFromGeoJSON($1), ST_PointOnSurface(ST_Transform(geom, 4326)));`
            : `ST_Intersects(ST_GeomFromGeoJSON($1), ST_PointOnSurface(geom));`;
        try {
            const constructionRows = await this.cnn.any(query, [
                geom,
            ]);
            return constructionRows.map((c) => this.createConstructionFromDbResponse(c));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioConstruction] Error: %s`, err.message);
            throw err;
        }
    }
    async getHeadingByIdPredioFrente(idPredioFrente) {
        const query = `SELECT valuacion.sic_get_heading(geom) AS heading
      FROM valuacion."PredioFrenteSimplificado"
      WHERE idprediofrente = $1
    ;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredioFrente]);
            return result.heading;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][PredioPgRepository: getHeadingByIdPredioFrente][idPredioFrente: ${idPredioFrente}] Error: %s`, e.message);
            throw new Error('Error al consultar');
        }
    }
    async getHeadingReferredByIdPredioFrente(idPredioFrente) {
        const query = `SELECT valuacion.sic_get_heading(geom) AS heading
      FROM valuacion."PredioFrenteSimplificado_r"
      WHERE idprediofrente = $1
    ;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredioFrente]);
            return result.heading;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][PredioPgRepository: getHeadingReferredByIdPredioFrente][idPredioFrente: ${idPredioFrente}] Error: %s`, e.message);
            throw new Error('Error al consultar');
        }
    }
    async getPredioCotaByClave(clave, isDownload) {
        let query = `SELECT cota, angulo, est, pv, rumbo, x, y, azimut, clave, `;
        query += isDownload ? `ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom ` : `ST_AsGeoJSON(geom) as geom `;
        query += `FROM valuacion."PredioCota" 
      WHERE clave = $1
    ;`;
        try {
            const predioCotaRows = await this.cnn.any(query, [clave]);
            return predioCotaRows.map((pc) => this.createPredioCotaFromDbResponse(pc));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioCotaByClave] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioNumeroExteriorByGeometry(geom) {
        const query = `SELECT numero, idnumeroexterior, status, ST_AsGeoJSON(ST_Buffer(geom, 0.5)) as geom 
      FROM geobase."NumeroExterior"
      WHERE ST_Intersects(ST_Buffer(geom, 0.5), ST_GeomFromGeoJSON($1))
    ;`;
        try {
            const numeroExteriorRows = await this.cnn.any(query, [geom]);
            return numeroExteriorRows.map((n) => this.createNumeroExteriorFromDbResponse(n));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioNumeroExteriorByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getPlanoCertificadoData(clave) {
        const query = `SELECT id, idpredio, clave, clavecat, estado, region, municipio, zona, localidad, sector, manzana, predio, edificio, 
      unidad, curt, est, pv, rumbo, distancia, v, xutm, yutm, ST_AsGeoJSON(geom) as geom 
      FROM valuacion."vwPlanoCertificado" 
      WHERE clave = $1
    ;`;
        try {
            const planoRows = await this.cnn.any(query, [
                clave,
            ]);
            return planoRows.map((p) => this.createPlanoCertificadoFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPlanoCertificadoData] Error: %s`, err.message);
            throw err;
        }
    }
    async getConstructionByGeometry(geom) {
        const query = `SELECT idconstruccion, bloque, niveles, codigoedificacion, fechaconstruccion, tipo, dato_edif, clasificacion, cuenta, status, clavemanzana, 
      idpredio, sc, ST_AsGeoJSON(geom) as geom 
      FROM geobase."Construccion"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
    ;`;
        try {
            const constructionRows = await this.cnn.any(query, [
                geom,
            ]);
            return constructionRows.map((c) => this.createConstructionFromDbResponse(c));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getConstructionByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async generatePrediCotaLegal(idPredio) {
        const query = `SELECT valuacion.sic_getcotalegal(idpredio, geom) AS cota
      FROM gcm."Predio"
      WHERE idpredio = $1
    ;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredio]);
            return result.cota;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][PredioPGRepository][generatePrediCotaLegal] Error: %s`, e.message);
            throw new Error('Error al crear cotas a partir de las escrituras');
        }
    }
    async getPredioUrbanInformationByGeometry(geom) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfo"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
      ORDER BY clave
    ;`;
        try {
            const predioRows = await this.cnn.any(query, [
                geom,
            ]);
            return predioRows.map((p) => this.createPredioInformationFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioUrbanInformationByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioUPInformationByGeometry(geom) {
        const query = `SELECT idup as idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfoU"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
      ORDER BY clave
    ;`;
        try {
            const predioRows = await this.cnn.any(query, [
                geom,
            ]);
            return predioRows.map((p) => this.createPredioInformationFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioUPInformationByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioParcelaInformationByGeometry(geom) {
        const query = `SELECT idparcela as idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfoP"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
      ORDER BY clave
    ;`;
        try {
            const predioRows = await this.cnn.any(query, [
                geom,
            ]);
            return predioRows.map((p) => this.createPredioInformationFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioParcelaInformationByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioRusticoInformationByGeometry(geom) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfoR"
      WHERE ST_Intersects(geom, ST_GeomFromGeoJSON($1))
      ORDER BY clave
    ;`;
        try {
            const predioRows = await this.cnn.any(query, [
                geom,
            ]);
            return predioRows.map((p) => this.createPredioInformationFromDbResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioRusticoInformationByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getFichaSIMICEGData(formattedClave) {
        const query = `SELECT clavecat2, nomb, ape1, ape2, uso, fecharegistro, tarjeta, ultimaactualizacion, monto_anual, 
      anio_pagado, bimestre, municipio, ubicacion, uso_suelo, regimen, supterr, valterr, supcon, valcon, supesq, valesq, 
      valtotal, valdem
      FROM catastro."vmDatosFichaSimiceg"
      WHERE clavecat2 = $1
    ;`;
        try {
            const predioRow = await this.cnn.oneOrNone(query, [
                formattedClave,
            ]);
            return this.createPredioSIMICEGDataFromDbResponse(predioRow);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioRusticoInformationByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioUrbanInformationByClave(formattedClave) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfo"
      WHERE clavecat = $1
    ;`;
        try {
            const predioRow = await this.cnn.oneOrNone(query, [formattedClave]);
            return this.createPredioInformationFromDbResponse(predioRow);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioUrbanInformationByClave] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioUPInformationByClave(formattedClave) {
        const query = `SELECT idup as idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfoU"
      WHERE clavecat = $1
    ;`;
        try {
            const predioRow = await this.cnn.oneOrNone(query, [formattedClave]);
            return this.createPredioInformationFromDbResponse(predioRow);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioUPInformationByClave] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioParcelaInformationByClave(formattedClave) {
        const query = `SELECT idparcela as idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfoP"
      WHERE clavecat = $1
    ;`;
        try {
            const predioRow = await this.cnn.oneOrNone(query, [formattedClave]);
            return this.createPredioInformationFromDbResponse(predioRow);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioParcelaInformationByClave] Error: %s`, err.message);
            throw err;
        }
    }
    async getPredioRusticoInformationByClave(formattedClave) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, 
      propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJSON(geom) as geom 
      FROM catastro."vmPredioInfoR"
      WHERE clavecat = $1
    ;`;
        try {
            const predioRow = await this.cnn.oneOrNone(query, [formattedClave]);
            return this.createPredioInformationFromDbResponse(predioRow);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][PredioPGRepository][getPredioRusticoInformationByClave] Error: %s`, err.message);
            throw err;
        }
    }
    createPredioFromDbResponse(predio) {
        return {
            idPredio: predio.idpredio,
            clave: predio.clave,
            formattedClave: predio.clavecat,
            CURT: predio.curt,
            caso: +predio.caso,
            forma: predio.forma,
            sct: +predio.sct,
            claveManzana: predio.clavemanzana,
            numeroOficial: predio.noficial,
            superficieConstruction: +predio.supconst,
            description: predio.descrip,
            observation: predio.observa,
            predio: predio.predio,
            frente: [],
            construction: [],
            geometry: JSON.parse(predio.geom),
        };
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
            year: 0,
            geometry: JSON.parse(frente.geom),
        };
    }
    createConstructionFromDbResponse(construction) {
        return {
            idConstruccion: construction.idconstruccion,
            bloque: construction.bloque,
            niveles: construction.niveles,
            codigoEdificacion: construction.codigoedificacion,
            fechaConstruccion: new Date(construction.fechaconstruccion),
            tipo: construction.tipo,
            datoEdificacion: construction.dato_edif,
            clasificacion: construction.clasificacion,
            cuenta: construction.cuenta,
            status: construction.status,
            claveManzana: construction.clavemanzana,
            idPredio: construction.idpredio,
            sc: construction.sc,
            geometry: JSON.parse(construction.geom),
        };
    }
    createPredioCotaFromDbResponse(cota) {
        return {
            cota: cota.cota,
            angulo: cota.angulo,
            est: cota.est,
            pv: cota.pv,
            rumbo: cota.rumbo,
            x: cota.x,
            y: cota.y,
            azimut: cota.azimut,
            clave: cota.clave,
            geometry: JSON.parse(cota.geom),
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
    createNumeroExteriorFromDbResponse(numExt) {
        return {
            numero: numExt.numero,
            idNumeroExterior: numExt.idnumeroexterior,
            status: +numExt.status,
            geometry: JSON.parse(numExt.geom),
        };
    }
    createPredioInformationFromDbResponse(predio) {
        return {
            idPredio: predio.idpredio,
            clase: predio.clase,
            clave: predio.clave,
            formattedClave: predio.clavecat,
            subpredio: predio.subpredio,
            tipo: predio.tipo,
            cuenta: predio.cuenta,
            areaCartografica: predio.area_carto,
            areaPadron: predio.area_padron,
            porcentaje: predio.porcentaje,
            propietario: predio.propietario,
            ubicacion: predio.ubicacion,
            numeroExterior: predio.n_exterior,
            numeroInterior: predio.n_interior,
            colonia: predio.colonia ? predio.colonia : '',
            geometry: JSON.parse(predio.geom),
        };
    }
    createPredioSIMICEGDataFromDbResponse(predio) {
        if (predio) {
            return {
                formattedClave: predio.clavecat2,
                nombrePropietario: predio.nomb,
                apellidoParternoPropietario: predio.ape1,
                apellidoMaternoPropietario: predio.ape2,
                uso: predio.uso,
                fechaRegistro: predio.fecharegistro,
                tarjeta: predio.tarjeta,
                ultimaActualizacion: predio.ultimaactualizacion,
                montoAnual: predio.monto_anual,
                anioPagado: predio.anio_pagado,
                bimestre: predio.bimestre,
                municipio: predio.municipio,
                ubicacion: predio.ubicacion ? predio.ubicacion : '',
                usoSuelo: predio.uso_suelo ? predio.uso_suelo : '',
                regimen: predio.regimen ? predio.regimen : '',
                superficieTerreno: predio.supterr,
                valorTerreno: predio.valterr,
                supeficieConstruccion: predio.supcon,
                valorConstruccion: predio.valcon,
                superficeEsquina: predio.supesq,
                valorEsquina: predio.valesq,
                valorTotal: predio.valtotal,
                valorDemerito: predio.valdem,
            };
        }
        else {
            return {
                formattedClave: '',
                nombrePropietario: '',
                apellidoParternoPropietario: '',
                apellidoMaternoPropietario: '',
                uso: '',
                fechaRegistro: '',
                tarjeta: '',
                ultimaActualizacion: '',
                montoAnual: 0,
                anioPagado: 0,
                bimestre: 0,
                municipio: '',
                ubicacion: '',
                usoSuelo: '',
                regimen: '',
                superficieTerreno: '',
                valorTerreno: '',
                supeficieConstruccion: '',
                valorConstruccion: '',
                superficeEsquina: '',
                valorEsquina: '',
                valorTotal: '',
                valorDemerito: '',
            };
        }
    }
};
PredioPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], PredioPGRepository);
exports.PredioPGRepository = PredioPGRepository;
//# sourceMappingURL=predio.pg.repository.js.map