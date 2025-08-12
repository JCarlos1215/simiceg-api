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
exports.UserPGRepository = void 0;
const bcrypt = require("bcrypt");
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
const duplicated_username_error_1 = require("../errors/duplicated-username.error");
let UserPGRepository = class UserPGRepository {
    constructor(cnn, cnngeo) {
        this.cnn = cnn;
        this.cnngeo = cnngeo;
    }
    async getUserById(idUser) {
        const query = `SELECT u.iduser, username, created, u.idrol, rol, isadmin, givenname, surname, company, job
      FROM webapi."user" u
      INNER JOIN webapi."user_detail" d
      ON u.iduser = d.iduser
      LEFT JOIN webapi."rol" r
      ON u.idrol = r.idrol
      WHERE u.iduser = $1
    ;`;
        try {
            const userData = await this.cnn.one(query, [idUser]);
            return this.createUserFromDBResponse(userData);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][getUserById] Error: %s`, err.message);
            throw err;
        }
    }
    async saveUser(user) {
        const queryInsert = `INSERT INTO webapi."user"(
      username, pass, idrol, isadmin)
      VALUES ($1, $2, $3, $4)
      RETURNING iduser
    ;`;
        const queryDetail = `INSERT INTO webapi."user_detail"(
      iduser, givenname, surname, company, job)
      VALUES ($1, $2, $3, $4, $5)
    ;`;
        try {
            const pass = bcrypt.hashSync(user.password, 10);
            const dbResponse = await this.cnn.oneOrNone(queryInsert, [
                user.username,
                pass,
                user.idRol,
                user.isAdmin,
            ]);
            await this.cnn.oneOrNone(queryDetail, [dbResponse.iduser, user.givenname, user.surname, user.company, user.job]);
            return this.getUserById(dbResponse.iduser);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][saveUser] Error: %s`, err.message);
            if (err.code === '23505' || err.code === 23505) {
                throw new duplicated_username_error_1.DuplicatedUsernameError('El nombre de usuario ya existe');
            }
            else {
                throw new Error('Error al insertar usuario');
            }
        }
    }
    async changePassword(idUser, password) {
        const sqlQuery = `UPDATE webapi."user" 
      SET pass = $2 
      WHERE iduser = $1
      RETURNING iduser
    ;`;
        try {
            const pass = bcrypt.hashSync(password, 10);
            const user = await this.cnn.oneOrNone(sqlQuery, [idUser, pass]);
            return this.getUserById(user.iduser);
        }
        catch (e) {
            logger_1.default.error('[Modulo: User][UserPGRepository: changePassword] Error', e.message, e);
            throw new Error('Error al actualizar');
        }
    }
    async updateUser(user) {
        let queryUser = `UPDATE webapi."user" SET
      username = '${user.username}',  
      idrol = '${user.idRol}',
      isadmin = ${user.isAdmin}
    `;
        user.password !== '*****' ? (queryUser += `, pass = '${bcrypt.hashSync(user.password, 10)}' `) : false;
        queryUser += `WHERE iduser = '${user.idUser}'`;
        const queryDetail = `UPDATE webapi."user_detail" SET
      givenname = $1, 
      surname = $2, 
      company = $3, 
      job = $4
      WHERE iduser = $5
    ;`;
        try {
            await this.cnn.oneOrNone(queryUser);
            await this.cnn.oneOrNone(queryDetail, [user.givenname, user.surname, user.company, user.job, user.idUser]);
            return this.getUserById(user.idUser);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][updateUser] Error: %s`, err.message);
            if (err.code === '23505' || err.code === 23505) {
                throw new duplicated_username_error_1.DuplicatedUsernameError('El nombre de usuario ya existe');
            }
            else {
                throw new Error('Error al actualizar usuario');
            }
        }
    }
    async deleteUser(idUser) {
        const queryDeleteDetail = `DELETE FROM webapi.user_detail WHERE iduser = $1;`;
        const queryDeleteUser = `DELETE FROM webapi."user" WHERE iduser = $1;`;
        try {
            await this.cnn.none(queryDeleteDetail, [idUser]);
            await this.cnn.none(queryDeleteUser, [idUser]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][deleteUser] Error: %s`, err.message);
            throw err;
        }
    }
    async getUsers() {
        const query = `SELECT u.iduser, username, created, u.idrol, rol, isadmin, givenname, surname, company, job
      FROM webapi."user" u
      INNER JOIN webapi."user_detail" d
      ON u.iduser = d.iduser
      LEFT JOIN webapi."rol" r
      ON u.idrol = r.idrol
      ORDER BY rol, surname, givenname, created DESC
    ;`;
        try {
            const users = await this.cnn.any(query);
            return users.map((u) => this.createUserFromDBResponse(u));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][getUsers] Error: %s`, err.message);
            throw err;
        }
    }
    async getRols() {
        const query = `SELECT idrol, rol
      FROM webapi.rol
      ORDER BY rol
    ;`;
        try {
            const rows = await this.cnn.any(query);
            return rows.map((r) => this.createRolFromDBResponse(r));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][getRols] Error: %s`, err.message);
            throw err;
        }
    }
    async getRolById(idRol) {
        const query = `SELECT idrol, rol
      FROM webapi.rol
      WHERE idrol = $1
    ;`;
        try {
            const rolData = await this.cnn.oneOrNone(query, [idRol]);
            return this.createRolFromDBResponse(rolData);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][getRolById] Error: %s`, err.message);
            throw err;
        }
    }
    async saveRol(newRol) {
        const queryInsert = `INSERT INTO webapi.rol(
      rol)
      VALUES ($1)
      RETURNING idrol
    ;`;
        try {
            const dbResponse = await this.cnn.oneOrNone(queryInsert, [newRol.rolName]);
            return this.getRolById(dbResponse.idrol);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][saveRol] Error: %s`, err.message);
            if (err.code === '23505' || err.code === 23505) {
                throw new duplicated_username_error_1.DuplicatedUsernameError('El nombre del rol ya existe');
            }
            else {
                throw new Error('Error al insertar rol');
            }
        }
    }
    async updateRol(rol) {
        const query = `UPDATE webapi.rol SET 
      rol = $1
      WHERE idrol = $2
    ;`;
        try {
            await this.cnn.none(query, [rol.rolName, rol.idRol]);
            return this.getRolById(rol.idRol);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][updateRol] Error: %s`, err.message);
            if (err.code === '23505' || err.code === 23505) {
                throw new duplicated_username_error_1.DuplicatedUsernameError('El nombre del rol ya existe');
            }
            else {
                throw new Error('Error al actualizar rol');
            }
        }
    }
    async deleteRol(idRol) {
        const queryDelete = `DELETE FROM webapi.rol WHERE idrol = $1;`;
        try {
            await this.cnn.none(queryDelete, [idRol]);
            return true;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][deleteRol] Error: %s`, err.message);
            throw err;
        }
    }
    async getAllTools() {
        const query = `SELECT idtool, nombre, descripcion, codigo, grupo 
      FROM webapi.tool 
      ORDER BY grupo, nombre
  ;`;
        try {
            const dbResponse = await this.cnn.any(query);
            const toolGroups = [];
            dbResponse.map((g) => {
                const index = toolGroups.findIndex((x) => x.group === g.grupo);
                if (index >= 0) {
                    toolGroups[index].tools.push({
                        idTool: g.idtool,
                        name: g.nombre,
                        description: g.descripcion,
                        code: g.codigo,
                    });
                }
                else {
                    toolGroups.push({
                        group: g.grupo,
                        idPermissionType: '',
                        permissionType: '',
                        idRol: '',
                        tools: [
                            {
                                idTool: g.idtool,
                                name: g.nombre,
                                description: g.descripcion,
                                code: g.codigo,
                            },
                        ],
                    });
                }
            });
            return toolGroups;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: User][UserPGRepository][getAllTools] Error: %s`, e.message);
            throw new Error('Error al obtener herramientas ' + e.message);
        }
    }
    async getToolsByRol(idRol) {
        const query = `SELECT t.idtool, t.nombre, t.descripcion, t.codigo, t.grupo, pr.idrol, pr.idpermissiontype, p.permissiontype 
      FROM webapi.tool t
      INNER JOIN webapi.permission_per_rol pr
      ON t.idtool = pr.idvinculo
      INNER JOIN webapi.permission_type p
      ON pr.idpermissiontype = p.idpermissiontype
      WHERE p.permissiontype = 'tool'
      AND pr.idrol = $1
      ORDER BY t.grupo, t.nombre
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [idRol]);
            const toolGroups = [];
            dbResponse.map((g) => {
                const index = toolGroups.findIndex((x) => x.group === g.grupo);
                if (index >= 0) {
                    toolGroups[index].tools.push({
                        idTool: g.idtool,
                        name: g.nombre,
                        description: g.descripcion,
                        code: g.codigo,
                    });
                }
                else {
                    toolGroups.push({
                        group: g.grupo,
                        idPermissionType: g.idpermissiontype,
                        permissionType: g.permissiontype,
                        idRol: g.idrol,
                        tools: [
                            {
                                idTool: g.idtool,
                                name: g.nombre,
                                description: g.descripcion,
                                code: g.codigo,
                            },
                        ],
                    });
                }
            });
            return toolGroups;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: User][UserPGRepository][getToolsByRol] Error: %s`, e.message);
            throw new Error('Error al obtener herramientas por rol ' + e.message);
        }
    }
    async deleteToolsPermissions(idRol) {
        const query = `DELETE FROM webapi.permission_per_rol
      WHERE idrol = $1 AND idpermissiontype = '395d530c-eb31-45e4-aa34-a6f6eb1d25a7';`;
        try {
            await this.cnn.none(query, [idRol]);
            return true;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: User][UserPGRepository][deleteToolsPermissions] Error: %s`, e.message);
            throw new Error('Error al borrar permisos de herramientas ' + e.message);
        }
    }
    async addToolPermission(idRol, idTool) {
        const query = `INSERT INTO webapi.permission_per_rol(
      idrol, idvinculo, idpermissiontype)
      VALUES ($1, $2, '395d530c-eb31-45e4-aa34-a6f6eb1d25a7')
      RETURNING idpermissionrol
    ;`;
        try {
            const dbResponse = await this.cnn.oneOrNone(query, [
                idRol,
                idTool,
            ]);
            return dbResponse.idpermissionrol ? true : false;
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: User][UserPGRepository][addToolPermission] Error: %s`, e.message);
            throw new Error('Error al insertar permiso de herramienta ' + e.message);
        }
    }
    async getPermissionsByRol(idRol) {
        const query = `SELECT t.idtool, t.nombre, t.descripcion, t.codigo, t.grupo, pr.idrol, pr.idpermissiontype, p.permissiontype 
      FROM webapi.tool t
      INNER JOIN webapi.permission_per_rol pr
      ON t.idtool = pr.idvinculo
      INNER JOIN webapi.permission_type p
      ON pr.idpermissiontype = p.idpermissiontype
      WHERE p.permissiontype = 'tool'
      AND pr.idrol = $1
      ORDER BY t.grupo, t.nombre
    ;`;
        try {
            const dbResponse = await this.cnn.any(query, [idRol]);
            return dbResponse.map((t) => this.createToolPermissionFromDBResponse(t));
        }
        catch (e) {
            logger_1.default.error(e, `[Modulo: User][UserPGRepository][getPermissionsByRol] Error: %s`, e.message);
            throw new Error('Error al obtener herramientas por rol ' + e.message);
        }
    }
    async getParams() {
        const query = `SELECT idparametro, nombre, descripcion, valor, fecha, usuario
      FROM edicion.parametros
      ORDER BY nombre
    ;`;
        try {
            const rows = await this.cnngeo.any(query);
            return rows.map((p) => this.createParameterFromDBResponse(p));
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][getParams] Error: %s`, err.message);
            throw err;
        }
    }
    async getParamById(idParameter) {
        const query = `SELECT idparametro, nombre, descripcion, valor, fecha, usuario
      FROM edicion.parametros
      WHERE idparametro = $1
    ;`;
        try {
            const paramData = await this.cnngeo.oneOrNone(query, [
                idParameter,
            ]);
            return this.createParameterFromDBResponse(paramData);
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][getParamById] Error: %s`, err.message);
            throw err;
        }
    }
    async updateParam(parameter, userName) {
        const query = `UPDATE edicion.parametros SET 
      valor = $1,
      fecha = now(), 
      usuario = $2
      WHERE idparametro = $3
      RETURNING idparametro
    ;`;
        try {
            const dbResponse = await this.cnngeo.oneOrNone(query, [
                parameter.value,
                userName,
                parameter.idParameter,
            ]);
            return dbResponse.idparametro ? true : false;
        }
        catch (err) {
            logger_1.default.error(err, `[Modulo: User][UserPGRepository][updateParam] Error: %s`, err.message);
            throw new Error('Error al actualizar parámetro');
        }
    }
    createUserFromDBResponse(userRow) {
        return {
            idUser: userRow.iduser,
            username: userRow.username,
            password: '',
            createdAt: userRow.created,
            idRol: userRow.idrol ? userRow.idrol : '',
            rol: userRow.rol,
            isAdmin: userRow.isadmin,
            givenname: userRow.givenname,
            surname: userRow.surname,
            company: userRow.company,
            job: userRow.job,
        };
    }
    createRolFromDBResponse(rol) {
        return {
            idRol: rol.idrol,
            rolName: rol.rol,
        };
    }
    createToolPermissionFromDBResponse(tool) {
        return {
            idTool: tool.idtool,
            name: tool.nombre,
            description: tool.descripcion,
            code: tool.codigo,
        };
    }
    createParameterFromDBResponse(param) {
        return {
            idParameter: param.idparametro,
            parameterName: param.nombre,
            description: param.descripcion,
            value: +param.valor,
            dateChange: param.fecha ? new Date(param.fecha) : new Date(),
            user: param.usuario,
        };
    }
};
UserPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('webdbapp')),
    __param(1, tsyringe_1.inject('geodb')),
    __metadata("design:paramtypes", [Object, Object])
], UserPGRepository);
exports.UserPGRepository = UserPGRepository;
//# sourceMappingURL=user.pg.repository.js.map