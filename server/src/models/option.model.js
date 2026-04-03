import mongoose from "mongoose";
const OptionSchema = new mongoose.Schema(
  {
    variant_type_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'VariantType',
      required: true,
    },
    // Denormalized for fast Cartesian product generation queries
    product_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true,
    },
    value: {
      type:     String,
      required: [true, 'Option value is required'],
      trim:     true,
      maxlength: [100, 'Option value cannot exceed 100 characters'],
    },
    // Controls display order in the storefront selector
    position: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique: a variant type can't have duplicate option values (e.g., two "Red"s)
OptionSchema.index({ variant_type_id: 1, value: 1 }, { unique: true });

// Fast lookup: all options for a product (used in Cartesian product generation)
OptionSchema.index({ product_id: 1 });

// Fast lookup: all options for a specific variant type (used in admin + validation)
OptionSchema.index({ variant_type_id: 1, position: 1 });

const Option = mongoose.model('Option', OptionSchema);
export default Option;