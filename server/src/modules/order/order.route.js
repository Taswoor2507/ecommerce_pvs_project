import { Router } from "express";
import placeOrderSchema from "./order.validator.js";
import validate from "../../middlewares/validate.js";
import { placeOrder } from "./order.controller.js";

const orderRouter = Router();
orderRouter.route("/").post(validate(placeOrderSchema), placeOrder);
export { orderRouter };
