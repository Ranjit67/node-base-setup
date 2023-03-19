import { Router } from "express";
import { AuthController, AuthControllerValidation } from "../controllers";
import { ProtectedMiddleware } from "../middleware";

export default class AuthRoutes {
  public router: Router;
  private authController: AuthController;
  public path = "auth";

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }
  private routes() {
    // Signup
    this.router.post(
      "/signup",
      AuthControllerValidation.register,
      this.authController.register
    );
    // signIn
    this.router.post(
      "/signin",
      AuthControllerValidation.signin,
      this.authController.signin
    );
    this.router.post(
      "/change-password",
      AuthControllerValidation.changePassword,
      new ProtectedMiddleware().protected,
      this.authController.changePassword
    );
    this.router.get(
      "/self",
      new ProtectedMiddleware().protected,
      this.authController.self
    );
    this.router.post(
      "/forget-password-otp-send",
      AuthControllerValidation.forgetPassword,
      this.authController.forgetPassword
    );
    this.router.post(
      "/forget-password-otp-verify",
      new ProtectedMiddleware().protected,
      AuthControllerValidation.forgetPasswordOtpVerify,
      this.authController.forgetPasswordOtpVerify
    );
  }
}
