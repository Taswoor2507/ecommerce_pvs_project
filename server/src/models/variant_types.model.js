import mongoose from 'mongoose';

const VariantTypeSchema = new mongoose.Schema(
  {
    product_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true,
    },
    name: {
      type:     String,
      required: [true, 'Variant type name is required'],
      trim:     true,
      maxlength: [100, 'Variant type name cannot exceed 100 characters'],
    },
    // Controls render order in the storefront UI 
    position: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique: a product cannot have two variant types with the same name
VariantTypeSchema.index({ product_id: 1, name: 1 }, { unique: true });

// Fast fetch: all variant types for a product (most common query)
VariantTypeSchema.index({ product_id: 1, position: 1 });

const VariantType = mongoose.model('VariantType', VariantTypeSchema);
export default VariantType;