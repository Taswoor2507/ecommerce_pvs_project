import { listCombinationsService, updateCombinationService } from "./combination.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

// list all combinations for a product
 const listCombinations = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const data = await listCombinationsService(productId);

  res.json({
    status: "success",
    data,
  });
});


// updat combination controller 
 const updateCombination = asyncHandler(async (req, res) => {
  const { cid } = req.params;

  const data = await updateCombinationService(cid, req.body);

  res.json({
    status: "success",
    data,
  });
});



export {
    listCombinations,
    updateCombination
}