import { Router } from "express";
import { listCombinations, updateCombination, lookupCombinationHandler } from "./combination.controller.js";
import validate from "../../middlewares/validate.js";
import { updateCombinationSchema, lookupCombinationSchema } from "./combination.validator.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js";
const combinationRouter = Router();


combinationRouter.route("/:id/combinations").get(listCombinations);
combinationRouter.route("/combinations/:cid").put(authenticate, authorizeRoles("admin"), validate(updateCombinationSchema), updateCombination);
combinationRouter.route("/:id/combinations/lookup").post(validate(lookupCombinationSchema), lookupCombinationHandler);

export { combinationRouter };
