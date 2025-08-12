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
const avaluo_controller_1 = require("./avaluo.controller");
const avaluo_error_1 = require("./errors/avaluo.error");
/**
 * @apiIgnore
 * @api {post} /:idlayer/:type Generate graph information
 * @apiName GetAvaluo
 * @apiGroup Avaluo
 * @apiDescription Obtiene la información para gráficar una capa del sistema
 *
 * @apiPermission graph:{idlayer}
 *
 * @apiHeader {String} authorization Token JWT de autenticacion
 *
 * @apiUse NewAvaluo
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {AvaluoData} data  Objeto de respuesta
 *
 * @apiUse AvaluoData
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post('/simple', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.executeIndividualAvaluo(req.body.idPredio, user.username);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][POST /simple] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/referido', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.executeReferredAvaluo(req.body.idPredio, user.username, +req.body.year);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][POST /referido] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/multiple', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.executeMultipleAvaluo(req.body.idPredio, req.body.layer, user.username);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][POST /multiple] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/has-avaluo/:clave', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.hasAvaluo(req.params.clave);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /has-avaluo/:clave] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/:idpredio/data', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.getAvaluoData(req.params.idpredio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /:idpredio/data] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/referido/:idpredio/:year', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.getReferredAvaluoData(req.params.idpredio, +req.params.year);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /referido/:idpredio/:year] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/report/:idpredio/:type', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.getReportAvaluo(req.params.idpredio, user, req.params.type);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /report/:idpredio] Error: %s', err.message);
        if (err instanceof avaluo_error_1.AvaluoError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
/*router.get(
  '/report/referido/:idpredio/:year',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user: User = req.user as User;
      const controller = container.resolve(AvaluoController);
      const data = await controller.getReportAvaluo(req.params.idpredio, user, +req.params.year);
      res.json(new ResponseObject(data));
    } catch (err) {
      logger.error(err, '[Modulo: Avaluo][GET /report/referido/:idpredio/:year] Error: %s', err.message);
      if (err instanceof AvaluoError) {
        res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .json(new ErrorResponseObject(`No se pudo procesar su solicitud`, ERROR_CODE.SERVER_ERROR));
      }
    }
  }
);*/
router.get('/referido/has-avaluo/:idpredio/:year', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.hasReferredAvaluo(req.params.idpredio, +req.params.year);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /referido/has-avaluo/:idpredio/:year] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.delete('/multiple', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(avaluo_controller_1.AvaluoController);
        const data = await controller.deleteMultipleAvaluo();
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][DELETE /multiple] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
//# sourceMappingURL=avaluo.router.js.map