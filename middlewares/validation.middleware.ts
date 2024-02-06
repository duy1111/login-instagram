import expressAsyncHandler from "express-async-handler";
import { NextFunction, Response, Request } from "express";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const validate = (schema: any) =>
  expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      return next();
    }

    const { details } = error;

    const message = details.map((i: any) => i.message).join(",");

    next(new ApiError({ en: message, ar: message }, StatusCodes.BAD_REQUEST));
});