import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";

export const protectedMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if there is a token in the request header and it starts with Bearer
    const isTokenExist = req.headers.authorization?.startsWith("Bearer");
    if (!isTokenExist) {
      return next(
        new ApiError(
          {
            en: "please login to first to get access",
            ar: "يرجى تسجيل الدخول أولاً",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // get the token from the request header
    const token = req.headers.authorization?.split(" ")[1];

    // verify the token
    const JWT_SECRET = process.env.JWT_SECRET;

    const decodedToken: any = jwt.verify(token!, JWT_SECRET!);

    // get the user id from the decoded token
    const userId = decodedToken._id;

    // get the user from the database
    const user = await User.findById(userId);

    // check if the user exists
    if (!user) {
      return next(
        new ApiError(
          {
            en: "you are not authorized",
            ar: "غير مصرح لك",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // check if the user changed the password after the token was issued
    const isPasswordChanged =
      user.changePasswordAt!.getTime() > decodedToken.iat * 1000;

    if (isPasswordChanged) {
      return next(
        new ApiError(
          {
            en: "session expired, please login again",
            ar: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // add the user to the request object
    req.user = user;

    // go to the next middleware
    next();
  }
);


