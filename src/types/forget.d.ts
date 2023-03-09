import { Document } from "mongoose";
import USER_TYPE from "./user";

export default interface FORGET_TYPE extends Document {
  otp: number;
  user: USER_TYPE;
}
