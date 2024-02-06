"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedTo = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const allowedTo = (...roles) => (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
        return next(new ApiError_1.default({
            en: "You Are Not Allowed To Access This Route",
            ar: "غير مصرح لك",
        }, http_status_codes_1.default.FORBIDDEN));
    }
    next();
});
exports.allowedTo = allowedTo;
