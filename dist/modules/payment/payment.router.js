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
const payment_controller_1 = require("./payment.controller");
const payment_error_1 = require("./errors/payment.error");
const passport_1 = __importDefault(require("passport"));
const manzana_controller_1 = require("../catastro/controllers/manzana.controller");
/**
 * @apiIgnore
 * @api {post} / Return predio data water
 * @apiName GetPredioWater
 * @apiGroup Water
 * @apiDescription Obtiene la información predio para un punto geométrico
 *
 * @apiHeader {String} authorization Token JWT de autenticacion
 *
 * @apiSuccess {String} message Mensaje de respuesta
 * @apiSuccess {Number} statusCode Codigo de respuesta
 * @apiSuccess data  Objeto de respuesta
 *
 * @apiError (Error HTTP 500) ServerError Error al momento de procesar la solicitud.
 *
 */
router.post('/debt-col', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const paymentController = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        if (req.body.x && req.body.y) {
            const predioDebts = await paymentController.getDebtByPoint(req.body.x, req.body.y);
            res.json(new response_object_1.ResponseObject({ total: predioDebts.length, predios: predioDebts }));
        }
        else {
            throw new payment_error_1.PaymentError('Se necesita el parámetro del punto x, y');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Payment][POST /debt] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/paid-col', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const paymentController = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        if (req.body.x && req.body.y) {
            const predioPaids = await paymentController.getPaidByPoint(req.body.x, req.body.y);
            res.json(new response_object_1.ResponseObject({ total: predioPaids.length, predios: predioPaids }));
        }
        else {
            throw new payment_error_1.PaymentError('Se necesita el parámetro del punto x, y');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Payment][POST /paid] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/debt-mnz', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const manzanaController = tsyringe_1.container.resolve(manzana_controller_1.ManzanaController);
        const paymentController = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        if (req.body.x && req.body.y) {
            const manzanaData = await manzanaController.getManzanaByPoint(req.body.x, req.body.y);
            if (manzanaData.length > 0) {
                const predioDebts = await paymentController.getDebtByManzana(manzanaData[0]);
                res.json(new response_object_1.ResponseObject({ total: predioDebts.length, predios: predioDebts }));
            }
            else {
                throw new payment_error_1.PaymentError('No hay manzana en el punto x, y');
            }
        }
        else {
            throw new payment_error_1.PaymentError('Se necesita el parámetro del punto x, y');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Payment][POST /debt] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/paid-mnz', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const manzanaController = tsyringe_1.container.resolve(manzana_controller_1.ManzanaController);
        const paymentController = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        if (req.body.x && req.body.y) {
            const manzanaData = await manzanaController.getManzanaByPoint(req.body.x, req.body.y);
            if (manzanaData.length > 0) {
                const predioPaids = await paymentController.getPaidByManzana(manzanaData[0]);
                res.json(new response_object_1.ResponseObject({ total: predioPaids.length, predios: predioPaids }));
            }
            else {
                throw new payment_error_1.PaymentError('No hay manzana en el punto x, y');
            }
        }
        else {
            throw new payment_error_1.PaymentError('Se necesita el parámetro del punto x, y');
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Payment][POST /paid] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/paid-col/:colonia', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        const data = await controller.getPaidReportXCol(req.params.colonia);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /paid-col/:colonia] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/debt-col/:colonia', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        const data = await controller.getDebtReportxCol(req.params.colonia);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /debt-col/:colonia] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/paid-mnz/:manzana', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        const data = await controller.getPaidReportXMnz(req.params.manzana);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /paid-mnz/:manzana] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/debt-mnz/:manzana', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
        const data = await controller.getDebtReportxMnz(req.params.manzana);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Avaluo][GET /debt-mnz/:manzana] Error: %s', err.message);
        if (err instanceof payment_error_1.PaymentError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
//# sourceMappingURL=payment.router.js.map