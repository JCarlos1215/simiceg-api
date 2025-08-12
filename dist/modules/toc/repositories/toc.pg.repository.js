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
exports.TocPGRepository = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
let TocPGRepository = class TocPGRepository {
    constructor(cnnwb, cnngeo) {
        this.cnnwb = cnnwb;
        this.cnngeo = cnngeo;
        this.tocElementsProcess = [];
        this.tempToc = [];
    }
    async getToc(idRol, multilevel) {
        if (multilevel) {
            try {
                this.groups = await this.getGroups();
                this.layers = await this.getLayers(idRol);
                const builder = this.buildToc();
                return builder;
            }
            catch (err) {
                logger_1.default.error(err, `[Modulo: Toc][TocPGRepository][getToc] Error: %s`, err.message);
                throw new Error('Error al consultar toc');
            }
        }
        else {
            const query = `SELECT l.titulo, l.servidor, l.servicio, l.leyenda, l.atribucion, l.tipo, l.opciones, l.color,
        tl.isvisible, tl.opacity, tl.hasidentify, tl.zindex, tl.graphoption, tl.refreshoption,
        tg.groupname, tg.icon
        FROM webapi."permission_per_rol" pr
        INNER JOIN webapi."permission_type" t ON t.idpermissiontype = pr.idpermissiontype
        INNER JOIN webapi."layer" l ON pr.idvinculo = l.idlayer
        INNER JOIN webapi."toc_layer" tl ON tl.idlayer = l.idlayer
        INNER JOIN webapi."toc_element" te ON tl.idtocelement = te.idtocelement
        INNER JOIN webapi."toc_group" tg ON tg.idtocelement = te.idtocparent
        WHERE t."permissiontype" = 'layer' AND pr.idrol = $1
        ORDER by tg.groupname, l.titulo
      ;`;
            try {
                const tocData = await this.cnnwb.any(query, [idRol]);
                const toc = { groups: [] };
                for (const row of tocData) {
                    const index = toc.groups.findIndex((x) => x.group === row.groupname);
                    if (index >= 0) {
                        // Ya existe el grupo
                        toc.groups[index].content.push({
                            title: row.titulo,
                            type: row.tipo,
                            server: row.servidor,
                            service: row.servicio,
                            legend: row.leyenda,
                            attribution: row.atribucion,
                            isVisible: row.isvisible,
                            opacity: row.opacity,
                            options: row.opciones,
                            color: row.color,
                            hasIdentify: row.hasidentify,
                            zIndex: row.zindex,
                            graphOptions: JSON.parse(JSON.stringify(row.graphoption)),
                            refreshOption: JSON.parse(JSON.stringify(row.refreshoption)),
                        });
                    }
                    else {
                        // Crea el grupo
                        toc.groups.push({
                            group: row.groupname,
                            icon: row.icon,
                            content: [
                                {
                                    title: row.titulo,
                                    type: row.tipo,
                                    server: row.servidor,
                                    service: row.servicio,
                                    legend: row.leyenda,
                                    attribution: row.atribucion,
                                    isVisible: row.isvisible,
                                    options: row.opciones,
                                    color: row.color,
                                    opacity: row.opacity,
                                    hasIdentify: row.hasidentify,
                                    zIndex: row.zindex,
                                    graphOptions: JSON.parse(JSON.stringify(row.graphoption)),
                                    refreshOption: JSON.parse(JSON.stringify(row.refreshoption)),
                                },
                            ],
                        });
                    }
                }
                return toc;
            }
            catch (err) {
                logger_1.default.error(err, `[Modulo: Toc][TocPGRepository][getToc] Error: %s`, err.message);
                throw new Error('Error al consultar toc');
            }
        }
    }
    async getGroups() {
        const query = `SELECT tg.groupname, tg.icon, te.idtocelement, te.idtocparent
      FROM webapi."toc_group" tg
      RIGHT JOIN webapi."toc_element" te ON tg.idtocelement = te.idtocelement
      ORDER by tg.groupname
    ;`;
        try {
            const tocGroup = await this.cnnwb.any(query);
            return tocGroup;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Toc][TocPGRepository][getGroups] Error: %s`, err.message);
            throw new Error('Error al consultar grupos');
        }
    }
    async getLayers(idRol) {
        const query = `SELECT l.titulo, l.servidor, l.servicio, l.leyenda, l.atribucion, l.tipo, l.opciones, l.color,
      tl.isvisible, tl.opacity, tl.hasidentify, tl.zindex, tl.graphoption, tl.refreshoption, te.idtocelement
      FROM webapi."permission_per_rol" pr
      INNER JOIN webapi."permission_type" t ON t.idpermissiontype = pr.idpermissiontype
      INNER JOIN webapi."layer" l ON pr.idvinculo = l.idlayer
      INNER JOIN webapi."toc_layer" tl ON tl.idlayer = l.idlayer
      INNER JOIN webapi."toc_element" te ON tl.idtocelement = te.idtocelement
      WHERE t."permissiontype" = 'layer' AND pr.idrol = $1
      ORDER by te.orden, l.titulo asc
    ;`;
        try {
            const tocLayer = await this.cnnwb.any(query, [idRol]);
            return tocLayer;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: Toc][TocPGRepository][getLayers] Error: %s`, err.message);
            throw new Error('Error al consultar capas');
        }
    }
    buildToc() {
        const toc = { groups: [] };
        this.layers.map((l) => {
            const indexElementProcess = this.tocElementsProcess.findIndex((x) => x === l.idtocelement);
            if (indexElementProcess === -1) {
                // No procesado
                // Lo ingresamos a procesados
                this.tocElementsProcess.push(l.idtocelement);
                // Toc Element de la capa
                const elementLayer = this.groups.find((g) => g.idtocelement === l.idtocelement);
                // Obtenemos todas las capas que pertenecen
                const layersGroup = this.layers.filter((l) => l.idtocelement === elementLayer.idtocelement);
                const content = layersGroup.map((lay) => {
                    return {
                        title: lay.titulo,
                        type: lay.tipo,
                        server: lay.servidor,
                        service: lay.servicio,
                        legend: lay.leyenda,
                        attribution: lay.atribucion,
                        isVisible: lay.isvisible,
                        opacity: lay.opacity,
                        hasIdentify: lay.hasidentify,
                        zIndex: lay.zindex,
                        options: lay.opciones,
                        color: lay.color,
                        graphOptions: JSON.parse(JSON.stringify(lay.graphoption)),
                        refreshOption: JSON.parse(JSON.stringify(lay.refreshoption)),
                    };
                });
                this.tempToc.push({
                    element: elementLayer.idtocparent,
                    toc: this.buildTocParents(content, elementLayer.idtocparent, 0),
                });
            }
        });
        this.tempToc.map((t) => {
            toc.groups.push(t.toc);
        });
        return toc;
    }
    buildTocParents(content, parent, level) {
        // Grupo al que pertenece las capas
        const group = this.groups.find((g) => g.idtocelement === parent);
        const newToc = [];
        // Buscamos elements al que sea hijo
        const elementChildren = this.groups.filter((c) => c.idtocparent === group.idtocelement);
        elementChildren.map((child) => {
            if (child.groupname === null) {
                // es de capa
                const indexElementProcess = this.tocElementsProcess.findIndex((x) => x === child.idtocelement);
                if (indexElementProcess === -1) {
                    this.tocElementsProcess.push(child.idtocelement);
                    // Obtenemos todas las capas que pertenecen
                    const layersGroup = this.layers.filter((l) => l.idtocelement === child.idtocelement);
                    if (layersGroup.length > 0) {
                        const newContent = layersGroup.map((lay) => {
                            return {
                                title: lay.titulo,
                                type: lay.tipo,
                                server: lay.servidor,
                                service: lay.servicio,
                                legend: lay.leyenda,
                                attribution: lay.atribucion,
                                isVisible: lay.isvisible,
                                opacity: lay.opacity,
                                hasIdentify: lay.hasidentify,
                                zIndex: lay.zindex,
                                options: lay.opciones,
                                color: lay.color,
                                graphOptions: JSON.parse(JSON.stringify(lay.graphoption)),
                                refreshOption: JSON.parse(JSON.stringify(lay.refreshoption)),
                            };
                        });
                        newToc.push(this.buildTocParents(newContent, child.idtocparent, level + 1));
                    }
                }
            }
            else {
                // es de grupo
                const elementChildrenGroup = this.groups.filter((c) => c.idtocparent === child.idtocelement);
                elementChildrenGroup.map((c) => {
                    if (c.groupname === null) {
                        const indexElementProcess = this.tocElementsProcess.findIndex((x) => x === c.idtocelement);
                        if (indexElementProcess === -1) {
                            this.tocElementsProcess.push(c.idtocelement);
                            // Obtenemos todas las capas que pertenecen
                            const layersGroup = this.layers.filter((l) => l.idtocelement === c.idtocelement);
                            if (layersGroup.length > 0) {
                                const newContent = layersGroup.map((lay) => {
                                    return {
                                        title: lay.titulo,
                                        type: lay.tipo,
                                        server: lay.servidor,
                                        service: lay.servicio,
                                        legend: lay.leyenda,
                                        attribution: lay.atribucion,
                                        isVisible: lay.isvisible,
                                        opacity: lay.opacity,
                                        hasIdentify: lay.hasidentify,
                                        zIndex: lay.zindex,
                                        options: lay.opciones,
                                        color: lay.color,
                                        graphOptions: JSON.parse(JSON.stringify(lay.graphoption)),
                                        refreshOption: JSON.parse(JSON.stringify(lay.refreshoption)),
                                    };
                                });
                                newToc.push(this.buildTocParents(newContent, c.idtocparent, level + 1));
                            }
                        }
                    }
                    else {
                        const t = this.buildTocParents([], c.idtocparent, level + 1);
                        if (t.content.length > 0) {
                            newToc.push(t);
                        }
                    }
                });
            }
        });
        // Armamos TOC
        let groupContent;
        groupContent = {
            group: group.groupname,
            icon: group.icon,
            content: [],
        };
        newToc.map((toc) => {
            if (toc.group === group.groupname) {
                toc.content.map((l) => {
                    groupContent.content.push(l);
                });
            }
            else {
                groupContent.content.push(toc);
            }
        });
        content.map((c) => {
            groupContent.content.push(c);
        });
        if (elementChildren[0].groupname) {
            groupContent.content = groupContent.content.sort((a, b) => {
                return a.group.localeCompare(b.group);
            });
        }
        if (group.idtocparent !== null && level === 0) {
            groupContent = this.buildTocParents([groupContent], group.idtocparent, level + 1);
        }
        return groupContent;
    }
    async updateLayerToc(refresh) {
        const query = refresh.refreshLayer;
        try {
            await this.cnngeo.any(query);
            return true;
        }
        catch (e) {
            logger_1.default.error(`[Modulo: Toc][TocPGRepository: updateLayerToc] Error: %s`, e.message, e);
            throw new Error('Error al actualizar ' + e.message);
        }
    }
    async getAllLayers() {
        const query = `SELECT l.idlayer, l.titulo, tg.groupname, l.servicio, tl.idtocelement, te.idtocparent
      FROM webapi.layer l
      INNER JOIN webapi.toc_layer tl
      ON l.idlayer = tl.idlayer
      INNER JOIN webapi.toc_element te
      ON tl.idtocelement = te.idtocelement
      INNER JOIN webapi.toc_group tg
      ON te.idtocparent = tg.idtocelement
      ORDER BY tg.groupname, l.titulo
    ;`;
        try {
            const dbResponse = await this.cnnwb.any(query);
            const tocGroups = [];
            dbResponse.map((t) => {
                const index = tocGroups.findIndex((x) => x.group === t.groupname);
                if (index >= 0) {
                    tocGroups[index].tocLayers.push({
                        idLayer: t.idlayer,
                        capa: t.titulo,
                        service: t.servicio,
                        group: t.groupname,
                        idTocElement: t.idtocelement,
                    });
                }
                else {
                    tocGroups.push({
                        group: t.groupname,
                        idTocGroup: t.idtocparent,
                        idPermissionType: '',
                        permissionType: '',
                        idRol: '',
                        tocLayers: [
                            {
                                idLayer: t.idlayer,
                                capa: t.titulo,
                                service: t.servicio,
                                group: t.groupname,
                                idTocElement: t.idtocelement,
                            },
                        ],
                    });
                }
            });
            return tocGroups;
        }
        catch (e) {
            logger_1.default.error(`[Modulo: Toc][TocPGRepository: getAllLayers] Error: %s`, e.message, e);
            throw new Error('Error al obtener capas del TOC ' + e.message);
        }
    }
    async getLayersByRol(idRol) {
        const query = `SELECT l.idlayer, l.titulo, tg.groupname, l.servicio, tl.idtocelement, te.idtocparent, 
      pr.idrol, pr.idpermissiontype, p.permissiontype
      FROM webapi.layer l
      INNER JOIN webapi.toc_layer tl
      ON l.idlayer = tl.idlayer
      INNER JOIN webapi.toc_element te
      ON tl.idtocelement = te.idtocelement
      INNER JOIN webapi.toc_group tg
      ON te.idtocparent = tg.idtocelement
      INNER JOIN webapi.permission_per_rol pr
      ON l.idlayer = pr.idvinculo
      INNER JOIN webapi.permission_type p
      ON pr.idpermissiontype = p.idpermissiontype
      WHERE p.permissiontype = 'layer'
      AND pr.idrol = $1
      ORDER BY tg.groupname, l.titulo
    ;`;
        try {
            const dbResponse = await this.cnnwb.any(query, [idRol]);
            const tocGroups = [];
            dbResponse.map((t) => {
                const index = tocGroups.findIndex((x) => x.group === t.groupname);
                if (index >= 0) {
                    tocGroups[index].tocLayers.push({
                        idLayer: t.idlayer,
                        capa: t.titulo,
                        service: t.servicio,
                        group: t.groupname,
                        idTocElement: t.idtocelement,
                    });
                }
                else {
                    tocGroups.push({
                        group: t.groupname,
                        idTocGroup: t.idtocparent,
                        idPermissionType: t.idpermissiontype,
                        permissionType: t.permissiontype,
                        idRol: t.idrol,
                        tocLayers: [
                            {
                                idLayer: t.idlayer,
                                capa: t.titulo,
                                service: t.servicio,
                                group: t.groupname,
                                idTocElement: t.idtocelement,
                            },
                        ],
                    });
                }
            });
            return tocGroups;
        }
        catch (e) {
            logger_1.default.error(`[Modulo: Toc][TocPGRepository: getLayersByRol] Error: %s`, e.message, e);
            throw new Error('Error al obtener capas por rol ' + e.message);
        }
    }
    async deleteLayersPermissions(idRol) {
        const query = `DELETE FROM webapi.permission_per_rol
      WHERE idrol = $1 AND idpermissiontype = '76ecb513-7ad0-4010-b43d-2bb3a7b03b7f';`;
        try {
            await this.cnnwb.none(query, [idRol]);
            return true;
        }
        catch (e) {
            logger_1.default.error(`[Modulo: Toc][TocPGRepository: deleteLayersPermissions] Error: %s`, e.message, e);
            throw new Error('Error al borrar permisos de capas ' + e.message);
        }
    }
    async addLayerPermission(idRol, idLayer) {
        const query = `INSERT INTO webapi.permission_per_rol(
      idrol, idvinculo, idpermissiontype)
      VALUES ($1, $2, '76ecb513-7ad0-4010-b43d-2bb3a7b03b7f')
      RETURNING idpermissionrol
    ;`;
        try {
            const dbResponse = await this.cnnwb.oneOrNone(query, [
                idRol,
                idLayer,
            ]);
            return dbResponse.idpermissionrol ? true : false;
        }
        catch (e) {
            logger_1.default.error(`[Modulo: Toc][TocPGRepository: addLayerPermission] Error: %s`, e.message, e);
            throw new Error('Error al insertar permiso de capa ' + e.message);
        }
    }
};
TocPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('webdbapp')),
    __param(1, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object, Object])
], TocPGRepository);
exports.TocPGRepository = TocPGRepository;
//# sourceMappingURL=toc.pg.repository.js.map