import { listCombinationsService } from "./combination.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

// list all combinations for a product
export const listCombinationsController = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const data = await listCombinationsService(productId);

  res.json({
    status: "success",
    data,
  });
});