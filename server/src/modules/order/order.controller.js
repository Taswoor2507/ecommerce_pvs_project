import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { placeOrderService } from "./order.service.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const { combinationId, quantity } = req.body;
  const userId = req.user.id;

  const data = await placeOrderService(combinationId, quantity, userId);

  res.status(201).json({
    success: true,
    data,
  });
});