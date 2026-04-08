import { Router } from "express";
import placeOrderSchema from "./order.validator.js";
import validate from "../../middlewares/validate.js";
import { placeOrder, getAllOrders, getOrderDetails } from "./order.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js";

const orderRouter = Router();

orderRouter.route("/")
  .post(authenticate, validate(placeOrderSchema), placeOrder)
  .get(authenticate, authorizeRoles("admin"), getAllOrders);

orderRouter.route("/:id")
  .get(authenticate, authorizeRoles("admin"), getOrderDetails);

export { orderRouter };
