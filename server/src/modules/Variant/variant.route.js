import {Router} from "express";
import { addOptionController, addVariantType } from "./variant.controller.js";
import validate from "../../middlewares/validate.js";
import addVariantTypeSchema, { addOptionSchema } from "./variant.validator.js";
const variantRouter = Router();


variantRouter.route("/:id/variants").post(validate(addVariantTypeSchema), addVariantType);
variantRouter.route("/:id/variants/:vid/options").post(validate(addOptionSchema), addOptionController);

export default variantRouter;
