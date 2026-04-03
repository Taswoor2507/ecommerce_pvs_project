import { asyncHandler } from "../../middlewares/asyncHandler.js"
import Product from "../../models/product.model.js";
import { ApiError } from "../../utils/apiError.js";
import ApiFeatures from "../../utils/ApiFeatures.js";
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


// list all products 
const listProductsService = async (queryParams) => {
    const baseQuery = Product.find({ is_active: true });

    // Create a separate query for counting (without pagination)
    const countQuery = Product.find({ is_active: true });

    // Apply search and filters to both queries
    const countFeatures = new ApiFeatures(countQuery, queryParams)
        .search("name", ["name"])
        .filter(["base_price", "variant_type_count"]);

    // Apply all features including pagination and sort to main query
    const features = new ApiFeatures(baseQuery, queryParams)
        .search("name", ["name"])
        .filter(["base_price", "variant_type_count"])
        .paginate(20 , 100)
        .sort("-createdAt", ["createdAt", "updatedAt", "name", "base_price"]);

    const products = await features.query.lean();
    
    // Get total count with applied filters and search
    const total = await countFeatures.query.countDocuments();

    const mappedProducts = products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        base_price: p.base_price,
        variant_type_count: p.variant_type_count,
        createdAt: p.createdAt,
    }));

    return {
        products: mappedProducts,
        pagination: {
            total,
            page: features.pagination.page,
            limit: features.pagination.limit,
            pages: Math.ceil(total / features.pagination.limit),
        },
    };
};





export { createProductService ,listProductsService};