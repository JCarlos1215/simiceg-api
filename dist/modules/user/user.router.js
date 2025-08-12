"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const joi_1 = require("joi");
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("@src/utils/logger"));
const response_codes_1 = require("@src/utils/response-codes");
const response_error_object_1 = require("@src/utils/response-error-object");
const response_object_1 = require("@src/utils/response-object");
const user_controller_1 = require("./user.controller");
const duplicated_username_error_1 = require("./errors/duplicated-username.error");
const validation_params_error_1 = require("./errors/validation-params.error");
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("./models/user"));
const user_error_1 = require("./errors/user.error");
const rol_1 = __importDefault(require("./models/rol"));
/**
 * @api {post} /user Crea nuevo usuario
 * @apiName CreateUser
 * @apiGroup User
 * @apiDescription Crea un nuevo usuario en el sistema para entrar en visor.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://163.172.172.120/api-manzanillo/user
 * @apiPermission authenticated
 *
 * @apiHeader {String} authorization Token JWT de autenticación
 *
 * @apiUse NewUser
 * @apiUse User
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {User} data Objeto de respuesta
 *
 * @apiError (Error HTTP 400) ValidationError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 400) DuplicatedUsernameError El usuario esta duplicado por lo que ya existe en el sistema.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post('/', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const newUser = await user_1.default.validateAsync(req.body);
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const userCreated = await controller.createUser(newUser);
            res.status(201).json(new response_object_1.ResponseObject(userCreated));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Auth][POST /] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_username_error_1.DuplicatedUsernameError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.put('/', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const editionUser = await user_1.default.validateAsync(req.body);
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const userEdited = await controller.updateUser(editionUser);
            res.json(new response_object_1.ResponseObject(userEdited));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][PUT /] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_username_error_1.DuplicatedUsernameError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
/**
 * @api {post} /user/:idUser/password Cambia la contraseña de un usuario.
 * @apiName ChangePassword
 * @apiGroup User
 * @apiDescription Cambia el password de un usuario del sistema.
 * @apiVersion 0.0.1
 * @apiSampleRequest http://163.172.172.120/api-manzanillo/user/:idUser/password
 * @apiPermission authenticated
 *
 * @apiHeader {String} authorization Token JWT de autenticacion
 *
 * @apiParam (Params) idUser **Requerido** Cadena con el identificador del usuario a cambiar contraseña.
 * @apiParam (Body) {String} password Nueva contraseña para el usuario
 *
 * @apiUse User
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess {User} user Objeto de respuesta
 *
 * @apiError (Error HTTP 400) ValidationParamsUserError Los datos proporcionados estan incompletos o no son del tipo correcto.
 * @apiError (Error HTTP 401) AuthenticationError Las credenciales de acceso proporcionadas no corresponden con ningun usuario.
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 */
router.post('/:idUser/password', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
        const newPassword = req.body.password;
        if (newPassword) {
            const user = await controller.changePassword(req.params.idUser, newPassword);
            res.json(new response_object_1.ResponseObject(user));
        }
        else {
            throw new validation_params_error_1.ValidationParamsUserError('Se necesita el parametro password');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Auth][POST /:iduser/password] Error: %s', err.message);
        if (err instanceof validation_params_error_1.ValidationParamsUserError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(err.message, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.delete('/:idUser', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const result = await controller.deleteUser(req.params.idUser);
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][DELETE /:idUser] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_username_error_1.DuplicatedUsernameError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    const userController = tsyringe_1.container.resolve(user_controller_1.UserController);
    try {
        if (user.isAdmin) {
            const data = await userController.getUsers();
            res.json(new response_object_1.ResponseObject(data));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (e) {
        logger_1.default.error('[Modulo: User][GET /] Error', e.message, e);
        if (e instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/rol', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    const userController = tsyringe_1.container.resolve(user_controller_1.UserController);
    try {
        if (user.isAdmin) {
            const data = await userController.getRols();
            res.json(new response_object_1.ResponseObject(data));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (e) {
        logger_1.default.error('[Modulo: User][GET /rol] Error', e.message, e);
        if (e instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/rol', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const newRol = await rol_1.default.validateAsync(req.body);
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const result = await controller.createRol(newRol);
            res.status(201).json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][POST /rol] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_username_error_1.DuplicatedUsernameError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.put('/rol', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const editionRol = await rol_1.default.validateAsync(req.body);
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const result = await controller.updateRol(editionRol);
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][PUT /rol] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_username_error_1.DuplicatedUsernameError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.delete('/rol/:idRol', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const result = await controller.deleteRol(req.params.idRol);
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][DELETE /rol/:idRol] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_username_error_1.DuplicatedUsernameError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/tools', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const result = await controller.getAllTools();
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][GET /tools] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/tools/:rol', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const result = await controller.getToolsByRol(req.params.rol);
            res.json(new response_object_1.ResponseObject(result));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][GET /tools/:rol] Error: %s', err.message);
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
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const data = req.body.toolPermissions;
            const resultData = await controller.saveToolPermissions(req.body.idRol, data);
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
        logger_1.default.error(err, '[Modulo: User][POST /permissions] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/permissions', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
        const resultData = await controller.getPermissionsByRol(user.idRol);
        res.json(new response_object_1.ResponseObject(resultData));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][POST /permissions] Error: %s', err.message);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/param', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    const userController = tsyringe_1.container.resolve(user_controller_1.UserController);
    try {
        if (user.isAdmin) {
            const data = await userController.getParams();
            res.json(new response_object_1.ResponseObject(data));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (e) {
        logger_1.default.error('[Modulo: User][GET /group] Error', e.message, e);
        if (e instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.put('/param', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        if (user.isAdmin) {
            const data = req.body.parameter;
            const controller = tsyringe_1.container.resolve(user_controller_1.UserController);
            const resultData = await controller.updateParam(data, user.username);
            /*let finalResult = false;
            for (let i = 0; i < resultData.length; i++) {
              if (resultData[i]) {
                finalResult = true;
              } else {
                finalResult = false;
                break;
              }
            }*/
            res.json(new response_object_1.ResponseObject(resultData));
        }
        else {
            throw new user_error_1.UserError('No es usuario administrador');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: User][PUT /param] Error: %s', err.message);
        if (err instanceof user_error_1.UserError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
//# sourceMappingURL=user.router.js.map