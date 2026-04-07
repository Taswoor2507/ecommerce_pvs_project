import { asyncHandler } from "../../middlewares/asyncHandler.js"
import Product from "../../models/product.model.js";
import { ApiError } from "../../utils/apiError.js";
import ApiFeatures from "../../utils/ApiFeatures.js";
import mongoose from "mongoose";
import Combination from "../../models/combination.model.js";
import { getProductWithVariants, invalidateProductCache } from "../../utils/cache.js";
import { getProductStock } from "../../utils/stock.utils.js";

// create product service
const createProductService = async (payload) => {
    const { name, description, base_price, stock } = payload;
    const product = await Product.create({ name, description, base_price, stock });
    if (!product) {
        throw new ApiError(500, "Failed to create product");
    }
    return {
        id: product._id,
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        stock: product.stock,
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

    // Calculate stock for each product (sum of combinations for variant products)
    const mappedProducts = await Promise.all(products.map(async (p) => {
        const stock = await getProductStock(p);
        return {
            id: p._id.toString(),
            name: p.name,
            description: p.description,
            base_price: p.base_price,
            image: p.image,
            stock: stock,
            variant_type_count: p.variant_type_count,
            createdAt: p.createdAt,
        };
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
  const { name, description, base_price, stock } = payload;

  // First, get the current product to compare
  const currentProduct = await Product.findOne({ _id: productId, is_active: true });
  
  if (!currentProduct) {
    throw new ApiError(404, "Product not found");
  }

  // Validation: Prevent stock updates for products with variants
  // Stock for variant products is calculated from combination stocks
  if (stock !== undefined && 
      stock !== currentProduct.stock && 
      currentProduct.variant_type_count > 0) {
    throw new ApiError(
      400, 
      "Cannot update product stock directly because this product has variants. " +
      "Please update the stock of each combination instead, " +
      "or delete all variants to enable direct stock updates."
    );
  }

  // Check if any values are actually different
  const hasChanges = 
    (name !== undefined && name !== currentProduct.name) ||
    (description !== undefined && description !== currentProduct.description) ||
    (base_price !== undefined && base_price !== currentProduct.base_price) ||
    (stock !== undefined && stock !== currentProduct.stock);

  // If no actual changes, return current product without updating
  if (!hasChanges) {
    return {
      id: currentProduct._id,
      name: currentProduct.name,
      description: currentProduct.description,
      base_price: currentProduct.base_price,
      stock: currentProduct.stock,
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
  if (stock !== undefined && stock !== currentProduct.stock) {
    update.stock = stock;
    cacheInvalidationNeeded = true;
  }

  // Only perform update if there are changes
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, is_active: true },
    update,
    { returnDocument: 'after', runValidators: true }
  );

  // Invalidate cache only if price or stock actually changed
  if (cacheInvalidationNeeded) {
    await invalidateProductCache(productId);
  }

  return {
    id: updatedProduct._id,
    name: updatedProduct.name,
    description: updatedProduct.description,
    base_price: updatedProduct.base_price,
    stock: updatedProduct.stock,
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