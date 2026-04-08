import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    combination_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Combination',
      required: true,
    },
    user_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    // Denormalized for fast order history display (avoid joining back to Combination)
    product_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true,
    },
    quantity: {
      type:     Number,
      required: true,
      min:      [1,   'Quantity must be at least 1'],
      max:      [100, 'Quantity cannot exceed 100 per order'],
      validate: {
        validator: Number.isInteger,
        message:   'Quantity must be an integer',
      },
    },

    // ── Price snapshot — NEVER recalculate from live data ──────────────────
    unit_price: {
      type:     Number,
      required: true,
      // = product.base_price + combination.additional_price at time of order
    },
    total_price: {
      type:     Number,
      required: true,
      // = unit_price * quantity at time of order
    },

    // ── Product snapshot (display without joining) ──────────────────────────
    product_snapshot: {
      name:       { type: String },
      base_price: { type: Number },
    },

    // ── Combination snapshot (display without joining) ──────────────────────
    combination_snapshot: {
      // [ { type: "Size", value: "M" }, { type: "Color", value: "Blue" } ]
      option_labels:    [{ type: String, value: String }],
      additional_price: { type: Number },
    },

    status: {
      type:    String,
      enum:    ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// Fast lookup: orders for a specific combination (used in delete guards)
OrderSchema.index({ combination_id: 1 });

// Fast lookup: orders for a product (order history)
OrderSchema.index({ product_id: 1 });

// Recent orders first
OrderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;