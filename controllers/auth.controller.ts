import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Status } from "../interfaces/status/status.enum";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { sendSMS, verifyCaller } from "../utils/twilioSendSMS";
// import { sendSMS } from "../utils/sendSMS";
import { sendEmail } from "../utils/sendEmail";


interface RegisterBodyInterface {
  registrationType: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface LoginBodyInterface {
  registrationType: string;
  email?: string;
  password?: string;
  phone?: string;
}

interface ChangePasswordInterface {
  oldPassword: string;
  newPassword: string;
}

export interface ForgetPasswordInterface {
  username: string;
}

export interface VerifyPasswordResetCodeInterface {
  resetCode: string;
}

export interface ResetPasswordInterface {
  username: string;
  newPassword: string;
}
// SMS Twilio
//const fromPhoneNumber = "+13306156837";  //"+9876543210"; // Replace with your Twilio number
const fromPhoneNumber = "+19206452477";  //"+9876543210"; // Replace with your Twilio number

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { registrationType, email, phone, password } =
      req.body as RegisterBodyInterface;

    if (registrationType === "email") {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new ApiError(
          {
            en: `User ${email} already exists`,
            ar: `موجود بالفعل ${email} المستخدم`,
          },
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.create(req.body);
      const token = user.createToken();
      res.status(StatusCodes.CREATED).json({
        status: Status.SUCCESS,
        success_en: "Registered successfully",
        success_ar: "تم التسجيل بنجاح",
        data: {
          email: user.email,
          name: user.name,
        },
        token,
      });
    } else if (registrationType === "phone") {
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        throw new ApiError(
          {
            en: `User ${phone} already exists`,
            ar: `موجود بالفعل ${phone} المستخدم`,
          },
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await User.create(req.body);

      // 2) If user exist, Generate Hash Random Reset Code (6 digits), and save it in dataBase
      // const verifiedCode = Math.floor(
      //   100000 + Math.random() * 900000
      // ).toString();
      const verifiedCode = "123456";
      const hashedResetCode = crypto
        .createHash("sha256")
        .update(verifiedCode)
        .digest("hex");

      // Save Hashed Password Reset Code Into DataBase
      user.verificationCode = hashedResetCode;

      // Add Expiration Time For Code Reset Password (15 min)
      user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.passwordResetVerified = false;

      await user.save();
      console.log("before start sms")
      // 3) send the reset code via SMS
      const messageBody = `Your Verification Code: ${verifiedCode}`;
      try {
        console.log("start sms")
        //await verifyCaller(req.body.phone)
        await sendSMS({
          from: fromPhoneNumber,
          to: req.body.phone,
          text: messageBody,
        });
      } catch (err) {
        console.log(err)
        user.verificationCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(
          new ApiError(
            {
              en: "There Is An Error In Sending SMS",
              ar: "هناك خطأ في إرسال الرسالة القصيرة",
            },
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        );
      }

      res.status(StatusCodes.CREATED).json({
        status: Status.SUCCESS,
        success_en: "Registered And send code successfully",
        success_ar: "تم التسجيل وارسال الكود بنجاح",
        data: user,
      });
    }
  }
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- take data from request body
    const { registrationType, email, phone } = req.body as LoginBodyInterface;

    if (registrationType === "email") {
      const user = await User.findOne({ email: email });

      if (!user) {
        return next(
          new ApiError(
            {
              en: `User ${email} not found`,
              ar: `غير موجود ${email} المستخدم`,
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // 3- check if password is correct
      const isMatch = user.comparePassword(req.body.password);
      console.log(isMatch);

      if (!isMatch) {
        return next(
          new ApiError(
            {
              en: `invalid email or password`,
              ar: `بريد إلكتروني أو كلمة مرور غير صالحة`,
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // 4- create token
      const token = user.createToken();

      // 5- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        success_en: "logged in successfully",
        success_ar: "تم تسجيل الدخول بنجاح",
        data: {
          email,
          name: user.name || "",
        },
        token,
      });
    } else if (registrationType === "phone") {
      const user = await User.findOne({ phone: phone });

      if (!user) {
        return next(
          new ApiError(
            {
              en: `User ${phone} not found`,
              ar: `غير موجود ${phone} المستخدم`,
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // 2) If user exist, Generate Hash Random Reset Code (6 digits), and save it in dataBase
      // const verifiedCode = Math.floor(
      //   100000 + Math.random() * 900000
      // ).toString();
      const verifiedCode = "123456";
      const hashedResetCode = crypto
        .createHash("sha256")
        .update(verifiedCode)
        .digest("hex");

      // Save Hashed Password Reset Code Into DataBase
      user.verificationCode = hashedResetCode;

      // Add Expiration Time For Code Reset Password (15 min)
      user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.passwordResetVerified = false;

      await user.save();

      // 3) send the reset code via email
      // const messageBody = `Your Verification Code: ${verifiedCode}`;
      // try {
      //   await sendSMS({
      //     from: "Reusable Store",
      //     to: req.body.phone,
      //     text: messageBody,
      //   });
      // } catch (err) {
      //   user.verificationCode = undefined;
      //   user.passwordResetExpires = undefined;
      //   user.passwordResetVerified = undefined;

      //   await user.save();
      //   return next(
      //     new ApiError(
      //       {
      //         en: "There Is An Error In Sending SMS",
      //         ar: "هناك خطأ في إرسال الرسالة القصيرة",
      //       },
      //       StatusCodes.INTERNAL_SERVER_ERROR
      //     )
      //   );
      // }

      // 5- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        success_en: "send code successfully",
        success_ar: "تم ارسال الكود بنجاح",
      });
    }
  }
);

// @desc    Verify Code
// @route   POST /api/v1/auth/verifyCode/
// @access  Public
export const verifyCode = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    const user = await User.findOne({
      verificationCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ApiError(
          {
            en: "not valid code",
            ar: "كود غير صالح",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const token = user.createToken();

    user.passwordResetVerified = true;

    await user.save();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "logged in successfully",
      success_ar: "تم تسجيل الدخول بنجاح",
      data: user,
      token,
    });
  }
);

// @desc    Change password
// @route   POST /api/v1/auth/changePassword
// @access  Public
export const changePassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- take date from request body
    const { oldPassword, newPassword } = req.body as ChangePasswordInterface;

    // 2- check if user already exit
    const user = await User.findById((req.user as any)!._id);
    if (!user) {
      return next(
        new ApiError(
          {
            en: `User not found`,
            ar: `المستخدم غير موجود`,
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 3- check old password is correct
    const isMatch = user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(
        new ApiError(
          {
            en: `invalid password`,
            ar: `كلمة مرور غير صالحة`,
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 4- update password
    user.password = newPassword;
    user.changePasswordAt = new Date();
    await user.save();

    // 5- create token
    const token = user.createToken();

    // 6- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "password updated successfully",
      success_ar: "تم تحديث كلمة المرور بنجاح",
      data: {
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
      token,
    });
  }
);

// @desc    createGuestUser
// @route   POST /api/v1/auth/createGuestUser
// @access  Public
export const createGuestUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const randomEmail = Math.random()
      .toString(36)
      .substring(7)
      .concat("_guest@guest.com");

    const user = await User.create({
      name: "guest",
      role: "guest",
      email: randomEmail,
    });

    const token = user.createGuestToken();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Guest Logged in successfully",
      success_ar: "تم تسجيل الدخول كضيف بنجاح",
      token,
    });
  }
);

export const forgetPassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body as ForgetPasswordInterface;

    // 1) Get User By Email
    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!user) {
      return next(
        new ApiError(
          {
            en: `There Is No User With That ${req.body.username}`,
            ar: `لا يوجد مستخدم بهذا ${req.body.username}`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2) If user exist, Generate Hash Random Reset Code (6 digits), and save it in dataBase
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Save Hashed Password Reset Code Into DataBase
    user.verificationCode = hashedResetCode;

    // Add Expiration Time For Code Reset Password (10 min)
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    user.passwordResetVerified = false;

    await user.save();

    // 3) send the reset code via email
    const messageBody = `Hi ${
      user.name.split(" ")[0]
    },\nVerification Code (${resetCode})`;

    // If Email Else Phone
    let messageResponseArabic = "";
    let messageResponseEnglish = "";
    if (username.includes("@")) {
      // 1) Send Email
      messageResponseEnglish = "Code Send Successfully, Check Your Email";
      messageResponseArabic = "تم إرسال الرمز بنجاح ، تحقق من بريدك الإلكتروني";
      try {
        await sendEmail({
          email: username,
          subject: "Your Code For Reset Password (Valid For 15 min)",
          message: messageBody,
        });
      } catch (err) {
        user.verificationCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(
          new ApiError(
            {
              en: "There Is An Error In Sending Email",
              ar: "هناك خطأ في إرسال البريد الإلكتروني",
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }
    } else {
      // 2) Send SMS
      messageResponseEnglish = "Code Send Successfully, Check Your SMS";
      messageResponseArabic = "تم إرسال الرمز بنجاح ، تحقق من الرسائل القصيرة الخاصة بك";
      const isSMSSend = await sendSMS({
        from: "Reuseable Store",
        to: req.body.phone,
        text: messageBody,
      });
      if (!isSMSSend) {
        user.verificationCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(
          new ApiError(
            {
              en: "There Is An Error In Sending SMS",
              ar: "هناك خطأ في إرسال الرسالة القصيرة",
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: messageResponseEnglish,
      success_ar: messageResponseArabic,
      data: {
        email: user.email,
      },
    });
  }
);

export const verifyPasswordResetCode = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetCode }: any = req.body as VerifyPasswordResetCodeInterface;
    // 1) Get User Based On Reset Code
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    const user = await User.findOne({
      verificationCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ApiError(
          {
            en: `Invalid Code`,
            ar: `رمز غير صالح`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2) Reset Code Valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Code Verified Successfully",
      success_ar: "تم التحقق من الرمز بنجاح",
      data: {
        email: user.email,
      },
    });
  }
);

export const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, newPassword }: any = req.body as ResetPasswordInterface;
    // 1) Get User Based On Email
    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!user) {
      return next(
        new ApiError(
          {
            en: `There Is No User With That ${req.body.username}`,
            ar: `لا يوجد مستخدم بهذا ${req.body.username}`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2) Check If Reset Code Verified
    if (!user.passwordResetVerified) {
      return next(
        new ApiError(
          {
            en: "Reset Code Not Verified",
            ar: "لم يتم التحقق من إعادة تعيين الرمز",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    user.password = newPassword;
    user.verificationCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 3) Generate Token
    const token = user.createToken();
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Password Reset Successfully",
      success_ar: "تم إعادة تعيين كلمة المرور بنجاح",
      data: username.includes("@")
        ? { email: user.email }
        : { phone: user.phone },
    });
  }
);
