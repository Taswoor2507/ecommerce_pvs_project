import { listCombinationsService, updateCombinationService, lookupCombination } from "./combination.service.js";
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


// update combination controller 
 const updateCombination = asyncHandler(async (req, res) => {
  const { cid } = req.params;

  const data = await updateCombinationService(cid, req.body);

  res.json({
    status: "success",
    data,
  });
});




// Storefront: given a selection map, return the matching combination
const lookupCombinationHandler = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const result = await lookupCombination(productId, req.body);
  res.json({ status: 'success', data: result });
});



export {
    listCombinations,
    updateCombination,
    lookupCombinationHandler
}