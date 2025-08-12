"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    idLindero: joi_1.default.string().required(),
    idPredio: joi_1.default.string().required(),
    usuario: joi_1.default.string().required(),
    fecha: joi_1.default.date().required().allow(null),
    procesado: joi_1.default.boolean().required(),
    lado: joi_1.default.number().required(),
    distancia: joi_1.default.number().required(),
    geometry: joi_1.default.object().required(),
    distance: joi_1.default.string().required().allow(''),
    element: joi_1.default.number().required(),
    isDirected: joi_1.default.boolean().required(),
    needToClean: joi_1.default.boolean().required(),
});
exports.default = schema;
//# sourceMappingURL=lindero.js.map