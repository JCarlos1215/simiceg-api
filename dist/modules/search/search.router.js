"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const response_codes_1 = require("@src/utils/response-codes");
const response_error_object_1 = require("@src/utils/response-error-object");
const logger_1 = __importDefault(require("@src/utils/logger"));
const passport_1 = __importDefault(require("passport"));
const tsyringe_1 = require("tsyringe");
const search_controller_1 = require("./search.controller");
const response_object_1 = require("@src/utils/response-object");
const search_error_1 = require("./errors/search.error");
router.get('/', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const searchController = tsyringe_1.container.resolve(search_controller_1.SearchController);
        const searchTerm = String(req.query.filter) || '';
        const result = await searchController.doSearch(searchTerm);
        res.json(new response_object_1.ResponseObject(result));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Search][GET /] Error: %s', err.message);
        if (err instanceof search_error_1.SearchError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
//# sourceMappingURL=search.router.js.map