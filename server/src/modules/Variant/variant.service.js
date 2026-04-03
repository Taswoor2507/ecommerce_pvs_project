import mongoose from 'mongoose';
import { Product, VariantType, Option } from '../../models/index.js';
import { withProductLock } from '../../utils/redisLock.js';
import { generateCombinationsForProduct } from '../combinations/combination.service.js';
import { invalidateProductCache } from '../../utils/cache.js';
import { ApiError } from '../../utils/apiError.js';

 async function addVariantTypeService(productId, name, optionValues) {
  // Verify product exists
  const product = await Product.findOne({ _id: productId, is_active: true });
  if (!product) throw new ApiError(404, 'Product not found');

  // Deduplicate options (case-insensitive)
  const seen = new Set();
  const uniqueOptions = [];
  for (const val of optionValues) {
    const normalized = val.trim().toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    uniqueOptions.push(val.trim());
  }

  let variantType;
  let combinationsGenerated = 0;

  // Acquire lock to prevent race conditions
  await withProductLock(productId, async () => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if variant type with same name already exists for this product
      const existingVariant = await VariantType.findOne({ 
        product_id: productId, 
        name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive check
      }).session(session);
      
      if (existingVariant) {
        throw new ApiError(409, `Variant type '${name}' already exists for this product`);
      }

      // 1️⃣ Create variant type
      [variantType] = await VariantType.create(
        [{ product_id: productId, name, position: product.variant_type_count }],
        { session }
      );

      // 2️⃣ Create options
      const optionDocs = uniqueOptions.map((value, idx) => ({
        variant_type_id: variantType._id,
        product_id: productId,
        value,
        position: idx,
      }));
      await Option.insertMany(optionDocs, { session });

      // 3️⃣ Increment variant_type_count
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { variant_type_count: 1 } },
        { session }
      );

      // 4️⃣ Regenerate all combinations
      combinationsGenerated = await generateCombinationsForProduct(productId, session);

      await session.commitTransaction();
    } catch (err) {
      // Only abort if transaction is in progress
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      
      // Handle MongoDB duplicate key error
      if (err.code === 11000) {
        // Extract the duplicate field from error message
        const duplicateField = Object.keys(err.keyPattern)[0];
        const duplicateValue = err.keyValue[duplicateField];
        
        if (duplicateField === 'name') {
          throw new ApiError(409, `Variant type '${duplicateValue}' already exists for this product`);
        } else {
          throw new ApiError(409, `Duplicate entry detected: ${duplicateField} '${duplicateValue}'`);
        }
      }
      
      // Handle validation errors
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        throw new ApiError(400, `Validation error: ${messages.join(', ')}`);
      }
      
      // Re-throw other errors
      throw err;
    } finally {
      await session.endSession();
    }
  });

  // 5️⃣ Invalidate cache
  await invalidateProductCache(productId);

  // Reload options for response
  const options = await Option.find({ variant_type_id: variantType._id }).sort({ position: 1 }).lean();

  return { variantType, options, combinationsGenerated };
}

export {addVariantTypeService};