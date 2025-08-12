"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @apiDefine NewGraph
 * @apiParam (Body) {String} service
 * @apiParam (Body) {Array} graphOptions
 *
 * @apiParamExample {json} Request - Body:
 * {
 *    "service": "servicio",
 *    "graphOptions": {
 *        canGraph: true,
 *        options: [];
 *    }
 * }
 */
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    service: joi_1.default.string().required(),
    graphOptions: joi_1.default.required(),
});
exports.default = schema;
//# sourceMappingURL=new-graph.js.map