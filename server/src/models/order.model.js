import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // ── Order Items Array ──────────────────────────────────────────────────
    items: [{
      product_id: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Product',
        required: true,
      },
      combination_id: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Combination',
        required: false, // Optional for simple products
      },
      quantity: {
        type:     Number,
        required: true,
        min:      [1,   'Quantity must be at least 1'],
        max:      [100, 'Quantity cannot exceed 100 per item'],
        validate: {
          validator: Number.isInteger,
          message:   'Quantity must be an integer',
        },
      },
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
      
      // ── Product snapshot (display without joining) ──────────────────────
      product_snapshot: {
        name:       { type: String, required: true },
        base_price: { type: Number, required: true },
        image:      { type: String },
      },

      // ── Combination snapshot (display without joining) ──────────────────
      combination_snapshot: {
        option_labels:    [{ type: String, value: String }],
        additional_price: { type: Number, default: 0 },
      },
    }],

    // ── Order Totals ───────────────────────────────────────────────────────
    subtotal: {
      type:     Number,
      required: true,
      min:      [0, 'Subtotal cannot be negative'],
    },
    total_amount: {
      type:     Number,
      required: true,
      min:      [0, 'Total amount cannot be negative'],
    },

    // ── Shipping Information ───────────────────────────────────────────────
    shipping_info: {
      fullName:   { type: String, required: true },
      email:      { type: String, required: true },
      phone:      { type: String, required: true },
      address:    { type: String, required: true },
      city:       { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    status: {
      type:    String,
      enum:    ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// Fast lookup: orders for a specific user
OrderSchema.index({ user_id: -1 });

// Fast lookup: orders containing specific products
OrderSchema.index({ 'items.product_id': 1 });

// Fast lookup: orders containing specific combinations
OrderSchema.index({ 'items.combination_id': 1 });

// Recent orders first
OrderSchema.index({ createdAt: -1 });

// Status-based queries
OrderSchema.index({ status: 1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;