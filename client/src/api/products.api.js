import api from '../lib/axios';

export const productsApi = {
  // ── Storefront ────────────────────────────────────────────────────────────────
  list: (params = {}) => api.get('/products', { params }).then((r) => r.data.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data.data),

  // ── Product Combinations ─────────────────────────────────────────────────────
  getCombinations: (productId) => api.get(`/products/${productId}/combinations`).then((r) => r.data.data),
  lookupCombination: (productId, selection) => 
    api.post(`/products/${productId}/combinations/lookup`, selection).then((r) => r.data.data),

  // ── Admin ─────────────────────────────────────────────────────────────────────
//   create: (payload) => api.post('/products', payload).then((r) => r.data),
//   update: (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data),
//   remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),

  // ── Variant types ─────────────────────────────────────────────────────────────
//   addVariant: (productId, payload) =>
//     api.post(`/products/${productId}/variants`, payload).then((r) => r.data),

//   addOption: (productId, variantId, payload) =>
//     api
//       .post(`/products/${productId}/variants/${variantId}/options`, payload)
//       .then((r) => r.data),

//   removeVariant: (productId, variantId) =>
//     api.delete(`/products/${productId}/variants/${variantId}`).then((r) => r.data),

//   removeOption: (optionId) =>
//     api.delete(`/variants/options/${optionId}`).then((r) => r.data),
};