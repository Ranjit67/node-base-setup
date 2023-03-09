import { Router } from "express";
import { AuthController, AuthControllerValidator } from "../controllers";
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
      AuthControllerValidator.register,
      this.authController.register
    );
    // signIn
    this.router.post(
      "/signin",
      AuthControllerValidator.signin,
      this.authController.signin
    );
    this.router.post(
      "/change-password",
      AuthControllerValidator.changePassword,
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
      AuthControllerValidator.forgetPassword,
      this.authController.forgetPassword
    );
    this.router.post(
      "/forget-password-otp-verify",
      new ProtectedMiddleware().protected,
      AuthControllerValidator.forgetPasswordOtpVerify,
      this.authController.forgetPasswordOtpVerify
    );
  }
}
