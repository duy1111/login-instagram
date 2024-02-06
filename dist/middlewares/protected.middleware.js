"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedMiddleware = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_model_1 = require("../models/user.model");
exports.protectedMiddleware = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b;
    // check if there is a token in the request header and it starts with Bearer
    const isTokenExist = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer");
    if (!isTokenExist) {
        return next(new ApiError_1.default({
            en: "please login to first to get access",
            ar: "يرجى تسجيل الدخول أولاً",
        }, http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    // get the token from the request header
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    // verify the token
    const JWT_SECRET = process.env.JWT_SECRET;
    const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    // get the user id from the decoded token
    const userId = decodedToken._id;
    // get the user from the database
    const user = await user_model_1.User.findById(userId);
    // check if the user exists
    if (!user) {
        return next(new ApiError_1.default({
            en: "you are not authorized",
            ar: "غير مصرح لك",
        }, http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    // check if the user changed the password after the token was issued
    const isPasswordChanged = user.changePasswordAt.getTime() > decodedToken.iat * 1000;
    if (isPasswordChanged) {
        return next(new ApiError_1.default({
            en: "session expired, please login again",
            ar: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",
        }, http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    // add the user to the request object
    req.user = user;
    // go to the next middleware
    next();
});
