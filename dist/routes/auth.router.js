"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const protected_middleware_1 = require("../middlewares/protected.middleware");
const googleAuth_1 = require("../utils/googleAuth");
const facebookAuth_1 = require("../utils/facebookAuth");
const twitterAuth_1 = require("../utils/twitterAuth");
const passportAuth_middleware_1 = require("../middlewares/passportAuth.middleware");
const auth_validator_1 = require("../validations/auth.validator");
const auth_controller_1 = require("../controllers/auth.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const instgramAuth_1 = require("../utils/instgramAuth");
const authRoute = (0, express_1.Router)();
authRoute
    .route("/register")
    .post((0, validation_middleware_1.validate)(auth_validator_1.userRegisterValidation), auth_controller_1.register);
authRoute
    .route("/login")
    .post((0, validation_middleware_1.validate)(auth_validator_1.userLoginValidation), auth_controller_1.login);
authRoute
    .route("/verifyCode")
    .post((0, validation_middleware_1.validate)(auth_validator_1.verifyCodeValidation), auth_controller_1.verifyCode);
authRoute
    .route("/createGuestUser")
    .post(auth_controller_1.createGuestUser);
authRoute
    .route("/changePassword")
    .put(protected_middleware_1.protectedMiddleware, (0, validation_middleware_1.validate)(auth_validator_1.changedPasswordValidation), auth_controller_1.changePassword);
authRoute
    .route("/forgetPassword")
    .post((0, validation_middleware_1.validate)(auth_validator_1.forgetPasswordValidation), auth_controller_1.forgetPassword);
authRoute
    .route("/verifyPasswordResetCode")
    .post((0, validation_middleware_1.validate)(auth_validator_1.verifyPasswordResetCodeValidation), auth_controller_1.verifyPasswordResetCode);
authRoute
    .route("/resetPassword")
    .put((0, validation_middleware_1.validate)(auth_validator_1.resetPasswordValidation), auth_controller_1.resetPassword);
authRoute.get('/google', passportAuth_middleware_1.authenticateWithGoogle);
authRoute.get('/google/callback', googleAuth_1.googlePassport.authenticate('google', {
    session: false,
}), (0, express_async_handler_1.default)(async (req, res) => {
    res.json({ data: req.user });
}));
authRoute.get('/facebook', passportAuth_middleware_1.authenticateWithFacebook);
authRoute.get('/facebook/callback', facebookAuth_1.facebookPassport.authenticate('facebook', {
    session: false,
}), (0, express_async_handler_1.default)(async (req, res) => {
    res.json({ data: req.user });
}));
authRoute.get('/instagram', passportAuth_middleware_1.authenticateWithInstagram);
authRoute.get('/instagram/callback', instgramAuth_1.instagramPassport.authenticate('instagram', {
    session: false,
}), (0, express_async_handler_1.default)(async (req, res) => {
    res.json({ data: req.user });
}));
authRoute.get('/twitter', passportAuth_middleware_1.authenticateWithTwitter);
authRoute.get('/twitter/callback', twitterAuth_1.twitterPassport.authenticate('twitter'), (0, express_async_handler_1.default)(async (req, res) => {
    res.json({ data: req.user });
}));
exports.default = authRoute;
