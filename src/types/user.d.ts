import { Document } from "mongoose";

export type ROLE = "SUPER-ADMIN" | "ADMIN";
export default interface USER_TYPE extends Document {
  role: ROLE;
  password?: string;
  name: string;
  email: string;
  avatar?: string;
  avatarPath?: string;
  countryCode: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE";
  deviceName: string;
  status: "ACTIVE" | "BLOCK";
  lastLogInTime: Date;

  fcmToken: {
    android: string;
    ios: string;
    web: string;
  };
}
