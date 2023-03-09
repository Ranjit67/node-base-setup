import { model, Model, Schema } from "mongoose";
import { FORGET_TYPE } from "../types";

const forgetSchema = new Schema<FORGET_TYPE, Model<FORGET_TYPE>>(
  {
    otp: {
      type: Number,
      require: [true, "otp is require."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
forgetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 15 });
const ForgetSchema = model<FORGET_TYPE, Model<FORGET_TYPE>>(
  "Forget",
  forgetSchema
);
ForgetSchema.syncIndexes();
export default ForgetSchema;
