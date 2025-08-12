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
exports.UserService = void 0;
const tsyringe_1 = require("tsyringe");
const user_pg_repository_1 = require("./repositories/user.pg.repository");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findUser(idUser) {
        return this.userRepository.getUserById(idUser);
    }
    async createUser(newUser) {
        return this.userRepository.saveUser(newUser);
    }
    async changePassword(idUser, newPass) {
        return this.userRepository.changePassword(idUser, newPass);
    }
    async updateUser(editionUser) {
        return this.userRepository.updateUser(editionUser);
    }
    async deleteUser(idUser) {
        return this.userRepository.deleteUser(idUser);
    }
    async getUsers() {
        return this.userRepository.getUsers();
    }
    async getRols() {
        return this.userRepository.getRols();
    }
    async createRol(newRol) {
        return this.userRepository.saveRol(newRol);
    }
    async updateRol(rol) {
        return this.userRepository.updateRol(rol);
    }
    async deleteRol(idRol) {
        return this.userRepository.deleteRol(idRol);
    }
    async getAllTools() {
        return this.userRepository.getAllTools();
    }
    async getToolsByRol(idRol) {
        return this.userRepository.getToolsByRol(idRol);
    }
    async deleteToolsPermissions(idRol) {
        return this.userRepository.deleteToolsPermissions(idRol);
    }
    async addToolPermission(idRol, idLayer) {
        return this.userRepository.addToolPermission(idRol, idLayer);
    }
    async getPermissionsByRol(idRol) {
        return this.userRepository.getPermissionsByRol(idRol);
    }
    async getParams() {
        return this.userRepository.getParams();
    }
    async updateParam(param, userName) {
        return this.userRepository.updateParam(param, userName);
    }
};
UserService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'UserRepository', useClass: user_pg_repository_1.UserPGRepository }]),
    __param(0, tsyringe_1.inject('UserRepository')),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map