"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protected_middleware_1 = require("../middlewares/protected.middleware");
const allowedTo_middleware_1 = require("../middlewares/allowedTo.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const user_interface_1 = require("../interfaces/user/user.interface");
const user_controller_1 = require("../controllers/user.controller");
const user_validation_1 = require("../validations/user.validation");
const userRouter = (0, express_1.Router)();
userRouter
    .route("/getAllAdmins")
    .get(protected_middleware_1.protectedMiddleware, (0, allowedTo_middleware_1.allowedTo)(user_interface_1.Role.RootAdmin, user_interface_1.Role.AdminA, user_interface_1.Role.AdminB, user_interface_1.Role.AdminC, user_interface_1.Role.SubAdmin), user_controller_1.getAllAdmins); //admin root 
userRouter
    .route("/")
    .get(protected_middleware_1.protectedMiddleware, user_controller_1.getAllUsers); //admin root admina adminb adminc subadmin
userRouter
    .route("/getAllAddressesForLoggedUser")
    .get(protected_middleware_1.protectedMiddleware, user_controller_1.getAllAddressesForLoggedUser);
userRouter
    .route("/updateLoggedUser")
    .put(protected_middleware_1.protectedMiddleware, user_controller_1.updateLoggedUser);
userRouter.route("/getMe").get(protected_middleware_1.protectedMiddleware, user_controller_1.getLoggedUser);
userRouter
    .route("/addAdmin")
    .post(protected_middleware_1.protectedMiddleware, (0, allowedTo_middleware_1.allowedTo)(user_interface_1.Role.RootAdmin, user_interface_1.Role.AdminA), (0, validation_middleware_1.validate)(user_validation_1.addAdminValidationSchema), user_controller_1.addAdmin);
userRouter
    .route("/:id")
    .get(protected_middleware_1.protectedMiddleware, user_controller_1.getUserById)
    .delete(protected_middleware_1.protectedMiddleware, (0, allowedTo_middleware_1.allowedTo)(user_interface_1.Role.RootAdmin, user_interface_1.Role.AdminA), user_controller_1.deleteUserById);
userRouter
    .route("/:id/addRole")
    .put(protected_middleware_1.protectedMiddleware, (0, allowedTo_middleware_1.allowedTo)(user_interface_1.Role.RootAdmin, user_interface_1.Role.AdminA, user_interface_1.Role.AdminB), (0, validation_middleware_1.validate)(user_validation_1.addRoleValidationSchema), user_controller_1.addRole);
userRouter
    .route("/deleteAddressForLoggedUser/:id")
    .delete(protected_middleware_1.protectedMiddleware, user_controller_1.deleteAddressForLoggedUserById);
exports.default = userRouter;
