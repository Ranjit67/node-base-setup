import { Request } from "express";
import { ROLE } from "./user";

export interface JwtDecodedType {
  _id: string;
  email: string;
  role: ROLE;
}

// auth request
export interface AuthRequest extends Request {
  currentUser?: JwtDecodedType;
}

export interface ImageType {
  url: string;
  path: string;
}
