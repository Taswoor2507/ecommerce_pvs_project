import { Router } from "express";
import { listCombinations, updateCombination } from "./combination.controller.js";
import validate from "../../middlewares/validate.js";
import updateCombinationSchema from "./combination.validator.js";
const combinationRouter = Router();


combinationRouter.route("/:id/combinations").get(listCombinations);
combinationRouter.route("/combinations/:cid").put( validate(updateCombinationSchema), updateCombination);
export { combinationRouter };
