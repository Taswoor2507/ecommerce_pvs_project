import { useState, useEffect } from "react";
import { Button, Input } from "../ui/index";

export function ProductForm({ data, onChange, variantMode = "create" }) {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    base_price: data?.base_price?.toString() || "",
    stock: data?.stock?.toString() || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const newFormData = { ...formData, [field]: e.target.value };
    setFormData(newFormData);
    onChange(newFormData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.base_price || isNaN(formData.base_price) || Number(formData.base_price) < 0) {
      newErrors.base_price = "Valid price is required";
    }
    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: data.name || "",
        description: data.description || "",
        base_price: data.base_price?.toString() || "",
        stock: data.stock?.toString() || "",
      });
    }
  }, [data]);

  // For wizard mode, we don't show the submit buttons
  if (variantMode === "create") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name *"
            value={formData.name}
            onChange={handleChange("name")}
            error={errors.name}
            placeholder="Enter product name"
            className="md:col-span-2"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Enter product description (optional)"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
            />
          </div>

          <Input
            label="Base Price *"
            type="number"
            min={0}
            step="0.01"
            value={formData.base_price}
            onChange={handleChange("base_price")}
            error={errors.base_price}
            placeholder="0.00"
          />

          <Input
            label="Initial Stock *"
            type="number"
            min={0}
            step="1"
            value={formData.stock}
            onChange={handleChange("stock")}
            error={errors.stock}
            placeholder="0"
            helperText="This will be used if no variants are added"
          />
        </div>
      </div>
    );
  }

  // Original form for modal usage
  return (
    <form onSubmit={(e) => { e.preventDefault(); validate(); }} className="flex flex-col gap-4">
      <Input
        label="Product Name *"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
        placeholder="Enter product name"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="Enter product description (optional)"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Base Price *"
          type="number"
          min={0}
          step="0.01"
          value={formData.base_price}
          onChange={handleChange("base_price")}
          error={errors.base_price}
          placeholder="0.00"
        />

        <Input
          label="Stock Quantity *"
          type="number"
          min={0}
          step="1"
          value={formData.stock}
          onChange={handleChange("stock")}
          error={errors.stock}
          placeholder="0"
        />
      </div>
    </form>
  );
}

// Export as default for backward compatibility
export default ProductForm;
