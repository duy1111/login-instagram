"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_twitter_1 = require("passport-twitter");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("./ApiError"));
const user_model_1 = require("../models/user.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../config/config.env" });
exports.twitterPassport = passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: `0F7UEYXsDJmGnbf3R5ZAQMy9G`,
    consumerSecret: `yYvtfgozfGd03TFPpUPI44IsCo1nOg4WGziIZ0GHXOfPpBjBzD`,
    //accessToken: '1716813998698659840-nxausr07bUgEpiVtfivEwsosQpIgXk',
    //accessTokenSecret: 'vCJi4VgEX9CFVl9z4Gnh5A2foURWol1X7ADS35rgr1zL7',
    callbackURL: `${process.env.APP_URL}/api/v1/auth/twitter/callback`,
}, async (token, tokenSecret, profile, done) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        if (!profile) {
            return new ApiError_1.default({
                en: 'Twitter authentication failed',
                ar: 'فشل المصادقة من تويتر'
            }, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const existingUser = await user_model_1.User.findOne({ email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value });
        if (existingUser) {
            console.log('user is: ', existingUser);
            const token = existingUser.createToken();
            return done(null, { user: existingUser, token });
        }
        // User doesn't exist, create a new user
        const newUser = new user_model_1.User({
            email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
            name: profile.displayName,
            password: profile.id,
            image: (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
            registrationType: 'email',
        });
        const user = await newUser.save();
        return done(null, { user, token: user.createToken() });
    }
    catch (error) {
        throw new ApiError_1.default({ en: error.message, ar: error.message }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
