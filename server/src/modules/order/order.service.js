import mongoose from "mongoose";
import { Combination, Product, Order } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";
import { invalidateProductCache } from "../../utils/cache.js";
import { syncProductStockFromCombinations } from "../../utils/stock.utils.js";
import ApiFeatures from "../../utils/ApiFeatures.js";

async function placeOrderService({ items, shippingInfo }, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Order must contain at least one item");
    }

    if (!shippingInfo) {
      throw new ApiError(400, "Shipping information is required");
    }

    // Process each item and calculate totals
    const orderItems = [];
    let subtotal = 0;
    const productIdsToInvalidate = new Set();

    for (const item of items) {
      let product, unitPrice;

      if (item.combinationId) {
        // Variant product flow
        const combo = await Combination.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(item.combinationId),
            is_active: true,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            returnDocument: 'after',
            session,
            select: "stock product_id additional_price option_labels",
          }
        );

        if (!combo) {
          const existing = await Combination.findById(item.combinationId)
            .select("stock is_active")
            .lean()
            .session(session);

          if (!existing || !existing.is_active) {
            throw new ApiError(404, `Combination not found or no longer available: ${item.combinationId}`);
          }

          throw new ApiError(
            422,
            `Insufficient stock for ${item.name}. Requested: ${item.quantity}, Available: ${existing.stock}`
          );
        }

        product = await Product.findById(combo.product_id)
          .select("name base_price image")
          .lean()
          .session(session);

        if (!product) {
          throw new ApiError(404, "Associated product not found");
        }

        unitPrice = parseFloat((product.base_price + combo.additional_price).toFixed(2));
        
        const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2));
        subtotal += itemTotal;

        orderItems.push({
          product_id: combo.product_id,
          combination_id: combo._id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: itemTotal,
          product_snapshot: {
            name: product.name,
            base_price: product.base_price,
            image: product.image,
          },
          combination_snapshot: {
            option_labels: combo.option_labels,
            additional_price: combo.additional_price,
          },
        });

        productIdsToInvalidate.add(combo.product_id.toString());

      } else {
        // Simple product flow
        const productDoc = await Product.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(item.productId),
            is_active: true,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            returnDocument: 'after',
            session,
            select: "name base_price stock image",
          }
        );

        if (!productDoc) {
          const existing = await Product.findById(item.productId)
            .select("stock is_active")
            .lean()
            .session(session);

          if (!existing || !existing.is_active) {
            throw new ApiError(404, `Product not found or no longer available: ${item.productId}`);
          }

          throw new ApiError(
            422,
            `Insufficient stock for ${item.name}. Requested: ${item.quantity}, Available: ${existing.stock}`
          );
        }

        unitPrice = parseFloat(productDoc.base_price.toFixed(2));
        
        const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2));
        subtotal += itemTotal;

        orderItems.push({
          product_id: item.productId,
          combination_id: null,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: itemTotal,
          product_snapshot: {
            name: productDoc.name,
            base_price: productDoc.base_price,
            image: productDoc.image,
          },
          combination_snapshot: null,
        });

        productIdsToInvalidate.add(item.productId);
      }
    }

    // Calculate total amount (add shipping, taxes, etc. if needed in future)
    const totalAmount = subtotal; // For now, no additional charges

    // Create the order with all items
    const [order] = await Order.create(
      [
        {
          user_id: userId,
          items: orderItems,
          subtotal: parseFloat(subtotal.toFixed(2)),
          total_amount: parseFloat(totalAmount.toFixed(2)),
          shipping_info: shippingInfo,
          status: "confirmed",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Invalidate cache for all affected products
    for (const productId of productIdsToInvalidate) {
      await invalidateProductCache(productId);
    }

    return {
      order_id: order._id,
      items: orderItems.map(item => ({
        name: item.product_snapshot.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        combination: item.combination_snapshot?.option_labels || null,
      })),
      subtotal: order.subtotal,
      total_amount: order.total_amount,
      shipping_info: order.shipping_info,
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
    .sort("-createdAt", ["createdAt", "updatedAt", "total_amount", "status"]);

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
    .populate('items.product_id', 'image')
    .populate('items.combination_id', 'option_labels additional_price')
    .lean();
    
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
}

export { placeOrderService, getAllOrdersService, getOrderDetailsService };