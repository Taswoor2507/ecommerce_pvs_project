import axios from '../lib/axios';

export const ordersApi = {
  /**
   * Place a new order
   * @param {Object} data - { items: [{ combinationId, productId, quantity, price, name, image, variants }], shippingInfo }
   */
  placeOrder: async (data) => {
    const response = await axios.post('/orders', data);
    return response.data;
  },

  /**
   * Get user's order history
   */
  getMyOrders: async () => {
    const response = await axios.get('/orders/my-orders');
    return response.data;
  },

  /**
   * Get order details
   */
  getOrderDetails: async (id) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Admin: Get all orders (paginated)
   */
  getAdminOrders: async (params) => {
    const response = await axios.get('/orders', { params });
    return response.data;
  }
};
