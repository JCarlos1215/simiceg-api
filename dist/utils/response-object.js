"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseObject = void 0;
class ResponseObject {
    constructor(data, status = 200, message = 'success') {
        this.data = data;
        this.statusCode = status;
        this.message = message;
    }
}
exports.ResponseObject = ResponseObject;
//# sourceMappingURL=response-object.js.map