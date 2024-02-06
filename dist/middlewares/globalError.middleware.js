"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const status_enum_1 = require("../interfaces/status/status.enum");
const globalErrorMiddleware = async (err, req, res, next) => {
    const isPredicted = (err === null || err === void 0 ? void 0 : err.statusCode) && (err === null || err === void 0 ? void 0 : err.msg);
    const envExtra = process.env.NODE_ENV === "prod"
        ? {
            prod: {
                name: err.name,
                message: err.message,
            },
        }
        : {
            dev: {
                name: err.name,
                message: err.message,
                stack: err.stack,
            },
        };
    if (!isPredicted) {
        if (err.name === "JsonWebTokenError" || err.name === "jwt expired") {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(Object.assign({ status: status_enum_1.Status.ERROR, error_en: "Please login again", error_ar: "يرجى تسجيل الدخول مرة أخرى" }, envExtra));
        }
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(Object.assign({ status: status_enum_1.Status.ERROR, error_en: err.message, error_ar: err.message }, envExtra));
    }
    res.status(err.statusCode).json(Object.assign({ status: status_enum_1.Status.ERROR, error_en: err.msg.en, error_ar: err.msg.ar }, envExtra));
};
exports.globalErrorMiddleware = globalErrorMiddleware;
