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
const sicam_controller_1 = require("./sicam.controller");
router.get('/manzana/:clave', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(sicam_controller_1.SICAMController);
        const data = await controller.getPredioSICAM(req.params.clave);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: SICAM][GET /manzana/:clave] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/data/:tipo/:cuenta/:clave', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(sicam_controller_1.SICAMController);
        const data = await controller.getSICAMData(req.params.tipo, +req.params.cuenta, req.params.clave);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: SICAM][GET /data/:tipo/:cuenta/:clave] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/certificado/:folio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(sicam_controller_1.SICAMController);
        const data = await controller.getCertificateData(+req.params.folio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: SICAM][GET /certificado/:folio] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/avaluo', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(sicam_controller_1.SICAMController);
        const data = await controller.createAvaluoSICAM(req.body.idpredio, user.username, req.body.folio, req.body.observation, +req.body.year);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: SICAM][POST /avaluo] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/report/ficha/:idpredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(sicam_controller_1.SICAMController);
        const data = await controller.getFichaTecnica(req.params.idpredio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /report/ficha/:idpredio] Error: %s', err.message);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
//# sourceMappingURL=sicam.router.js.map