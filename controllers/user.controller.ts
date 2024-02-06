import expressAsyncHandler from "express-async-handler";
import { User } from "../models/user.model";
import { Role } from "../interfaces/user/user.interface";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Status } from "../interfaces/status/status.enum";
import { IQuery } from "../interfaces/factory/factory.interface";
import { ApiFeatures } from "../utils/ApiFeatures";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

// @desc     Get All Users
// @route    GET/api/v1/users
// @access   Private (Root) TODO: add the rest of the roles
export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //  1- find all data
    const query = req.query as IQuery;
    const mongoQuery = User.find({ role: "user" }).select("-password");

    // 2- create pagination
    const { data, paginationResult } = await new ApiFeatures(mongoQuery, query)
      .populate()
      .filter()
      .limitFields()
      .search()
      .sort()
      .paginate();
    if (data.length === 0) {
      return next(
        new ApiError(
          { en: "not found", ar: "غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- create populate all without password
    // const WithPagination = await mongooseQuery.find({ role: "user" });

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      results: data.length,
      paginationResult,
      data: data,
      success_en: "found successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

export const getAllAdmins = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //  1- find all data
    const query = req.query as IQuery;
    const users = User.find({
      role: {
        $in: [Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin],
      },
    }).select("-password");

    // 2- create pagination
    const { data, paginationResult } = await new ApiFeatures(users, query)
      .populate()
      .filter()
      .limitFields()
      .search()
      .sort()
      .paginate();

    // 3- create populate all without password
    // const WithPagination = await mongooseQuery.find({
    //   role: {
    //     $in: [Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin],
    //   },
    // });

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      results: data.length,
      paginationResult,
      data: data,
      success_en: "found successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

// @desc     Get User By Id
// @route    GET/api/v1/users/:id
// @access   Private (Root) TODO: add the rest of the roles
export const getUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id,
      role: {
        $ne: Role.RootAdmin,
      },
    }).select("-password -changePasswordAt");

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "User found successfully",
      success_ar: "تم العثور على المستخدم بنجاح",
    });
  }
);

// @desc     Update Logged User
// @route    PUT/api/v1/users/:id
// @access   Private (Logged)
export const updateLoggedUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check on password
    if (req.body.password)
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
    else if (!req.body.password) delete req.body.password;

    // 2) check on email
    if (req.body.email && (req.user as any)!.email) delete req.body.email;
    else if (req.body.email && !(req.user as any)!.email) {
      const userExists = await User.findOne({
        email: req.body.email,
      });
      if (userExists) {
        return next(
          new ApiError(
            {
              en: "This email used in another account",
              ar: "هذا البريد الإلكتروني مستخدم في حساب آخر",
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    // 3) check on phone
    if (req.body.phone && (req.user as any)!.phone) delete req.body.phone;
    else if (req.body.phone && !(req.user as any)!.phone) {
      const userExists = await User.findOne({
        phone: req.body.phone,
      });
      if (userExists) {
        return next(
          new ApiError(
            {
              en: "This phone used in another account",
              ar: "هذا الهاتف مستخدم في حساب آخر",
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: (req.user as any)!._id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "User updated successfully",
      success_ar: "تم تحديث المستخدم بنجاح",
    });
  }
);

// @desc     add admin with role
// @route    POST/api/v1/users/addAdmin
// @access   Private (Root)
export const addAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password, role } = req.body;

    // check if user exists
    const userExists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (userExists) {
      return next(
        new ApiError(
          {
            en: "User already exists",
            ar: "المستخدم موجود بالفعل",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    const { password: pass, changePasswordAt, ...rest } = user.toObject();

    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: {
        ...rest,
      },
      success_en: "Admin added successfully",
      success_ar: "تم إضافة المشرف بنجاح",
    });
  }
);

// @desc     Add Role To User
// @route    PUT/api/v1/users/:id/addRole
// @access   Private (Root)
export const addRole = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;

    if (role === Role.RootAdmin) {
      return next(
        new ApiError(
          {
            en: "You can't add RootAdmin role",
            ar: "لا يمكنك إضافة دور RootAdmin",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await User.findOne({
      _id: id,
      role: {
        $ne: Role.RootAdmin,
      },
    });

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    user.role = role;
    await user.save();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "Role added successfully",
      success_ar: "تم إضافة الدور بنجاح",
    });
  }
);

// @desc     Delete User By Id
// @route    DELETE/api/v1/users/:id
// @access   Private (Root) TODO: add the rest of the roles
export const deleteUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const loggedRole = (req.user as any)?.role;
    const wantDelete = await User.findById({ _id: id });
    if (wantDelete?.role === "adminA" && loggedRole === "adminB") {
      return next(
        new ApiError(
          {
            en: "You can't delete this user",
            ar: "لا يمكنك حذف هذا المستخدم",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    const user = await User.findOneAndDelete({
      _id: id,
      role: {
        $ne: Role.RootAdmin,
      },
    });

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: null,
      success_en: "User deleted successfully",
      success_ar: "تم حذف المستخدم بنجاح",
    });
  }
);

// @desc     Get Logged User
// @route    GET/api/v1/users/me
// @access   Private (User/Admins)
export const getLoggedUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: (req.user as any)!._id });

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "User found successfully",
      success_ar: "تم العثور على المستخدم بنجاح",
    });
  }
);

export const getAllAddressesForLoggedUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const addresses = await User.findById((req!.user as any)?._id);
    if (!addresses) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (addresses.addressesList.length < 1) {
      return next(
        new ApiError(
          { en: "Addresses not found", ar: "العناوين غير موجودة" },
          StatusCodes.NOT_FOUND
        )
      );
    }
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: addresses.addressesList,
      success_en: "User found successfully",
      success_ar: "تم العثور على المستخدم بنجاح",
    });
  }
);

export const deleteAddressForLoggedUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: (req.user as any)!._id },
      {
        $pull: { addressesList: { _id: id } },
      },
      { new: true }
    );

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Address Delete Successfully",
      success_ar: "تم حذف العنوان بنجاح",
    });
  }
);
