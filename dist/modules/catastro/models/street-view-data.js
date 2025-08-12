"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    latitud: joi_1.default.number().required(),
    longitud: joi_1.default.number().required(),
    heading: joi_1.default.number().required(),
    pitch: joi_1.default.number().required(),
    zoom: joi_1.default.number().required(),
});
exports.default = schema;
//# sourceMappingURL=street-view-data.js.map