"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressLogger = exports.logger = void 0;
const pinoExpress = require("express-pino-logger");
const pino_1 = __importDefault(require("pino"));
const environment_1 = __importDefault(require("./environment"));
exports.logger = pino_1.default({ enabled: environment_1.default.LOG_ENABLED });
exports.expressLogger = pinoExpress({
    logger: exports.logger,
});
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map