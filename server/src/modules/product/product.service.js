import { asyncHandler } from "../../middlewares/asyncHandler.js"
import Product from "../../models/product.model.js";
import { ApiError } from "../../utils/apiError.js";
// create product service
const createProductService = async (payload) => {
    const { name, description, base_price } = payload;
    const product = await Product.create({ name, description, base_price });
    if (!product) {
        throw new ApiError(500, "Failed to create product");
    }
    return {
        id: product._id,
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        created_at: product.createdAt,
        updated_at: product.updatedAt
    };
}

export { createProductService };