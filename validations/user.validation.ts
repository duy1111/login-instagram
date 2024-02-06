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

const changedPasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(255).trim().required(),
  newPassword: Joi.string().min(6).max(255).trim().required(),
});

const userUpdateValidationSchema = userValidator.tailor("update");
const userRegisterValidationSchema = userValidator.tailor("register");
const userLoginValidationSchema = userValidator.tailor("login");

const addRoleValidationSchema = Joi.object({
  role: Joi.string()
    .valid(Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin)
    .required(),
});

const addAdminValidationSchema = Joi.object({
  name: Joi.string().max(50).trim().required(),
  email: Joi.string().email().lowercase().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).max(1024).trim().required(),
  role: Joi.string()
    .valid(Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin)
    .required(),
});

export {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  userUpdateValidationSchema,
  changedPasswordValidationSchema,
  addRoleValidationSchema,
  addAdminValidationSchema,
};
