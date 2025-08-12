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
exports.SearchPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let SearchPGRepository = class SearchPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async executeSearch(searchTerm) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrapResult = (result, finished = true) => ({ finished, data: result });
        const catchError = () => wrapResult(null, false);
        const results = await Promise.all([
            this.searchClaveUrban(searchTerm).then(wrapResult).catch(catchError),
            this.searchClaveRustico(searchTerm).then(wrapResult).catch(catchError),
            this.searchClaveUP(searchTerm).then(wrapResult).catch(catchError),
            this.searchClaveParcela(searchTerm).then(wrapResult).catch(catchError),
            this.searchManzana(searchTerm).then(wrapResult).catch(catchError),
            this.searchCalle(searchTerm).then(wrapResult).catch(catchError),
            this.searchColonia(searchTerm).then(wrapResult).catch(catchError),
            this.searchCondominio(searchTerm).then(wrapResult).catch(catchError),
            this.searchZonaCatastral(searchTerm).then(wrapResult).catch(catchError),
            this.searchLocalidad(searchTerm).then(wrapResult).catch(catchError),
            this.searchUbication(searchTerm).then(wrapResult).catch(catchError),
            this.searchOwnerUrban(searchTerm).then(wrapResult).catch(catchError),
            this.searchOwnerRustico(searchTerm).then(wrapResult).catch(catchError),
            this.searchOwnerUP(searchTerm).then(wrapResult).catch(catchError),
            this.searchOwnerParcela(searchTerm).then(wrapResult).catch(catchError),
            this.searchCorners(searchTerm).then(wrapResult).catch(catchError),
            this.searchEjido(searchTerm).then(wrapResult).catch(catchError),
            this.searchParcela(searchTerm).then(wrapResult).catch(catchError),
        ]);
        const searches = results
            .filter((x) => x && x.finished)
            .map((x) => x.data)
            .reduce((a, b) => a.concat(b), []);
        const searchGroups = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searches.map((s) => {
            const index = searchGroups.findIndex((x) => x.group === s.type);
            if (index >= 0) {
                searchGroups[index].items.push({
                    display: s.location,
                    data: s,
                });
            }
            else {
                searchGroups.push({
                    term: searchTerm,
                    group: s.type,
                    items: [
                        {
                            display: s.location,
                            data: s,
                        },
                    ],
                });
            }
        });
        return searchGroups;
    }
    async searchClaveUrban(searchTerm) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfo"
      WHERE clave ILIKE unaccent($1) OR clavecat ILIKE unaccent($1)
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CLAVE PREDIO URBANO',
                    idPredio: row.idpredio,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    colonia: row.colonia,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        'Col ' +
                        row.colonia +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar clave urbana');
        }
    }
    async searchClaveRustico(searchTerm) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoR"
      WHERE clave ILIKE unaccent($1) OR clavecat ILIKE unaccent($1)
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CLAVE PREDIO RÚSTICO',
                    idPredio: row.idpredio,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar clave rústica');
        }
    }
    async searchClaveUP(searchTerm) {
        const query = `SELECT idup, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoU"
      WHERE clave ILIKE unaccent($1) OR clavecat ILIKE unaccent($1)
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CLAVE DE UPS',
                    idUP: row.idup,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    colonia: row.colonia,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        'Col ' +
                        row.colonia +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar clave de up');
        }
    }
    async searchClaveParcela(searchTerm) {
        const query = `SELECT idparcela, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoP"
      WHERE clave ILIKE unaccent($1) OR clavecat ILIKE unaccent($1)
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CLAVES DE PARCELAS',
                    idParcela: row.idparcela,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar clave de parcela');
        }
    }
    async searchManzana(searchTerm) {
        const query = `SELECT gid, clave, shape_leng, shape_area, label, zona, idmanzana, ST_AsGeoJson(geom) AS geom
      FROM gcm."Manzana"
      WHERE unaccent(clave) ILIKE unaccent($1)
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'MANZANA',
                    gid: row.gid,
                    clave: row.clave,
                    perimetro: row.shape_leng,
                    area: row.shape_area,
                    label: row.label,
                    zona: row.zona,
                    idmanzana: row.idmanzana,
                    location: row.clave + ' - ' + row.label,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar manzana');
        }
    }
    async searchCalle(searchTerm) {
        const query = `SELECT idredvial, nombre, highway, idcalle, corredor, valorcorredor, valor, ST_AsGeoJson(geom) AS geom 
      FROM gcm."vmRedVial" 
      WHERE unaccent(nombre) ILIKE unaccent($1)
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CALLE',
                    calle: row.nombre,
                    idRedVial: row.idredvial,
                    location: row.nombre,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar calle');
        }
    }
    async searchColonia(searchTerm) {
        const query = `SELECT nombre, tipo, local, n_colonia, zona, etapa, observacion, col_fra_co, cln_ppu, codigo_2, codigo_1, codig, ST_AsGeoJson(geom) AS geom
      FROM gcm."Colonia"
      WHERE unaccent(nombre) ILIKE unaccent($1)
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'COLONIA',
                    colonia: row.nombre,
                    tipo: row.tipo,
                    local: row.local,
                    numeroColonia: row.n_colonia,
                    zona: row.zona,
                    etapa: row.etapa,
                    observacion: row.observacion,
                    location: row.nombre,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar colonia');
        }
    }
    async searchCondominio(searchTerm) {
        const query = `SELECT nombre, local, n_colonia, zona, etapa, observacion, col_fra_co, codigo_2, codigo_1, codig, idcondominio, ST_AsGeoJson(geom) AS geom
      FROM gcm."Condominio"
      WHERE unaccent(nombre) ILIKE unaccent($1)
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CONDOMINIO',
                    id: row.idcondominio,
                    condominio: row.nombre,
                    local: row.local,
                    numeroColonia: row.n_colonia,
                    zona: row.zona,
                    etapa: row.etapa,
                    observacion: row.observacion,
                    location: row.nombre,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar condominio');
        }
    }
    async searchZonaCatastral(searchTerm) {
        const query = `SELECT "Clave" as clave, "Localidad" as localidad, idzona, ST_AsGeoJson(geom) AS geom
      FROM gcm."Zona"
      WHERE "Clave" ILIKE unaccent($1)
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'ZONA CATASTRAL',
                    idzona: row.idzona,
                    clave: row.clave,
                    localidad: row.localidad,
                    location: row.clave,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar zona catastral');
        }
    }
    async searchLocalidad(searchTerm) {
        const query = `SELECT "Clave" as clave, idlocalidad, nombre, ST_AsGeoJson(geom) AS geom
      FROM gcm."Localidad"
      WHERE unaccent(nombre) ILIKE unaccent($1)
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'LOCALIDAD',
                    idLocalidad: row.idlocalidad,
                    clave: row.clave,
                    localidad: row.nombre,
                    location: row.clave + ' ' + row.nombre,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar localidad');
        }
    }
    async searchUbication(searchTerm) {
        const query = `SELECT id, clave, ubicacion, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioUbicacion"
      WHERE unaccent(ubicacion) ILIKE unaccent($1)
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'UBICACIÓN',
                    id: row.id,
                    clave: row.clave,
                    ubication: row.ubicacion,
                    location: row.ubicacion,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar ubicación');
        }
    }
    async searchOwnerUrban(searchTerm) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfo"
      WHERE unaccent(propietario) ILIKE unaccent($1) AND geom IS NOT NULL
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'PROPIETARIO PREDIO URBANO',
                    idPredio: row.idpredio,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    colonia: row.colonia,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        'Col ' +
                        row.colonia +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar propietario de predio urbano');
        }
    }
    async searchOwnerRustico(searchTerm) {
        const query = `SELECT idpredio, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoR"
      WHERE unaccent(propietario) ILIKE unaccent($1) AND geom IS NOT NULL
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'PROPIETARIO PREDIO RÚSTICO',
                    idPredio: row.idpredio,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar propietario de predio rústico');
        }
    }
    async searchOwnerUP(searchTerm) {
        const query = `SELECT idup, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, colonia, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoU"
      WHERE unaccent(propietario) ILIKE unaccent($1) AND geom IS NOT NULL
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'PROPIETARIO UNIDAD PRIVATIVA',
                    idUP: row.idup,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    colonia: row.colonia,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        'Col ' +
                        row.colonia +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar propietario de up');
        }
    }
    async searchOwnerParcela(searchTerm) {
        const query = `SELECT idparcela, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoP"
      WHERE unaccent(propietario) ILIKE unaccent($1) AND geom IS NOT NULL
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'PROPIETARIO PARCELA',
                    idParcela: row.idparcela,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar propietario de parcela');
        }
    }
    async searchCorners(searchTerm) {
        const query = `SELECT v_callea, v_calleb, v_localidad, ST_AsGeoJson(v_geom) AS geom
      FROM catastro.sic_getesquina(unaccent($1))
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'CRUCES RED VIAL',
                    calleA: row.v_callea,
                    calleB: row.v_calleb,
                    localidad: row.v_localidad,
                    location: row.v_callea + ' esquina ' + row.v_calleb + `\nlocalidad: ` + row.v_localidad,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar esquina');
        }
    }
    async searchEjido(searchTerm) {
        const query = `SELECT id, nombre, capa, ST_AsGeoJson(geom) AS geom
      FROM simiceg."Desarrollo_Rural_Ejidos"
      WHERE unaccent(nombre) ILIKE unaccent($1)
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'EJIDO',
                    id: row.id,
                    nombre: row.nombre,
                    capa: row.capa,
                    location: row.capa + ' ' + row.nombre,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar ejido');
        }
    }
    async searchParcela(searchTerm) {
        const query = `SELECT idparcela, clase, clave, clavecat, subpredio, tipo, cuenta, area_carto, area_padron, porcentaje, propietario, ubicacion, n_exterior, n_interior, ST_AsGeoJson(geom) AS geom
      FROM catastro."vmPredioInfoP"
      WHERE unaccent(ubicacion) ILIKE unaccent($1)
      ORDER BY clave
      LIMIT 100
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [`%${searchTerm}%`]);
            return dbResponse.map((row) => {
                return {
                    type: 'PARCELA',
                    idParcela: row.idparcela,
                    clase: row.clase,
                    clave: row.clave,
                    claveCatastral: row.clavecat,
                    subPredio: row.subpredio,
                    tipo: row.tipo,
                    cuenta: row.cuenta,
                    areaCartografica: row.area_carto,
                    areaPadron: row.area_padron,
                    porcentaje: row.porcentaje,
                    propietario: row.propietario,
                    ubicacion: row.ubicacion,
                    numeroExterior: row.n_exterior,
                    numeroInterior: row.n_interior,
                    location: row.clavecat +
                        `\n` +
                        row.ubicacion +
                        ' ' +
                        row.n_exterior +
                        (row.n_interior ? `, ${row.n_interior}, ` : ', ') +
                        '\nPropietario: ' +
                        row.propietario,
                    geometry: JSON.parse(row.geom),
                };
            });
        }
        catch (err) {
            logger_1.default.error(err);
            throw new Error('Error al buscar parcela');
        }
    }
};
SearchPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object])
], SearchPGRepository);
exports.SearchPGRepository = SearchPGRepository;
//# sourceMappingURL=search.pg.repository.js.map