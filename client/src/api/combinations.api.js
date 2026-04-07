import api from '../lib/axios';

export const combinationsApi = {
  // Get all combinations for a product
  list: (productId) => 
    api.get(`/products/${productId}/combinations`).then(r => r.data),

  // Update combination (stock, additional_price)
  update: (combinationId, payload) => 
    api.put(`/products/combinations/${combinationId}`, payload).then(r => r.data),

  // Lookup combination by selection
  lookup: (productId, selection) => 
    api.post(`/products/${productId}/combinations/lookup`, selection).then(r => r.data),
};
