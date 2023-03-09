import { model, Model, Schema } from "mongoose";
import { PasswordHasServices } from "../services";
import { USER_TYPE } from "../types";
// const validateEmail = function (email: string) {
//   const re = /^\S+@\S+\.\S+$/;
//   return re.test(email);
// };

const userSchema = new Schema<USER_TYPE, Model<USER_TYPE>>(
  {
    role: {
      type: String,
      enum: {
        values: ["SUPER-ADMIN", "ADMIN"],
        message: `Role should be one of SUPER-ADMIN, ADMIN, GROUND-STAFF`,
      },
      required: [true, "role is required"],
    },

    password: {
      type: String,
      minlength: [4, "Password should be atleast 4 characters long"],
      maxlength: [100, "Password should be atmost 100 characters long"],
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
      unique: true,
      type: String,
      index: true,
      // validate: [validateEmail, "Please fill a valid email address"],

      // required: [true, "Email is required."],
    },

    avatar: {
      type: String,
    },
    avatarPath: {
      type: String,
    },
    countryCode: {
      type: String,
      default: "+91",
      match: [/^[0-9]{1,3}$/, "Country code must be a number"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Phone number is required"],
      minlength: [8, "Phone number must be at least 8 characters long"],
      maxlength: [15, "Phone number must be at most 15 characters long"],
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE"],
        message: "Gender value should be one of MALE, FEMALE.",
      },
      required: [true, "Gender is important."],
    },
    deviceName: {
      type: String,
    },

    lastLogInTime: {
      type: Date,
      // default: () => Date.now(),
    },

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "INACTIVE"],
        message: "Status value should be one of ACTIVE, INACTIVE.",
      },
      default: "ACTIVE",
    },

    fcmToken: {
      android: {
        type: String,
      },
      ios: {
        type: String,
      },
      web: {
        type: String,
      },
    },
  },
  { timestamps: true }
).pre<USER_TYPE>("save", async function (next) {
  this.password = this.password
    ? await new PasswordHasServices().hash(this.password)
    : undefined;
  // video uid create

  next();
});

const UserSchema = model<USER_TYPE, Model<USER_TYPE>>("User", userSchema);
UserSchema.syncIndexes();
export default UserSchema;
