import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { placeOrderService, getAllOrdersService, getOrderDetailsService } from "./order.service.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingInfo } = req.body;
  const userId = req.user.id;

  const data = await placeOrderService({ items, shippingInfo }, userId);

  res.status(201).json({
    success: true,
    data,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const data = await getAllOrdersService(req.query);

  res.status(200).json({
    success: true,
    ...data,
  });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  const data = await getOrderDetailsService(req.params.id);

  res.status(200).json({
    success: true,
    data,
  });
});