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
const joi_1 = require("joi");
const toc_controller_1 = require("./toc.controller");
const validation_params_toc_error_1 = require("./errors/validation-params-toc.error");
const passport_1 = __importDefault(require("passport"));
const refresh_option_1 = __importDefault(require("./models/refresh-option"));
const user_error_1 = require("../user/errors/user.error");
/**
 * @apiIgnore
 * @api {get} / Return toc
 * @apiName GetToc
 * @apiGroup Toc
 * @apiDescription Obtiene la información del toc para un usuario segun su rol
 *
 * @apiPermission toc:{}
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
router.get('/', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            const controller = tsyringe_1.container.resolve(toc_controller_1.TocController);
            const toc = await controller.getToc(user.idRol, true);
            res.json(new response_object_1.ResponseObject(toc));
        }
        else {
            throw new validation_params_toc_error_1.ValidationParamsTocError('No se cuenta con token no ha iniciado sesión');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Toc][GET /] Error: %s', err.message);
        if (err instanceof validation_params_toc_error_1.ValidationParamsTocError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/update-layer', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(toc_controller_1.TocController);
        const updateLayer = await refresh_option_1.default.validateAsync(req.body);
        const result = await controller.updateLayerToc(updateLayer);
        res.json(new response_object_1.ResponseObject(result));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Toc][POST /update-layer] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/layers', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(toc_controller_1.TocController);
            const result = await controller.getAllLayers();
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Toc][GET /layers] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/layers/:rol', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(toc_controller_1.TocController);
            const result = await controller.getLayersByRol(req.params.rol);
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Toc][GET /layers/:rol] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/permissions', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(toc_controller_1.TocController);
            const data = req.body.tocLayers;
            const resultData = await controller.saveLayerPermissions(req.body.idRol, data);
            let finalResult = false;
            for (let i = 0; i < resultData.length; i++) {
                if (resultData[i]) {
                    finalResult = true;
                }
                else {
                    finalResult = false;
                    break;
                }
            }
            res.json(new response_object_1.ResponseObject(finalResult));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Toc][POST /permissions] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
//# sourceMappingURL=toc.router.js.map