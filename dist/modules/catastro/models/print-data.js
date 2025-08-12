"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    clave: joi_1.default.string().required(),
    typeGeom: joi_1.default.string().required(),
    sizePage: joi_1.default.string().required(),
    scala: joi_1.default.string().required(),
    personalScala: joi_1.default.number().required(),
    observation: joi_1.default.string().required().allow(null, ''),
});
exports.default = schema;
//# sourceMappingURL=print-data.js.map