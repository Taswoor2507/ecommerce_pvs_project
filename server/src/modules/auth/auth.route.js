import { Router } from "express";
import { login, refreshToken, register, logout, getMe } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
const authRouter = Router();

// Register route
authRouter.route("/register").post(validate(registerSchema), register);

//Login route
authRouter.route("/login").post(validate(loginSchema) , login)

//refresh token 
authRouter.route("/refresh-token").post(refreshToken);

// Protected routes
authRouter.route("/logout").post(authenticate, logout);
authRouter.route("/me").get(authenticate, getMe);

export { authRouter };
