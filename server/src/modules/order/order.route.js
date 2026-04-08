import { Router } from "express";
import placeOrderSchema from "./order.validator.js";
import validate from "../../middlewares/validate.js";
import { placeOrder } from "./order.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const orderRouter = Router();
orderRouter.route("/").post(authenticate, validate(placeOrderSchema), placeOrder);
export { orderRouter };
