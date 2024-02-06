"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(msg, statusCode) {
        super();
        this.msg = msg;
        this.statusCode = statusCode;
    }
}
exports.default = ApiError;
