"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersMiddleware = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_interface_1 = require("../../interfaces/user/user.interface");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const http_status_codes_1 = require("http-status-codes");
exports.getAllUsersMiddleware = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { role } = req.query;
    if (role === null || role === void 0 ? void 0 : role.includes("rootAdmin")) {
        return next(new ApiError_1.default({
            en: "You can't get root admins",
            ar: "لا يمكنك الحصول على المسؤولين الرئيسيين",
        }, http_status_codes_1.StatusCodes.FORBIDDEN));
    }
    const { fields } = req.query;
    if (role) {
        req.query.role = { $in: [...role.replace("rootAdmin", "").split(",")] };
    }
    if (!role) {
        req.query.role = {
            $in: [user_interface_1.Role.AdminA, user_interface_1.Role.AdminB, user_interface_1.Role.AdminC, user_interface_1.Role.SubAdmin, user_interface_1.Role.USER],
        };
    }
    req.query.fields =
        (fields ? fields : "") + ",name,email,phone,role,image,createdAt,-password";
    next();
});
