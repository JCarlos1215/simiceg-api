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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPGRepository = void 0;
const bcrypt = require("bcrypt");
const tsyringe_1 = require("tsyringe");
const authentication_error_1 = require("../errors/authentication.error");
let AuthPGRepository = class AuthPGRepository {
    constructor(cnn) {
        this.cnn = cnn;
    }
    async findUser(loginData) {
        const query = `SELECT iduser, username, pass
      FROM webapi."user"
      WHERE username = $1
    ;`;
        try {
            const userData = await this.cnn.one(query, [loginData.username]);
            const match = await bcrypt.compare(loginData.password, userData.pass);
            if (!match) {
                throw new authentication_error_1.AuthenticationError('La contraseña no coincide');
            }
            return userData.iduser;
        }
        catch (err) {
            throw new authentication_error_1.AuthenticationError('Las credenciales proporcionadas no coinciden con ningun registro');
        }
    }
};
AuthPGRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('webdbapp')),
    __metadata("design:paramtypes", [Object])
], AuthPGRepository);
exports.AuthPGRepository = AuthPGRepository;
//# sourceMappingURL=auth.pg.repository.js.map