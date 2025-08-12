"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseObject = void 0;
const response_object_1 = require("./response-object");
const response_codes_1 = require("./response-codes");
class ErrorResponseObject extends response_object_1.ResponseObject {
    constructor(errorMessage, errorType = response_codes_1.ERROR_CODE.SERVER_ERROR) {
        switch (errorType) {
            case response_codes_1.ERROR_CODE.BAD_REQUEST:
                super(errorMessage, 400, 'Bad Request');
                break;
            case response_codes_1.ERROR_CODE.UNAUTHORIZED:
                super(errorMessage, 401, 'Unauthorized');
                break;
            case response_codes_1.ERROR_CODE.FORBIDDEN:
                super(errorMessage, 403, 'Forbidden');
                break;
            case response_codes_1.ERROR_CODE.NOT_FOUND:
                super(errorMessage, 404, 'Not Found');
                break;
            case response_codes_1.ERROR_CODE.SERVER_ERROR:
            default:
                super(errorMessage, 500, 'Internal Server Error');
                break;
        }
    }
}
exports.ErrorResponseObject = ErrorResponseObject;
//# sourceMappingURL=response-error-object.js.map