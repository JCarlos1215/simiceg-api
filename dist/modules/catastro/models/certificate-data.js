"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    applicant: joi_1.default.string().required(),
    folio: joi_1.default.string().required(),
    printer: joi_1.default.string().required(),
    capture: joi_1.default.string().required(),
    verify: joi_1.default.string().required(),
    hasCotaLegal: joi_1.default.boolean().required(),
});
exports.default = schema;
//# sourceMappingURL=certificate-data.js.map