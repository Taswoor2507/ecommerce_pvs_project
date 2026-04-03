import { asyncHandler } from "../../middlewares/asyncHandler.js"
import Product from "../../models/product.model.js";
import { ApiError } from "../../utils/apiError.js";
import ApiFeatures from "../../utils/ApiFeatures.js";
import mongoose from "mongoose";
import Combination from "../../models/combination.model.js";
import { getProductWithVariants, invalidateProductCache } from "../../utils/cache.js";

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


// get product by id service
const getProductService = async (productId) => {
  const productData = await getProductWithVariants(productId);

  if (!productData) {
    throw new ApiError(404, "Product not found");
  }

  return productData;
};


// update product 
const updateProductService = async (productId, payload) => {
  const { name, description, base_price } = payload;

  // First, get the current product to compare
  const currentProduct = await Product.findOne({ _id: productId, is_active: true });
  
  if (!currentProduct) {
    throw new ApiError(404, "Product not found");
  }

  // Check if any values are actually different
  const hasChanges = 
    (name !== undefined && name !== currentProduct.name) ||
    (description !== undefined && description !== currentProduct.description) ||
    (base_price !== undefined && base_price !== currentProduct.base_price);

  // If no actual changes, return current product without updating
  if (!hasChanges) {
    return {
      id: currentProduct._id,
      name: currentProduct.name,
      description: currentProduct.description,
      base_price: currentProduct.base_price,
      updatedAt: currentProduct.updatedAt,
      message: "No changes detected - product already up to date"
    };
  }

  // Build update object only from changed fields
  const update = {};
  let cacheInvalidationNeeded = false;
  
  if (name !== undefined && name !== currentProduct.name) {
    update.name = name;
  }
  if (description !== undefined && description !== currentProduct.description) {
    update.description = description;
  }
  if (base_price !== undefined && base_price !== currentProduct.base_price) {
    update.base_price = base_price;
    cacheInvalidationNeeded = true;
  }

  // Only perform update if there are changes
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, is_active: true },
    update,
    { new: true, runValidators: true }
  );

  // Invalidate cache only if price actually changed
  if (cacheInvalidationNeeded) {
    await invalidateProductCache(productId);
  }

  return {
    id: updatedProduct._id,
    name: updatedProduct.name,
    description: updatedProduct.description,
    base_price: updatedProduct.base_price,
    updatedAt: updatedProduct.updatedAt,
  };
};



// delete product service 
const deleteProductService = async (productId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check product exists
    const product = await Product.findOne({ _id: productId, is_active: true }).session(session);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // 2. Soft delete product
    await Product.findByIdAndUpdate(
      productId,
      { is_active: false },
      { session }
    );

    // 3. Soft delete related combinations
    await Combination.updateMany(
      { product_id: productId },
      { is_active: false },
      { session }
    );

    // 4. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 5. Invalidate cache
    await invalidateProductCache(productId);

    return {
      message: "Product  deleted successfully"
    };

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};




export { createProductService ,listProductsService , getProductService , updateProductService , deleteProductService };