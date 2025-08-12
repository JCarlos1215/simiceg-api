"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
const passport_1 = __importDefault(require("passport"));
const passport_http_bearer_1 = require("passport-http-bearer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = require("dotenv-safe");
dotenv.config();
const logger_1 = __importStar(require("./utils/logger"));
const response_codes_1 = require("./utils/response-codes");
const response_error_object_1 = require("./utils/response-error-object");
const response_object_1 = require("./utils/response-object");
const api_1 = require("./api");
const database_1 = __importDefault(require("./utils/database"));
const environment_1 = __importDefault(require("./utils/environment"));
const user_service_1 = require("./modules/user/user.service");
class App {
    constructor() {
        this.middleware = () => {
            this.express.set('trust proxy', true);
            this.express.use(compression_1.default());
            this.express.use(cookie_parser_1.default());
            this.express.use(body_parser_1.default.json());
            this.express.use(body_parser_1.default.urlencoded({ extended: false }));
            this.express.use(helmet_1.default());
            this.express.use(logger_1.expressLogger);
            this.express.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
            this.express.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', process.env.ENV === 'PROD' ? process.env.ALLOW_ORIGIN : req.headers.origin);
                res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                res.header('Access-Control-Allow-Credentials', 'true');
                next();
            });
        };
        this.routes = () => {
            this.express.use('/api', api_1.router);
            this.express.get('/', (req, res) => {
                res.json(new response_object_1.ResponseObject(`Welcome to APP skeleton.`));
            });
        };
        this.error404 = () => {
            this.express.use((req, res) => {
                res.status(response_codes_1.ERROR_CODE.NOT_FOUND).json(new response_error_object_1.ErrorResponseObject('Not Found', response_codes_1.ERROR_CODE.NOT_FOUND));
            });
        };
        this.error = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.express.use((err, req, res, _next) => {
                logger_1.default.error(err, 'General Error Handler');
                res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(err.message, response_codes_1.ERROR_CODE.SERVER_ERROR));
            });
        };
        tsyringe_1.container.register('geodb', {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            useFactory: (_) => {
                return database_1.default.connect(environment_1.default.STRING_CONNECTION);
            },
        });
        tsyringe_1.container.register('webdbapp', {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            useFactory: (_) => {
                return database_1.default.connect(environment_1.default.WEBDB_CONNECTION);
            },
        });
        passport_1.default.use(new passport_http_bearer_1.Strategy((token, done) => {
            const tokenData = jsonwebtoken_1.default.verify(token, environment_1.default.ACCESS_TOKEN_SECRET);
            const userService = tsyringe_1.container.resolve(user_service_1.UserService);
            userService
                .findUser(tokenData.idUser)
                .then((user) => {
                done(null, user);
            })
                .catch((err) => {
                done(err, null);
            });
        }));
        this.express = express_1.default();
        this.middleware();
        this.routes();
        this.error();
        this.error404();
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map