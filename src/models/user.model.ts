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
    },

    photoUrl: {
      type: String,
    },
    photoRef: {
      type: String,
    },

    phoneNumber: {
      type: String,
      minlength: [8, "Phone number must be at least 8 characters long"],
      maxlength: [15, "Phone number must be at most 15 characters long"],
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE"],
        message: "Gender value should be one of MALE, FEMALE.",
      },
    },
    slagName: {
      type: String,
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

  next();
});

const UserSchema = model<USER_TYPE, Model<USER_TYPE>>("User", userSchema);
UserSchema.syncIndexes();
export default UserSchema;
