import { NextFunction, Response } from "express";
import { body, check, param, query } from "express-validator";
import { NotFound } from "http-errors";
import { fieldValidateError, getData } from "../helper";
import { UserSchema } from "../models";
import { MediaStoreService } from "../services";
import { MIDDLEWARE_REQUEST_TYPE, USER_TYPE } from "../types";

class UserController {
  async getAll(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const {
        perPage,
        pageNo,
        role,
        status,
        gender,
        searchTitle,

        userId,
      } = req.query;

      const arg: any = {};
      role && (arg["role"] = role);
      status && (arg["status"] = status);
      gender && (arg["gender"] = gender);

      userId && (arg["_id"] = userId);

      if (searchTitle)
        arg["$or"] = [
          { name: { $regex: searchTitle, $options: "i" } },
          { email: { $regex: searchTitle, $options: "i" } },
          { phoneNumber: { $regex: searchTitle, $options: "i" } },
          { role: { $regex: searchTitle, $options: "i" } },
          { gender: { $regex: searchTitle, $options: "i" } },
        ];

      const dataGate = await getData<USER_TYPE, any>(
        UserSchema,
        arg,
        Number(perPage),
        Number(pageNo),
        "",
        "-password",
        { createdAt: -1 }
      );
      res.json({
        success: {
          data: dataGate,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async update(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const { _id } = req.params;

      const avatarRawData = req?.files?.avatar
        ? ((await new MediaStoreService().upload({
            file: req?.files?.avatar,
            dir: "User",
          })) as {
            key: string;
            Location: string;
          })
        : undefined;

      const updateUserData = await UserSchema.findByIdAndUpdate(
        _id,
        {
          ...req.body,

          password: undefined,
          fcmToken: undefined,
          status: undefined,
          email: undefined,
          avatar: avatarRawData?.key,
          avatarPATH: avatarRawData?.Location,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateUserData) throw new NotFound("User is not found.");
      res.json({
        success: {
          message: "User is updated successfully.",
          data: updateUserData,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { _id } = req.params;

      const userDelete = await UserSchema.findByIdAndDelete(_id);
      if (!userDelete) throw new NotFound("User not found.");

      res.json({
        success: {
          message: "User deleted successfully.",
          data: userDelete,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
export const UserControllerValidation = {
  getAll: [
    check("role")
      .optional()
      .exists()
      .custom((value, { req }) =>
        ["SUPER-ADMIN", "ADMIN", "GROUND-STAFF"].some((item) => item === value)
      )
      .withMessage("role must be SUPER-ADMIN , ADMIN or GROUND-STAFF."),
    query("gender")
      .optional()
      .exists()
      .custom((value, { req }) =>
        ["MALE", "FEMALE"].some((item) => item === value)
      )
      .withMessage("gender must be MALE or FEMALE."),
    query("status")
      .optional()
      .exists()
      .custom((value, { req }) =>
        ["ACTIVE", "BLOCK"].some((item) => item === value)
      )
      .withMessage("status must be ACTIVE or BLOCK."),
    query("userId")
      .optional()
      .exists()
      .isMongoId()
      .withMessage("userId must be mongoose id."),
  ],
  updated: [
    param("_id")
      .not()
      .isEmpty()
      .withMessage("_id is required.")
      .isMongoId()
      .withMessage("_id must be the mongoose id."),
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("name must be 3 digit.")
      .isLength({ max: 150 })
      .withMessage("name must be 150 digit."),

    body("gender")
      .optional()
      .exists()
      .custom((value, { req }) =>
        ["MALE", "FEMALE"].some((item) => item === value)
      )
      .withMessage("gender must be MALE or FEMALE."),

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
  ],
};

export default UserController;
