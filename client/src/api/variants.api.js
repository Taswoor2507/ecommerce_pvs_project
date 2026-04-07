import api from '../lib/axios';

export const variantsApi = {
  // Add variant type with options to a product
  addVariantType: (productId, payload) => 
    api.post(`/products/${productId}/variants`, payload).then(r => r.data),

  // Add option to existing variant type
  addOption: (productId, variantTypeId, payload) => 
    api.post(`/products/${productId}/variants/${variantTypeId}/options`, payload).then(r => r.data),

  // Delete variant type
  deleteVariantType: (productId, variantTypeId) => 
    api.delete(`/products/${productId}/variants/${variantTypeId}`).then(r => r.data),

  // Delete option
  deleteOption: (optionId) => 
    api.delete(`/products/variants/options/${optionId}`).then(r => r.data),
};
