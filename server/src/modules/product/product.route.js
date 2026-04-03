import {Router} from "express";
import validate from "../../middlewares/validate.js";
import { createProductSchema } from "./product.validator.js";
import { createProduct , listProducts } from "./product.controller.js";
const productRouter = Router();

productRouter.route("/").post(validate(createProductSchema) , createProduct);
productRouter.route("/").get(listProducts);
export { productRouter };