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
exports.EdicionPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
const duplicated_name_kml_error_1 = require("../errors/duplicated-name-kml.error");
let EdicionPGRepository = class EdicionPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async insertFusion(json, user, tramite) {
        const query = `INSERT INTO edicion.fusiones(
      objeto_json, usuario, fecha, tramite)
      VALUES ($1, $2, now(), $3)
      RETURNING idfusion
    ;`;
        try {
            const dbResponse = await this.cnn.oneOrNone(query, [
                JSON.stringify(JSON.parse(json)),
                user,
                tramite,
            ]);
            return dbResponse.idfusion ? dbResponse.idfusion : '';
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: insertFusion] Error: %s`, e.message);
            throw new Error('Error al insertar intención de fusión');
        }
    }
    async generateFusion(idFusion) {
        const query = `SELECT edicion.sic_generafusion($1) AS generado;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idFusion]);
            return result.generado;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: generateFusion] Error: %s`, e.message);
            throw new Error('Error al generar intención de fusión');
        }
    }
    async getFusion(idFusion) {
        const query = `SELECT idfusion, objeto_json, usuario, fecha, tramite, generado, ST_AsGeoJson(geom) AS geom
      FROM edicion.fusiones
      WHERE idfusion = $1
    ;`;
        try {
            const row = await this.cnn.oneOrNone(query, [idFusion]);
            return this.createFusionFromDbResponse(row);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][getEdicionByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async applyFusion(idFusion, idPredominante) {
        const query = `SELECT edicion.sic_aplicafusion($1, $2) AS aplicado;`;
        try {
            const result = await this.cnn.oneOrNone(query, [
                idFusion,
                idPredominante,
            ]);
            return result.aplicado;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: applyFusion] Error: %s`, e.message);
            throw new Error('Error al aplicar fusión');
        }
    }
    async validateFusion(claves) {
        const query = `SELECT edicion.sic_validafusion($1) AS valid;`;
        try {
            const result = await this.cnn.oneOrNone(query, [claves]);
            return result.valid;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: validateFusion] Error: %s`, e.message);
            throw new Error('Error al validar fusión');
        }
    }
    async validateDebtOwnerFusion(claves) {
        const query = `SELECT edicion.sic_validafusion_alfa($1) AS valid;`;
        try {
            const result = await this.cnn.oneOrNone(query, [claves]);
            return result.valid;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: validateDebtOwnerFusion] Error: %s`, e.message);
            throw new Error('Error al validar fusión por propietario y deuda');
        }
    }
    async executeDivisionLinderos(idPredio, user) {
        const query = `SELECT edicion.sic_getlinderosdividir($1, $2) AS lindero;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredio, user]);
            return result.lindero;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: executeDivisionLinderos] Error: %s`, e.message);
            throw new Error('Error al generar linderos para la subdivisión');
        }
    }
    async getLinderos(idPredio) {
        const query = `SELECT idlindero, idpredio, usuario, fecha, procesado, lado, st_length(geom) as distancia, ST_AsGeoJson(geom) AS geom
      FROM edicion."PredioDividir"
      WHERE idpredio = $1 AND geom IS NOT NULL
      ORDER BY lado
    ;`;
        try {
            const rows = await this.cnn.any(query, [idPredio]);
            return rows.map((l) => this.createLinderoFromDbResponse(l));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][getLinderos] Error: %s`, err.message);
            throw err;
        }
    }
    async deleteLinderos(idPredio) {
        const queryDeleteConstruction = `DELETE FROM edicion."PredioDividir" WHERE idpredio = $1;`;
        try {
            await this.cnn.any(queryDeleteConstruction, [idPredio]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][deleteLinderos] Error: %s`, err.message);
            throw err;
        }
    }
    async divideLindero(lindero) {
        const query = `SELECT edicion.sic_dividelindero($1, $2, $3, $4, $5, $6) AS division;`;
        try {
            const result = await this.cnn.oneOrNone(query, [
                lindero.idLindero,
                lindero.distance,
                lindero.usuario,
                lindero.element,
                lindero.isDirected,
                lindero.needToClean,
            ]);
            return result.division;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: divideLindero] Error: %s`, e.message);
            throw new Error('Error al dividir lindero para la subdivisión');
        }
    }
    async createParalela(lindero) {
        const query = `SELECT edicion.sic_getparalela($1, $2, $3, $4) AS paralela;`;
        try {
            const result = await this.cnn.oneOrNone(query, [
                lindero.idLindero,
                +lindero.distance,
                lindero.usuario,
                lindero.element,
            ]);
            return result.paralela;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: createParalela] Error: %s`, e.message);
            throw new Error('Error al generar paralela en un lindero para la subdivisión');
        }
    }
    async getParalelas(idPredio, user) {
        const query = `SELECT idparalela, idlindero, idpredio, usuario, fecha, st_length(geom) as distancia, ST_AsGeoJson(geom) AS geom
      FROM edicion."Paralela"
      WHERE idpredio = $1 AND usuario = $2 
      ORDER BY idlindero, fecha
    ;`;
        try {
            const rows = await this.cnn.any(query, [idPredio, user]);
            return rows.map((p, index) => this.createParalelaFromDbResponse(p, index + 1));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][getParalelas] Error: %s`, err.message);
            throw err;
        }
    }
    async cleanEditionPredio(idPredio) {
        const query = `SELECT edicion.sic_limpiapredio($1) AS clean;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredio]);
            return result.clean;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: cleanEditionPredio] Error: %s`, e.message);
            throw new Error('Error al limpiar el predio en subdivisión');
        }
    }
    async insertDivision(json, id, user, tramite) {
        const query = `INSERT INTO edicion.subdivisiones(
      linea_json, idgeometria, usuario, fecha, tramite)
      VALUES ($1, $2, $3, now(), $4)
      RETURNING idsubdivision
    ;`;
        try {
            const dbResponse = await this.cnn.oneOrNone(query, [
                JSON.stringify(JSON.parse(json)),
                id,
                user,
                tramite,
            ]);
            return dbResponse.idsubdivision ? dbResponse.idsubdivision : '';
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: insertDivision] Error: %s`, e.message);
            throw new Error('Error al insertar intención de subdivisión');
        }
    }
    async generateDivision(idDivision) {
        const query = `SELECT edicion.sic_generasubdivision($1) AS generado;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idDivision]);
            return result.generado;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: generateDivision] Error: %s`, e.message);
            throw new Error('Error al generar intención de subdivisión');
        }
    }
    async getDivision(idDivision) {
        const query = `SELECT idsubdivision, linea_json, idgeometria, usuario, fecha, tramite, generado, ST_AsGeoJson(geom) AS geom
      FROM edicion.subdivisiones
      WHERE idsubdivision = $1
    ;`;
        try {
            const row = await this.cnn.oneOrNone(query, [idDivision]);
            return this.createDivisionFromDbResponse(row);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][getDivision] Error: %s`, err.message);
            throw err;
        }
    }
    async applyDivision(idDivision) {
        const query = `SELECT edicion.sic_aplicasubdivision($1) AS aplicado;`;
        const querySplitAlign = `CALL edicion.alinea_subdivision($1);`;
        try {
            const result = await this.cnn.oneOrNone(query, [idDivision]);
            if (result.aplicado) {
                await this.cnn.none(querySplitAlign, [idDivision]);
            }
            return result.aplicado;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: applyDivision] Error: %s`, e.message);
            throw new Error('Error al aplicar subdivisión');
        }
    }
    async validateDivision(claves) {
        const query = `SELECT edicion.sic_validasubdivision($1) AS valid;`;
        try {
            const result = await this.cnn.oneOrNone(query, [claves]);
            return result.valid;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: validateDivision] Error: %s`, e.message);
            throw new Error('Error al validar subdivisión');
        }
    }
    async getEditionLayers() {
        const query = `SELECT idcapa, esquema, nombre, idnombre, eliminar, alias
      FROM edicion."CapaEditable";`;
        try {
            const rows = await this.cnn.any(query);
            return rows.map((el) => this.createEditionLayerFromDbResponse(el));
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: getEditionLayers] Error: %s`, e.message);
            throw new Error('Error al obtener capas editables');
        }
    }
    async getEditionAttributeByIdLayer(idLayer) {
        const query = `SELECT idcapaatributo, idcapa, campo, aliascampo, iscatalog, combocatalog, tipocampo
      FROM edicion."CapaEditableAtributos"
      WHERE idcapa = $1;`;
        try {
            const rows = await this.cnn.any(query, [
                idLayer,
            ]);
            return rows.map((ea) => this.createEditionAttributeFromDbResponse(ea));
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: getEditionAttributeByIdLayer] Error: %s`, e.message);
            throw new Error('Error al obtener atributos de capa editable');
        }
    }
    async existClasificationConstruction(clave) {
        const query = `SELECT clave 
      FROM catastro.vwval_cons
      WHERE clave = $1;`;
        try {
            const result = await this.cnn.oneOrNone(query, [clave]);
            return result ? true : false;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: existClasificationConstruction] Error: %s`, e.message);
            throw new Error('Error al buscar clasificación de construcción');
        }
    }
    async getCatalogue(query) {
        try {
            if (query) {
                const rows = await this.cnn.any(query);
                return rows;
            }
            else {
                return [];
            }
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: getCatalogue] Error: %s`, e.message);
            throw new Error('Error al obtener catalogo');
        }
    }
    async updateAttributes(layer, attributes, id) {
        let query = `UPDATE ${layer.schema}."${layer.name}" SET `;
        attributes.map((a, index) => {
            if (index === 0) {
                if (a.attributeType === 'number') {
                    query += a.value === '' || a.value === null ? `${a.attributeName} = null` : `${a.attributeName} = ${a.value}`;
                }
                else if (a.attributeType === 'id') {
                    query +=
                        a.value === '' || a.value === null ? `${a.attributeName} = null` : `${a.attributeName} = '${a.value}'`;
                }
                else {
                    query += a.value === '' || a.value === null ? `${a.attributeName} = ''` : `${a.attributeName} = '${a.value}'`;
                }
            }
            else {
                if (a.attributeType === 'number') {
                    query +=
                        a.value === '' || a.value === null ? `, ${a.attributeName} = null` : `, ${a.attributeName} = ${a.value}`;
                }
                else if (a.attributeType === 'id') {
                    query +=
                        a.value === '' || a.value === null ? `, ${a.attributeName} = null` : `, ${a.attributeName} = '${a.value}'`;
                }
                else {
                    query +=
                        a.value === '' || a.value === null ? `, ${a.attributeName} = ''` : `, ${a.attributeName} = '${a.value}'`;
                }
            }
        });
        query += ` WHERE ${layer.idName} = $1
      RETURNING ${layer.idName} as id
    ;`;
        try {
            const result = await this.cnn.oneOrNone(query, [id]);
            return result ? true : false;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: updateAttributes] Error: %s`, e.message);
            throw new Error('Error al actualizar datos');
        }
    }
    async getEditionObjectByGeometry(layer, attributes, geom) {
        let query = `SELECT ${layer.idName} as id, ST_AsGeoJson(geom) AS geom`;
        attributes.map((a) => {
            query += `, ${a.attributeName}`;
        });
        query += ` FROM ${layer.schema}."${layer.name}" WHERE ST_Intersects(ST_Buffer(geom, 0.5), ST_GeomFromGeoJSON($1));`;
        try {
            const rows = await this.cnn.any(query, [geom]);
            return rows.map((o) => this.createEditionObjectFromDbResponse(attributes, o));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository: getEditionObjectByGeometry] Error: %s`, err.message);
            throw err;
        }
    }
    async deleteObjectById(layer, id) {
        const query = `DELETE FROM ${layer.schema}."${layer.name}" 
      WHERE ${layer.idName} = $1
    ;`;
        try {
            await this.cnn.none(query, [id]);
            return true;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: deleteObjectById] Error: %s`, e.message);
            throw new Error('Error al eliminar datos');
        }
    }
    async executeDeslindeCatastral(idPredio, user) {
        const query = `CALL edicion.describe(
      $1, $2
    );`;
        try {
            await this.cnn.none(query, [idPredio, user]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository: executeDeslindeCatastral] Error: %s`, err.message);
            throw err;
        }
    }
    async getDeslindeCatastral(idPredio) {
        const query = `SELECT iddeslinde, idpredio, descripcion, colindancia_n, colindancia_e, colindancia_s, colindancia_o
      FROM edicion."PredioDeslinde"
      WHERE idpredio = $1
    ;`;
        try {
            const row = await this.cnn.oneOrNone(query, [
                idPredio,
            ]);
            return this.createDeslindeCatastralFromDbResponse(row);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][getDeslindeCatastral] Error: %s`, err.message);
            throw err;
        }
    }
    async alignLindero(idPredio, tolerance) {
        const query = `SELECT edicion.sic_alinealinderointerno($1, $2) AS align;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredio, tolerance]);
            return result.align;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: alignLindero] Error: %s`, e.message);
            throw new Error('Error al alinear lindero');
        }
    }
    async splitConstruction(idPredio) {
        const query = `SELECT edicion.sic_split_construc($1) AS splited;`;
        try {
            const result = await this.cnn.oneOrNone(query, [idPredio]);
            return result.splited;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: splitConstruction] Error: %s`, e.message);
            throw new Error('Error al partir construcciones');
        }
    }
    async addGeomKML(geom, kmlData, user, index) {
        const query = `INSERT INTO kml.kml_geometries(
      nombre, id_nombre, descripcion, usuario, geom)
      VALUES ($1, $2, $3, $4, ST_Transform(ST_GeomFromGeoJSON($5), 32613))
      RETURNING id
    ;`;
        try {
            const dbResponse = await this.cnn.oneOrNone(query, [
                kmlData.name,
                kmlData.name + '-' + index,
                kmlData.description,
                user,
                geom,
            ]);
            return dbResponse.id ? true : false;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: addGeomKML] Error: %s`, e.message);
            if (e.code === '23505' || e.code === 23505) {
                throw new duplicated_name_kml_error_1.DuplicatedNameKMLError('El nombre del KML ya existe');
            }
            else {
                throw new Error('Error al insertar geometria kml');
            }
        }
    }
    async getKMLGeometries(idName) {
        const query = `SELECT id, nombre, id_nombre, descripcion, usuario, fecha, ST_AsGeoJson(geom) AS geom
      FROM kml.kml_geometries
      WHERE id_nombre ILIKE $1
    ;`;
        try {
            const rows = await this.cnn.any(query, [`${idName}-%`]);
            return rows.map((kml) => this.createKMLGeometryDataFromDbResponse(kml));
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: getKMLGeometries] Error: %s`, e.message);
            throw new Error('Error al obtener geometrias KML registradas');
        }
    }
    async getStreetViewTaking(streetViewTake, user) {
        const query = `SELECT valuacion.sic_conostreetview($1, $2, $3, $4, $5, $6) AS cono;`;
        try {
            const result = await this.cnn.oneOrNone(query, [
                streetViewTake.latitud,
                streetViewTake.longitud,
                streetViewTake.heading,
                streetViewTake.pitch,
                streetViewTake.zoom,
                user,
            ]);
            return this.getConoStreetView(result.cono);
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: Catastro][EdicionPGRepository: getStreetViewTaking] Error: %s`, e.message);
            throw new Error('Error al registrar toma street view');
        }
    }
    async getConoStreetView(idCono) {
        const query = `SELECT idcono, ST_AsGeoJson(geom) AS geom, ST_AsGeoJson(source) AS source, ST_AsGeoJson(target) AS target, 
      ST_AsGeoJson(base) AS base, ST_AsGeoJson(cone) AS cone, zoom, azimut, vertical, fecha, url, usuario, descripcion
      FROM edicion."ConoStreetView"
      WHERE idcono = $1
    ;`;
        try {
            const rowData = await this.cnn.one(query, [idCono]);
            return this.createConoStreetViewFromDbResponse(rowData);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository: getConoStreetView] Error: %s`, err.message);
            throw err;
        }
    }
    async deleteStreetViewTaking(user) {
        const queryDelete = `DELETE FROM edicion."ConoStreetView" WHERE usuario = $1;`;
        try {
            await this.cnn.any(queryDelete, [user]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Catastro][EdicionPGRepository][deleteStreetViewTaking] Error: %s`, err.message);
            throw err;
        }
    }
    createFusionFromDbResponse(fusion) {
        return {
            idFusion: fusion.idfusion,
            json: fusion.objeto_json,
            user: fusion.user,
            fecha: new Date(fusion.fecha),
            tramite: fusion.tramite,
            generado: fusion.generado,
            geometry: JSON.parse(fusion.geom),
        };
    }
    createLinderoFromDbResponse(lindero) {
        return {
            idLindero: lindero.idlindero,
            idPredio: lindero.idpredio,
            usuario: lindero.usuario,
            fecha: new Date(lindero.fecha),
            procesado: lindero.procesado,
            lado: lindero.lado,
            distancia: lindero.distancia,
            geometry: JSON.parse(lindero.geom),
            distance: '',
            element: 0,
            isDirected: true,
            needToClean: true,
        };
    }
    createParalelaFromDbResponse(lindero, lado) {
        return {
            idParalela: lindero.idparalela,
            idLindero: lindero.idlindero,
            idPredio: lindero.idpredio,
            lado: lado,
            distancia: lindero.distancia,
            user: lindero.usuario,
            fecha: new Date(lindero.fecha),
            geometry: JSON.parse(lindero.geom),
            distance: '',
            element: 0,
            isDirected: true,
            needToClean: true,
        };
    }
    createDivisionFromDbResponse(division) {
        return {
            idDivision: division.idsubdivision,
            lineJSON: division.linea_json,
            idGeometry: division.idgeometria,
            user: division.usuario,
            fecha: new Date(division.fecha),
            tramite: division.tramite,
            generado: division.generado,
            geometry: JSON.parse(division.geom),
        };
    }
    createEditionLayerFromDbResponse(layer) {
        return {
            idLayer: layer.idcapa,
            schema: layer.esquema,
            name: layer.nombre,
            layerName: layer.alias,
            idName: layer.idnombre,
            canDelete: layer.eliminar,
        };
    }
    createEditionAttributeFromDbResponse(attribute) {
        return {
            idAttribute: attribute.idcapaatributo,
            idLayer: attribute.idcapa,
            attributeName: attribute.campo,
            attributeShow: attribute.aliascampo,
            hasCatalogue: attribute.iscatalog,
            queryCatalogue: attribute.combocatalog,
            catalogue: [],
            value: '',
            attributeType: attribute.tipocampo,
        };
    }
    createDeslindeCatastralFromDbResponse(deslinde) {
        return {
            idDeslinde: deslinde.iddeslinde,
            idPredio: deslinde.idpredio,
            descripcion: deslinde.descripcion,
            colindanciaNorte: deslinde.colindancia_n,
            colindanciaEste: deslinde.colindancia_e,
            colindanciaSur: deslinde.colindancia_s,
            colindanciaOeste: deslinde.colindancia_o,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createEditionObjectFromDbResponse(attributes, response) {
        return {
            id: response.id,
            properties: attributes.map((a) => {
                return { key: a.attributeName, value: response[a.attributeName] ? response[a.attributeName] : '' };
            }),
            geometry: JSON.parse(response.geom),
        };
    }
    createKMLGeometryDataFromDbResponse(kml) {
        return {
            id: kml.id,
            name: kml.nombre,
            description: kml.descripcion,
            user: kml.usuario,
            fecha: new Date(kml.fecha),
            geometry: JSON.parse(kml.geom),
        };
    }
    createConoStreetViewFromDbResponse(cono) {
        return {
            idCono: cono.idcono,
            geometry: JSON.parse(cono.geom),
            fuenteToma: JSON.parse(cono.source),
            objetivoToma: JSON.parse(cono.target),
            baseToma: JSON.parse(cono.base),
            extentGeom: JSON.parse(cono.cone),
            zoom: cono.zoom,
            azimut: cono.azimut,
            vertical: cono.vertical,
            fecha: new Date(cono.fecha),
            url: cono.url,
            usuario: cono.usuario,
            descripcion: cono.descripcion,
        };
    }
};
EdicionPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], EdicionPGRepository);
exports.EdicionPGRepository = EdicionPGRepository;
//# sourceMappingURL=edicion.pg.repository.js.map