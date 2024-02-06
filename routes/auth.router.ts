import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { googlePassport} from '../utils/googleAuth';
import { facebookPassport } from '../utils/facebookAuth';
import { twitterPassport } from '../utils/twitterAuth';
import { authenticateWithGoogle,authenticateWithFacebook,authenticateWithTwitter, authenticateWithInstagram } from '../middlewares/passportAuth.middleware';
import { Request, Response } from "express";

import {
  userRegisterValidation,
  userLoginValidation,
  changedPasswordValidation,
  verifyCodeValidation,
  forgetPasswordValidation,
  verifyPasswordResetCodeValidation,
  resetPasswordValidation,
} from "../validations/auth.validator";
import {
  login,
  register,
  verifyCode,
  changePassword,
  createGuestUser,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} from "../controllers/auth.controller";
import expressAsyncHandler from "express-async-handler";
import { instagramPassport } from "../utils/instgramAuth";
const authRoute = Router();

authRoute
  .route("/register")
  .post(validate(userRegisterValidation), register);

authRoute
  .route("/login")
  .post(validate(userLoginValidation), login);

authRoute
  .route("/verifyCode")
  .post(validate(verifyCodeValidation), verifyCode);

authRoute
  .route("/createGuestUser")
  .post(createGuestUser);

authRoute
  .route("/changePassword")
  .put(protectedMiddleware, validate(changedPasswordValidation), changePassword);


authRoute
  .route("/forgetPassword")
  .post(validate(forgetPasswordValidation), forgetPassword);

authRoute
  .route("/verifyPasswordResetCode")
  .post(validate(verifyPasswordResetCodeValidation), verifyPasswordResetCode);

authRoute
  .route("/resetPassword")
  .put(validate(resetPasswordValidation), resetPassword);

authRoute.get('/google', authenticateWithGoogle);

authRoute.get(
  '/google/callback',
  googlePassport.authenticate('google',
    {
      session: false,

    }),
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json({ data: req.user });
  })
);

authRoute.get('/facebook', authenticateWithFacebook);

authRoute.get(
  '/facebook/callback',
  facebookPassport.authenticate('facebook',
    {
      session: false,

    }),
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json({ data: req.user });
  })
);

authRoute.get('/instagram', authenticateWithInstagram);

authRoute.get(
  '/instagram/callback',
  instagramPassport.authenticate('instagram',
    {
      session: false,

    }),
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json({ data: req.user });
  })
);

authRoute.get('/twitter', authenticateWithTwitter);

authRoute.get(
  '/twitter/callback',
  twitterPassport.authenticate('twitter'),
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json({ data: req.user });
  })
);

export default authRoute;
