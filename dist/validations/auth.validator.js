"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.verifyPasswordResetCodeValidation = exports.forgetPasswordValidation = exports.verifyCodeValidation = exports.changedPasswordValidation = exports.userLoginValidation = exports.userRegisterValidation = exports.userUpdateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
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
exports.userUpdateValidation = userValidator.tailor("update");
exports.userRegisterValidation = userValidator.tailor("register");
exports.userLoginValidation = userValidator.tailor("login");
exports.changedPasswordValidation = joi_1.default.object({
    oldPassword: joi_1.default.string().min(6).max(255).trim().required(),
    newPassword: joi_1.default.string().min(6).max(255).trim().required(),
});
exports.verifyCodeValidation = joi_1.default.object({
    code: joi_1.default.string().trim().required().min(6).max(6),
});
exports.forgetPasswordValidation = joi_1.default.object({
    username: joi_1.default.string().trim().required(),
});
exports.verifyPasswordResetCodeValidation = joi_1.default.object({
    resetCode: joi_1.default.string().trim().required().min(6).max(6),
});
exports.resetPasswordValidation = joi_1.default.object({
    username: joi_1.default.string().trim().required(),
    newPassword: joi_1.default.string().trim().required().min(6).max(255),
});
