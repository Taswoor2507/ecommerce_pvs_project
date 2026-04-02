import { Router } from "express";
import { login, register } from "./auth.controller.js";
import validate from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
const authRouter = Router();

// Register route
authRouter.route("/register").post(validate(registerSchema), register);
export { authRouter };

//Login route
authRouter.route("/login").post(validate(loginSchema) , login)
