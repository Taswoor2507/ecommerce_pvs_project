import {Router} from "express";
import { addOption, addVariantType, deleteVariantType } from "./variant.controller.js";
import validate from "../../middlewares/validate.js";
import addVariantTypeSchema, { addOptionSchema } from "./variant.validator.js";
const variantRouter = Router();


variantRouter.route("/:id/variants").post(validate(addVariantTypeSchema), addVariantType);
variantRouter.route("/:id/variants/:vid/options").post(validate(addOptionSchema), addOption);
variantRouter.route("/:id/variants/:vid").delete(deleteVariantType);

export default variantRouter;
