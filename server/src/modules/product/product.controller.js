import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createProductService , listProductsService } from "./product.service.js";

// create product controller
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, base_price } = req.body;
    const product = await createProductService({ name, description, base_price });
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    })
})

// list product controller
const listProducts = asyncHandler(async (req, res) => {
    const products = await listProductsService(req.query);
    res.status(200).json({
        success: true,
        message: "Products listed successfully",
        data: products,
    })
})

export { createProduct, listProducts };