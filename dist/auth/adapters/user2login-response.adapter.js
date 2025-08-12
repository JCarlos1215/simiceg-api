"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user2loginResponse = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = __importDefault(require("@src/utils/environment"));
function user2loginResponse(user) {
    return {
        idUser: user.idUser,
        username: user.username,
        token: jsonwebtoken_1.default.sign({ idUser: user.idUser }, environment_1.default.ACCESS_TOKEN_SECRET, { expiresIn: '8h' }),
        idRol: user.idRol,
        isAdmin: user.isAdmin,
        fullName: `${user.givenname} ${user.surname}`,
        job: user.job,
        company: user.company,
    };
}
exports.user2loginResponse = user2loginResponse;
//# sourceMappingURL=user2login-response.adapter.js.map