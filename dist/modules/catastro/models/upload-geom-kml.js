"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required().allow(''),
    kml: joi_1.default.string().required(),
});
exports.default = schema;
//# sourceMappingURL=upload-geom-kml.js.map