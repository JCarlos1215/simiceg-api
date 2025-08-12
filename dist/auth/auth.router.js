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
const joi_1 = require("joi");
const response_object_1 = require("@src/utils/response-object");
const response_codes_1 = require("@src/utils/response-codes");
const login_request_1 = __importDefault(require("./models/login.request"));
const response_error_object_1 = require("@src/utils/response-error-object");
const authentication_error_1 = require("./errors/authentication.error");
const authorization_error_1 = require("./errors/authorization.error");
const logger_1 = __importDefault(require("@src/utils/logger"));
const auth_controller_1 = require("./auth.controller");
const user2login_response_adapter_1 = require("./adapters/user2login-response.adapter");
const validation_auth_error_1 = require("./errors/validation-auth.error");
const passport_1 = __importDefault(require("passport"));
/**
 * @api {post} /auth Autentifica usuario
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiDescription Autentica al usuario y le responde con un token <code>JWT</code> que podra utilizar para acceder a los recursos protegidos.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://163.172.172.120/api-manzanillo/auth
 *
 * @apiUse LoginRequest
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {LoginResponse} data Objeto de respuesta
 *
 * @apiUse User
 * @apiUse LoginResponse
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post('/', async (req, res) => {
    try {
        const loginData = await login_request_1.default.validateAsync(req.body);
        const controller = tsyringe_1.container.resolve(auth_controller_1.AuthController);
        const user = await controller.login(loginData);
        const loginResponse = user2login_response_adapter_1.user2loginResponse(user);
        res.json(new response_object_1.ResponseObject(loginResponse));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Auth][POST /] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof authentication_error_1.AuthenticationError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
/**
 * @api {delete} /auth Cierra la sesión del usuario
 * @apiName LogoutUser
 * @apiGroup Auth
 * @apiDescription Elimina la sesion del usuario.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://163.172.172.120/api-manzanillo/auth
 * @apiPermission authenticated
 *
 * @apiHeader {String} authorization Token JWT de autenticación
 * @apiUse User
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {String} data  `'Success'`
 *
 * @apiError (Error HTTP 400) ValidationError El token no es correcto.
 * @apiError (Error HTTP 401) AuthorizationError No hay un usuario autenticado.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.delete('/', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            const controller = tsyringe_1.container.resolve(auth_controller_1.AuthController);
            await controller.logout(user);
            res.json(new response_object_1.ResponseObject(`Success`));
        }
        else {
            throw new validation_auth_error_1.ValidationAuthError('No se cuenta con token no ha iniciado sesión');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Auth][DELETE /] Error: %s', err.message);
        if (err instanceof validation_auth_error_1.ValidationAuthError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof authorization_error_1.AuthorizationError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
//# sourceMappingURL=auth.router.js.map