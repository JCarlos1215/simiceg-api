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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(user) {
        return this.userService.createUser(user);
    }
    async changePassword(idUser, newPass) {
        return this.userService.changePassword(idUser, newPass);
    }
    async updateUser(editionUser) {
        return this.userService.updateUser(editionUser);
    }
    async deleteUser(idUser) {
        return this.userService.deleteUser(idUser);
    }
    async getUsers() {
        return this.userService.getUsers();
    }
    async getRols() {
        return this.userService.getRols();
    }
    async createRol(newRol) {
        return this.userService.createRol(newRol);
    }
    async updateRol(rol) {
        return this.userService.updateRol(rol);
    }
    async deleteRol(idRol) {
        return this.userService.deleteRol(idRol);
    }
    async getAllTools() {
        return this.userService.getAllTools();
    }
    async getToolsByRol(idRol) {
        return this.userService.getToolsByRol(idRol);
    }
    async saveToolPermissions(idRol, tools) {
        const res = await this.userService.deleteToolsPermissions(idRol);
        let resultInserts = [];
        if (res) {
            resultInserts = await Promise.all(tools.map(async (t) => {
                return await this.userService.addToolPermission(idRol, t.idTool);
            }));
        }
        return resultInserts;
    }
    async getPermissionsByRol(idRol) {
        return this.userService.getPermissionsByRol(idRol);
    }
    async getParams() {
        return this.userService.getParams();
    }
    async updateParam(params, userName) {
        /*let resultUpdates: boolean[] = [];
        resultUpdates = await Promise.all(
          params.map(async (p: Parameter) => {
            return await this.userService.updateParam(p, userName);
          })
        );
        return resultUpdates; */
        return this.userService.updateParam(params, userName);
    }
};
UserController = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map