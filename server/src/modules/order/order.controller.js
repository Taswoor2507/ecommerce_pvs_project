import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { placeOrderService } from "./order.service.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const { combinationId, quantity } = req.body;

  const data = await placeOrderService(combinationId, quantity);

  res.status(201).json({
    success: true,
    data,
  });
});