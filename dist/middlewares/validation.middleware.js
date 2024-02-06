"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const validate = (schema) => (0, express_async_handler_1.default)((req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
        return next();
    }
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    next(new ApiError_1.default({ en: message, ar: message }, http_status_codes_1.StatusCodes.BAD_REQUEST));
});
exports.validate = validate;
