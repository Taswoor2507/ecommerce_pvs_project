import {Router} from "express";
import { addOption, addVariantType, deleteOption, deleteVariantType } from "./variant.controller.js";
import validate from "../../middlewares/validate.js";
import addVariantTypeSchema, { addOptionSchema } from "./variant.validator.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js";
const variantRouter = Router();


variantRouter.route("/:id/variants").post(authenticate, authorizeRoles("admin"), validate(addVariantTypeSchema), addVariantType);
variantRouter.route("/:id/variants/:vid/options").post(authenticate, authorizeRoles("admin"), validate(addOptionSchema), addOption);
variantRouter.route("/:id/variants/:vid").delete(authenticate, authorizeRoles("admin"), deleteVariantType);
variantRouter.route("/variants/options/:oid").delete(authenticate, authorizeRoles("admin"), deleteOption);
export default variantRouter;
