import { Router } from "express";
import { listCombinationsController } from "./combination.controller.js";

const combinationRouter = Router();


combinationRouter.route("/:id/combinations").get(listCombinationsController);
export {combinationRouter};
