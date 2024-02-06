import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import { Role } from "../interfaces/user/user.interface";
import statusCodes from "http-status-codes";

// @desc      Authorization (User Permissions) ["SuperAdmin", "AdminA", "AdminB", "AdminC", "SubAdmin", "User"]
type Roles = Role[];
export const allowedTo = (...roles: Roles) => expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes((req.user as any)!.role)) {
            return next(
                new ApiError(
                    {
                        en: "You Are Not Allowed To Access This Route",
                        ar: "غير مصرح لك",
                    },
                    statusCodes.FORBIDDEN
                )
            );
        }
        next();
    }
);

