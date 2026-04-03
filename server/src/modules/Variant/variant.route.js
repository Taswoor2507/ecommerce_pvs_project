import {Router} from "express";
import { addVariantType } from "./variant.controller.js";
import validate from "../../middlewares/validate.js";
import addVariantTypeSchema from "./variant.validator.js";
const variantRouter = Router();


variantRouter.route("/:id/variants").post(validate(addVariantTypeSchema), addVariantType);
export default variantRouter;

export { variantRouter}