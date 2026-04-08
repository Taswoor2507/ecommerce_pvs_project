import {Router} from "express";
import validate from "../../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "./product.validator.js";
import { createProduct , listProducts , getProduct , updateProduct, deleteProduct } from "./product.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js";
const productRouter = Router();

productRouter.route("/").post(authenticate, authorizeRoles("admin"), validate(createProductSchema) , createProduct);
productRouter.route("/").get(listProducts);
productRouter.route("/:id").get(getProduct);
productRouter.route("/:id").put(authenticate, authorizeRoles("admin"), validate(updateProductSchema), updateProduct);
productRouter.route("/:id").delete(authenticate, authorizeRoles("admin"), deleteProduct);
export { productRouter };