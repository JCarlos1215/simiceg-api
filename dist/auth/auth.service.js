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
exports.AuthService = void 0;
const tsyringe_1 = require("tsyringe");
const user_service_1 = require("@src/modules/user/user.service");
const auth_pg_repository_1 = require("./repositories/auth.pg.repository");
let AuthService = class AuthService {
    constructor(authRepository, userService) {
        this.authRepository = authRepository;
        this.userService = userService;
    }
    async authenticate(loginData) {
        const userId = await this.authRepository.findUser(loginData);
        const user = await this.userService.findUser(userId);
        return user;
    }
};
AuthService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'AuthRepository', useClass: auth_pg_repository_1.AuthPGRepository }]),
    __param(0, tsyringe_1.inject('AuthRepository')),
    __metadata("design:paramtypes", [Object, user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map