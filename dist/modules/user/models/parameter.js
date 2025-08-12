"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    idParameter: joi_1.default.string().required(),
    parameterName: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    value: joi_1.default.number().required(),
    dateChange: joi_1.default.date().required(),
    user: joi_1.default.string().required().allow(null, ''),
});
exports.default = schema;
//# sourceMappingURL=parameter.js.map