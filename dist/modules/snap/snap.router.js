"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const logger_1 = __importDefault(require("@src/utils/logger"));
const response_object_1 = require("@src/utils/response-object");
const snap_controller_1 = require("./snap.controller");
const response_codes_1 = require("@src/utils/response-codes");
const response_error_object_1 = require("@src/utils/response-error-object");
const tsyringe_1 = require("tsyringe");
const passport_1 = __importDefault(require("passport"));
router.get('/layers', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(snap_controller_1.SnapController);
        const layers = await controller.getAvailableLayers();
        res.json(new response_object_1.ResponseObject(layers));
    }
    catch (e) {
        logger_1.default.error('[Modulo: SNAP][GET /] Error', e.message, e);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject('Server Error', response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/:idlayer/query', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const bbox = req.query.bbox.split(',').map((x) => parseFloat(x));
        const scale = parseFloat(req.query.scale);
        if (bbox.length === 4) {
            const controller = tsyringe_1.container.resolve(snap_controller_1.SnapController);
            const results = await controller.getSnapGeometriesForLayer(req.params.idlayer, bbox, scale);
            res.json(new response_object_1.ResponseObject(results));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject('Bad request', response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
    }
    catch (e) {
        logger_1.default.error('[Modulo: SNAP][GET /:idlayer/query] Error', e.message, e);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject('Server Error', response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
//# sourceMappingURL=snap.router.js.map