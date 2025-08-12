"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv-safe");
dotenv.config();
exports.default = {
    LOG_ENABLED: !(process.env.LOG_ENABLED === 'false'),
    STRING_CONNECTION: process.env.DB_CONNECTION,
    WEBDB_CONNECTION: process.env.WEBDB_CONNECTION,
    BASE_PATH: process.env.CWD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    GEOSERVER: process.env.GEOSERVER,
    GEOSERVER_AUTH: process.env.GEOSERVER_AUTH,
};
//# sourceMappingURL=environment.js.map