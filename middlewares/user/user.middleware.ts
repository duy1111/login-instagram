import expressAsyncHandler from "express-async-handler";
import { Role } from "../../interfaces/user/user.interface";
import ApiError from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const getAllUsersMiddleware = expressAsyncHandler(
  async (req, res, next) => {
    const { role } = req.query as { role: Role | undefined };

    if (role?.includes("rootAdmin")) {
      return next(
        new ApiError(
          {
            en: "You can't get root admins",
            ar: "لا يمكنك الحصول على المسؤولين الرئيسيين",
          },
          StatusCodes.FORBIDDEN
        )
      );
    }

    const { fields } = req.query as { fields: string | undefined };

    if (role) {
      req.query.role = { $in: [...role.replace("rootAdmin", "").split(",")] };
    }

    if (!role) {
      req.query.role = {
        $in: [Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin, Role.USER],
      };
    }

    req.query.fields =
      (fields ? fields : "") + ",name,email,phone,role,image,createdAt,-password";

    next();
  }
);
