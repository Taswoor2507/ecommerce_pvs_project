import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Product name is required'],
      trim:     true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type:    String,
      default: '',
      trim:    true,
      maxlength: [2000, 'Product description cannot exceed 2000 characters'],
    },
    base_price: {
      type:     Number,
      required: [true, 'Base price is required'],
      min:      [0, 'Base price cannot be negative'],
    },
    variant_type_count: {
      type:    Number,
      default: 0,
      min:     0,
    },
    // Soft delete — 
    is_active: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for product listing (only active products)
ProductSchema.index({ is_active: 1, createdAt: -1 });

// Text index for search functionality
ProductSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', ProductSchema);
export default Product;