"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgHelpers = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const options = { promiseLib: bluebird_1.default };
const pgp = pg_promise_1.default(options);
const connections = {};
exports.pgHelpers = pgp.helpers;
exports.default = {
    connect: (connectionString) => {
        if (connections[connectionString]) {
            return connections[connectionString];
        }
        connections[connectionString] = pgp(connectionString);
        return connections[connectionString];
    },
};
//# sourceMappingURL=database.js.map