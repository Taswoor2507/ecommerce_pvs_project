import mongoose from "mongoose";
import { Combination, Product, Order } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";
import { invalidateProductCache } from "../../utils/cache.js";
import { syncProductStockFromCombinations } from "../../utils/stock.utils.js";
import ApiFeatures from "../../utils/ApiFeatures.js";

async function placeOrderService(combinationId, quantity, userId) {
// ... existing placeOrderService content (I'll keep it correct)
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
          user_id: userId,
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

    // Update denormalized total stock for the product (improves listing performance)
    await syncProductStockFromCombinations(combo.product_id, session);

    // commit
    await session.commitTransaction();

    // Sync Cache: Ensure stock data is fresh in Redis after order
    await invalidateProductCache(combo.product_id.toString());

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
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err; 
  } finally {
    session.endSession();
  }
}

async function getAllOrdersService(queryParams) {
  const baseQuery = Order.find().populate('user_id', 'name email');
  const countQuery = Order.find();

  const countFeatures = new ApiFeatures(countQuery, queryParams)
    .filter(['status', 'user_id']);

  const features = new ApiFeatures(baseQuery, queryParams)
    .filter(['status', 'user_id'])
    .paginate(20, 100)
    .sort("-createdAt", ["createdAt", "updatedAt", "total_price", "status"]);

  const orders = await features.query.lean();
  const total = await countFeatures.query.countDocuments();

  return {
    orders,
    pagination: {
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      pages: Math.ceil(total / features.pagination.limit),
    },
  };
}

async function getOrderDetailsService(orderId) {
  const order = await Order.findById(orderId)
    .populate('user_id', 'name email createdAt')
    .populate('product_id', 'image')
    .lean();
    
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
}

export { placeOrderService, getAllOrdersService, getOrderDetailsService };