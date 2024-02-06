import Joi from "joi";
import { Role } from "../interfaces/user/user.interface";

const userValidator = Joi.object({
  registrationType: Joi.string()
    .valid("email", "phone")
    .alter({
      register: (schema) => schema.required(),
      login: (schema) => schema.required(),
    }),
  phone: Joi.string().when("registrationType", {
    is: "email",
    then: Joi.forbidden(),
    otherwise: Joi.string().alter({
      register: (schema) => schema.required(),
      login: (schema) => schema.required(),
      update: (schema) => schema.forbidden(),
    }),
  }),
  email: Joi.string().when("registrationType", {
    is: "phone",
    then: Joi.forbidden(),
    otherwise: Joi.string()
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
  password: Joi.string().when("registrationType", {
    is: "phone",
    then: Joi.forbidden(),
    otherwise: Joi.string()
      .min(6)
      .max(1024)
      .trim()
      .alter({
        register: (schema) => schema.required(),
        login: (schema) => schema.required(),
        update: (schema) => schema.optional(),
      }),
  }),
  name: Joi.string().optional(),
  image: Joi.string().min(5).optional(),
});


export const userUpdateValidation = userValidator.tailor("update");
export const userRegisterValidation = userValidator.tailor("register");
export const userLoginValidation = userValidator.tailor("login");

export const changedPasswordValidation = Joi.object({
    oldPassword: Joi.string().min(6).max(255).trim().required(),
    newPassword: Joi.string().min(6).max(255).trim().required(),
});

export const verifyCodeValidation = Joi.object({
    code: Joi.string().trim().required().min(6).max(6),
});

export const forgetPasswordValidation = Joi.object({
    username: Joi.string().trim().required(),
}) 

export const verifyPasswordResetCodeValidation = Joi.object({
    resetCode: Joi.string().trim().required().min(6).max(6),
});

export const resetPasswordValidation = Joi.object({
    username: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required().min(6).max(255),
});