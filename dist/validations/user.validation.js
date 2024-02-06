"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAdminValidationSchema = exports.addRoleValidationSchema = exports.changedPasswordValidationSchema = exports.userUpdateValidationSchema = exports.userLoginValidationSchema = exports.userRegisterValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const user_interface_1 = require("../interfaces/user/user.interface");
const userValidator = joi_1.default.object({
    registrationType: joi_1.default.string()
        .valid("email", "phone")
        .alter({
        register: (schema) => schema.required(),
        login: (schema) => schema.required(),
    }),
    phone: joi_1.default.string().when("registrationType", {
        is: "email",
        then: joi_1.default.forbidden(),
        otherwise: joi_1.default.string().alter({
            register: (schema) => schema.required(),
            login: (schema) => schema.required(),
            update: (schema) => schema.forbidden(),
        }),
    }),
    email: joi_1.default.string().when("registrationType", {
        is: "phone",
        then: joi_1.default.forbidden(),
        otherwise: joi_1.default.string()
            .min(5)
            .max(255)
            .trim()
            .lowercase()
            .email()
            .alter({
            register: (schema) => schema.required(),
            login: (schema) => schema.required(),
            update: (schema) => schema.forbidden(),
        }),
    }),
    password: joi_1.default.string().when("registrationType", {
        is: "phone",
        then: joi_1.default.forbidden(),
        otherwise: joi_1.default.string()
            .min(6)
            .max(1024)
            .trim()
            .alter({
            register: (schema) => schema.required(),
            login: (schema) => schema.required(),
            update: (schema) => schema.optional(),
        }),
    }),
    name: joi_1.default.string().optional(),
    image: joi_1.default.string().min(5).optional(),
});
const changedPasswordValidationSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().min(6).max(255).trim().required(),
    newPassword: joi_1.default.string().min(6).max(255).trim().required(),
});
exports.changedPasswordValidationSchema = changedPasswordValidationSchema;
const userUpdateValidationSchema = userValidator.tailor("update");
exports.userUpdateValidationSchema = userUpdateValidationSchema;
const userRegisterValidationSchema = userValidator.tailor("register");
exports.userRegisterValidationSchema = userRegisterValidationSchema;
const userLoginValidationSchema = userValidator.tailor("login");
exports.userLoginValidationSchema = userLoginValidationSchema;
const addRoleValidationSchema = joi_1.default.object({
    role: joi_1.default.string()
        .valid(user_interface_1.Role.AdminA, user_interface_1.Role.AdminB, user_interface_1.Role.AdminC, user_interface_1.Role.SubAdmin)
        .required(),
});
exports.addRoleValidationSchema = addRoleValidationSchema;
const addAdminValidationSchema = joi_1.default.object({
    name: joi_1.default.string().max(50).trim().required(),
    email: joi_1.default.string().email().lowercase().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).max(1024).trim().required(),
    role: joi_1.default.string()
        .valid(user_interface_1.Role.AdminA, user_interface_1.Role.AdminB, user_interface_1.Role.AdminC, user_interface_1.Role.SubAdmin)
        .required(),
});
exports.addAdminValidationSchema = addAdminValidationSchema;
