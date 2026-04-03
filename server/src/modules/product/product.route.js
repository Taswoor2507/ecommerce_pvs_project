import {Router} from "express";
import validate from "../../middlewares/validate.js";
import { createProductSchema } from "./product.validator.js";
import { createProduct } from "./product.controller.js";
const productRouter = Router();

productRouter.route("/").post(validate(createProductSchema) , createProduct);
export { productRouter };