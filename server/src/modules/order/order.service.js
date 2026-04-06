import mongoose from "mongoose";
import { Combination, Product, Order } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";

async function placeOrderService(combinationId, quantity) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  Atomic stock deduction
    const combo = await Combination.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(combinationId),
        is_active: true,
        stock: { $gte: quantity },
      },
      {
        $inc: { stock: -quantity },
      },
      {
        returnDocument: 'after',
        session,
        select: "stock product_id additional_price option_labels",
      }
    );

    if (!combo) {
      // check reason
      const existing = await Combination.findById(combinationId)
        .select("stock is_active")
        .lean()
        .session(session);

      if (!existing || !existing.is_active) {
        throw new ApiError(404, "Combination not found or no longer available");
      }

      throw new ApiError(
        422,
        `Insufficient stock. Requested: ${quantity}, Available: ${existing.stock}`
      );
    }

    //  Step 2: Get product
    const product = await Product.findById(combo.product_id)
      .select("name base_price")
      .lean()
      .session(session);

    if (!product) {
      throw new ApiError(404, "Associated product not found");
    }

    // pricing
    const unit_price = parseFloat(
      (product.base_price + combo.additional_price).toFixed(2)
    );

    const total_price = parseFloat(
      (unit_price * quantity).toFixed(2)
    );

    // Step 3: Create order
    const [order] = await Order.create(
      [
        {
          combination_id: combo._id,
          product_id: combo.product_id,
          quantity,
          unit_price,
          total_price,

          product_snapshot: {
            name: product.name,
            base_price: product.base_price,
          },

          combination_snapshot: {
            option_labels: combo.option_labels,
            additional_price: combo.additional_price,
          },

          status: "confirmed",
        },
      ],
      { session }
    );

    // commit
    await session.commitTransaction();

    return {
      order_id: order._id,
      product: { name: product.name },
      combination: { option_labels: combo.option_labels },
      quantity,
      unit_price,
      total_price,
      status: order.status,
    };

  } catch (err) {
    await session.abortTransaction();
    throw err; 
  } finally {
    session.endSession();
  }
};


export {placeOrderService}