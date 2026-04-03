import mongoose from "mongoose";
const CombinationSchema = new mongoose.Schema(
  {
    product_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true,
    },

    // Array of Option ObjectIds that form this combination
    // e.g. [ObjectId("size_M_id"), ObjectId("color_Blue_id")]
    options: [
      {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Option',
        required: true,
      },
    ],

    // THE KEY LOOKUP FIELD — unique indexed for O(1) storefront lookup
    // Sorted, pipe-delimited string of all option IDs (as strings, alphabetically sorted)
    // e.g. "507f1f77bcf86cd799439011|507f1f77bcf86cd799439012"
    options_hash: {
      type:     String,
      required: true,
    },

    // Additional price on top of product.base_price
    // final_price = product.base_price + combination.additional_price
    // NOTE: final_price is NEVER stored here — computed at query time
    additional_price: {
      type:     Number,
      default:  0,
      min:      [0, 'Additional price cannot be negative'],
    },

    // Stock units available for this combination
    stock: {
      type:     Number,
      default:  0,
      min:      [0, 'Stock cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message:   'Stock must be an integer',
      },
    },

    // Soft delete 
    is_active: {
      type:    Boolean,
      default: true,
    },

    // Denormalized option labels for display without joins
    // [ { type: "Size", value: "M" }, { type: "Color", value: "Blue" } ]
    option_labels: [
      {
        type:  { type: String },  // variant type name e.g. "Size"
        value: { type: String },  // option value e.g. "M"
      },
    ],
  },
  { timestamps: true }
);


CombinationSchema.index({ options_hash: 1 }, { unique: true });
CombinationSchema.index({ product_id: 1, is_active: 1 });
CombinationSchema.index({ _id: 1, stock: 1, is_active: 1 });

const Combination = mongoose.model('Combination', CombinationSchema);
export default Combination;