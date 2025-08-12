"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    idUser: joi_1.default.string().required().allow(''),
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    createdAt: joi_1.default.date().required().allow(null, ''),
    idRol: joi_1.default.string().required(),
    rol: joi_1.default.string().required().allow(null, ''),
    isAdmin: joi_1.default.boolean().required(),
    givenname: joi_1.default.string().required(),
    surname: joi_1.default.string().required().allow(''),
    company: joi_1.default.string().required().allow(''),
    job: joi_1.default.string().required().allow(''),
});
exports.default = schema;
//# sourceMappingURL=user.js.map