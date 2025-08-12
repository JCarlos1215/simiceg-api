"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
const response_codes_1 = require("@src/utils/response-codes");
const response_error_object_1 = require("@src/utils/response-error-object");
const response_object_1 = require("@src/utils/response-object");
const passport_1 = __importDefault(require("passport"));
const new_graph_1 = __importDefault(require("./models/new-graph"));
const graph_controller_1 = require("./graph.controller");
const graph_error_1 = require("./errors/graph.error");
/**
 * @apiIgnore
 * @api {post} /:idlayer Generate graph information
 * @apiName GetGraph
 * @apiGroup Graph
 * @apiDescription Obtiene la información para gráficar una capa del sistema
 *
 * @apiPermission graph:{idlayer}
 *
 * @apiHeader {String} authorization Token JWT de autenticacion
 *
 * @apiUse NewGraph
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {GraphData} data  Objeto de respuesta
 *
 * @apiUse GraphData
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 *
 */
router.post('/:idlayer/:type', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const graphOptions = await new_graph_1.default.validateAsync(req.body);
        const controller = tsyringe_1.container.resolve(graph_controller_1.GraphController);
        const data = await controller.getStadisticByIdLayer(req.params.idlayer, graphOptions, req.params.type);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Graph][POST /:idlayer/:type] Error: %s', err.message);
        if (err instanceof graph_error_1.GraphError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
//# sourceMappingURL=graph.router.js.map