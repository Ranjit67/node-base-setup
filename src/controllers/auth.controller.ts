import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
  Conflict,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "http-errors";
import { fieldValidateError } from "../helper";
import { ForgetSchema, UserSchema } from "../models";
import {
  EmailService,
  JwtService,
  MediaStoreService,
  PasswordHasServices,
} from "../services";
import { MIDDLEWARE_REQUEST_TYPE } from "../types";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        role,
        password,
        name,
        email,
        countryCode,
        phoneNumber,
        gender,
        deviceName,
        status,
        assignBlockId,
        districtId,
        panchayatId,
        villageId,
      } = req.body;
      fieldValidateError(req);

      const avatarRawData = req?.files?.avatar
        ? ((await new MediaStoreService().upload({
            file: req?.files?.avatar,
            dir: "User",
          })) as {
            key: string;
            Location: string;
          })
        : undefined;

      const checkDuplicate = await UserSchema.findOne({ email });
      if (checkDuplicate) throw new Conflict("This email is already exit.");
      // const findBlock =
      //   assignBlockId && role === "GROUND-STAFF"
      //     ? await BlockSchema.findById(assignBlockId)
      //     : undefined;

      const userRegister = await UserSchema.create({
        role,
        password,
        name,
        email,
        countryCode,
        phoneNumber,
        deviceName,
        gender,
        status,
        assignBlock: assignBlockId,
        avatar: avatarRawData?.key,
        avatarPath: avatarRawData?.Location,
        district: districtId,
        panchayat: panchayatId,
        village: villageId,
      });
      if (!userRegister)
        throw new InternalServerError("Something, user not created.");
      // email send
      await new EmailService().emailSend({
        emails: email,
        subject: "New user add",
        message: `Hi ${name}
        your username: ${email}
        and password: ${password}`,
      });
      //
      res.json({
        success: {
          message: "User register successfully.",
          data: userRegister,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      fieldValidateError(req);

      let user = await UserSchema.findOne({
        email,
      });

      if (!user) throw new NotFound("Username and password are incorrect.");

      const isPasswordMatch = user.password
        ? await new PasswordHasServices().compare(password, user.password)
        : undefined;

      if (!isPasswordMatch) throw new NotFound("Password is incorrect.");
      const token = await new JwtService().accessTokenGenerator(
        JSON.stringify({
          userId: user._id,
          role: user.role,
          status: user.status,
        })
      );
      if (!token) throw new Unauthorized("Token generate failed.");
      user.password = undefined;
      res.json({
        success: {
          data: {
            token,
            user,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async self(req: MIDDLEWARE_REQUEST_TYPE, res: Response, next: NextFunction) {
    const userId = req?.payload?.userId;
    const findUserData = await UserSchema.findOne({ _id: userId }).select(
      "-password -__v "
    );

    res.json({
      success: {
        data: findUserData,
      },
    });
  }
  async changePassword(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req?.payload?.userId;
      const { oldPassword, newPassword } = req.body;
      fieldValidateError(req);
      let user = await UserSchema.findById(userId);

      if (!user) throw new NotFound("Username and password are incorrect.");

      const isPasswordMatch = user.password
        ? await new PasswordHasServices().compare(oldPassword, user.password)
        : undefined;
      if (!isPasswordMatch) throw new NotFound("Password is incorrect.");

      const hashPassword = await new PasswordHasServices().hash(newPassword);

      const updateUser = await UserSchema.findByIdAndUpdate(
        userId,
        {
          password: hashPassword,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateUser)
        throw new NotFound("Something went wrong, Password not updated.");
      res.json({
        success: {
          message: "Password change successfully.",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  // Forget password
  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      fieldValidateError(req);
      const findUser = await UserSchema.findOne({ email });
      if (!findUser) throw new NotFound("User not Found.");
      const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

      // crateAndUpdate forgat
      const createAndUpdate = await ForgetSchema.findOneAndUpdate(
        { user: findUser?._id },
        {
          otp,
        },
        { runValidators: true, upsert: true }
      );

      // email send
      await new EmailService().emailSend({
        emails: email,
        subject: "Forget password",
        message: `Hi ${findUser?.name}
          Important!! Don't share your otp
          your otp is ${otp}. OTP valid for 15 minutes.`,
      });

      const token = await new JwtService().accessTokenGenerator(
        JSON.stringify({
          userId: findUser._id,
          role: findUser.role,
          status: findUser.status,
          otp: true,
        })
      );
      if (!token) throw new Unauthorized("Token generate failed.");
      res.json({
        success: {
          message: "OTP is send to your email, Please check your email.",
          data: {
            token,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async forgetPasswordOtpVerify(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { otp, password } = req.body;
      fieldValidateError(req);
      const user = req?.payload?.userId;
      const findForgetPassword = await ForgetSchema.findOne({ user });
      if (!findForgetPassword?.otp) throw new NotFound("Your otp has expired.");

      if (findForgetPassword?.otp !== parseInt(otp))
        throw new Conflict("Yor otp is not match.");
      const hashPassword = await new PasswordHasServices().hash(password);

      const updateUser = await UserSchema.findByIdAndUpdate(
        user,
        {
          password: hashPassword,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateUser)
        throw new NotFound("Something went wrong, Password not set.");
      const deleteForget = await ForgetSchema.findOneAndDelete({ user });
      res.json({
        success: {
          message: "Password set successfully.",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const AuthControllerValidator = {
  register: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("name is required.")
      .isLength({ min: 3 })
      .withMessage("name must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("name must be at most 50 characters long."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required.")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("password must be at most 50 characters long."),
    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required.")
      .isEmail()
      .withMessage("Invalid mail id")
      .normalizeEmail()
      .isLength({ min: 3 })
      .withMessage("email must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("email must be at most 50 characters long."),

    body("countryCode").not().isEmpty().withMessage("countryCode is required."),
    body("phoneNumber").not().isEmpty().withMessage("phoneNumber is required."),
    body("gender")
      .not()
      .isEmpty()
      .withMessage("gender is required.")
      .exists()
      .toUpperCase()
      .custom((value, { req }) =>
        ["MALE", "FEMALE"].some((item) => item === value)
      )
      .withMessage("gender must be MALE or FEMALE."),
    body("role")
      .not()
      .isEmpty()
      .withMessage("role is required.")
      .toUpperCase()
      .exists()
      .custom((value, { req }) =>
        ["SUPER-ADMIN", "ADMIN"].some((item) => item === value)
      )
      .withMessage("role must be SUPER-ADMIN or ADMIN.")
      .custom((value, { req }) => {
        if (value !== "GROUND-STAFF") return true;
        if (req?.body?.assignBlockId && req?.body?.districtId) return true;

        return false;
      })
      .withMessage(
        "For the GROUND-STAFF assignBlockId, districtId are required."
      ),
    body("deviceName")
      .optional()
      .isLength({ min: 1 })
      .withMessage("deviceName must be at least 1 character.")
      .isLength({ max: 250 })
      .withMessage("deviceName must be at most 50 character."),
    body("status")
      .optional()
      .exists()
      .custom((value, { req }) =>
        ["ACTIVE", "BLOCK"].some((item) => item === value)
      )
      .withMessage("status must be ACTIVE or BLOCK."),
    body("assignBlockId")
      .optional()
      .isMongoId()
      .withMessage("assignBlockId must be mongoose id."),
    body("districtId")
      .optional()
      .isMongoId()
      .withMessage("districtId must be mongoose id."),
    body("panchayatId")
      .optional()
      .isMongoId()
      .withMessage("panchayatId must be mongoose id."),
    body("villageId")
      .optional()
      .isMongoId()
      .withMessage("villageId must be mongoose id."),
  ],
  signin: [
    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required.")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("password must be at most 50 characters long."),
    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required.")
      .isEmail()
      .withMessage("email is not valid.")
      .normalizeEmail()
      .isLength({ min: 3 })
      .withMessage("email must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("email must be at most 50 characters long."),
  ],
  // oldPassword, newPassword
  changePassword: [
    body("oldPassword").not().isEmpty().withMessage("oldPassword is required."),
    body("newPassword")
      .not()
      .isEmpty()
      .withMessage("newPassword is required.")
      .isLength({ min: 3 })
      .withMessage("newPassword must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("newPassword must be at most 50 characters long."),
  ],
  forgetPassword: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required.")
      .isEmail()
      .withMessage("email is not valid."),
  ],
  // otp, password
  forgetPasswordOtpVerify: [
    body("otp")
      .not()
      .isEmpty()
      .withMessage("otp is required.")
      .isNumeric()
      .withMessage("otp must be number."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required.")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("password must be at most 50 characters long."),
  ],
};

export default AuthController;
