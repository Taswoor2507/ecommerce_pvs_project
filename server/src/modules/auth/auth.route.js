import { Router } from "express";
import { register } from "./auth.controller.js";
import validate from "../../middlewares/validate.js";
import { registerSchema } from "./auth.validator.js";
const authRouter = Router();

authRouter.route("/register").post(validate(registerSchema), register);
export { authRouter };

