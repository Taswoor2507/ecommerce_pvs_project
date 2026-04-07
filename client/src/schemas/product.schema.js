import { z } from "zod";

// Reusable validation patterns
const nameValidation = z.string()
  .min(1, "This field is required")
  .max(100, "Cannot exceed 100 characters")
  .trim();

const descriptionValidation = z.string()
  .max(2000, "Cannot exceed 2000 characters")
  .optional()
  .transform(val => val?.trim() || "");

const priceValidation = z.number({
  required_error: "Price is required",
  invalid_type_error: "Invalid price: must be a number"
})
  .min(0, "Price must be a positive number")
  .refine(val => !isNaN(val), "Invalid price: must be a valid number")
  .refine((val) => Number.isInteger(val * 100), "Price can have at most 2 decimal places");

const stockValidation = z.number({
  invalid_type_error: "Invalid stock: must be a number"
})
  .min(0, "Stock cannot be negative")
  .int("Stock must be an integer")
  .default(0)
  .refine(val => !isNaN(val), "Invalid stock: must be a valid number");

// Basic Product Information Schema
export const createProductSchema = z.object({
  name: nameValidation.max(200, "Product name must be less than 200 characters"),
  description: descriptionValidation,
  base_price: priceValidation,
  stock: stockValidation,
});

// Product update schema (all fields optional)
export const updateProductSchema = z.object({
  name: nameValidation.max(200, "Product name must be less than 200 characters").optional(),
  description: descriptionValidation,
  base_price: priceValidation.optional(),
  stock: stockValidation.optional(),
});

// Variant Type Schema
export const variantTypeSchema = z.object({
  name: z.string()
    .min(1, "Variant type name is required")
    .max(100, "Variant type name cannot exceed 100 characters")
    .trim(),
  options: z.array(z.string().trim())
    .min(1, "At least one option is required")
    .max(20, "Cannot have more than 20 options")
    .refine((options) => {
      const unique = new Set(options);
      return unique.size === options.length;
    }, "Options must be unique"),
});

// Option Schema
export const optionSchema = z.object({
  option: z.string()
    .min(1, "Option value is required")
    .max(100, "Option cannot exceed 100 characters")
    .trim()
    .refine((val) => val.length > 0, "Option cannot be empty"),
});

// Combination Update Schema
export const combinationUpdateSchema = z.object({
  stock: stockValidation.optional(),
  additional_price: priceValidation.optional(),
});

// Bulk Update Schema
export const bulkUpdateSchema = z.object({
  stock: stockValidation.optional(),
  additional_price: priceValidation.optional(),
});

// Lookup Schema
export const combinationLookupSchema = z.object({
  options: z.array(z.string())
    .min(1, "At least one option is required"),
});

// Form field configurations (reusable)
export const fieldConfigs = {
  name: {
    label: "Name",
    placeholder: "Enter name...",
    required: true,
  },
  description: {
    label: "Description",
    placeholder: "Enter description...",
    required: false,
    multiline: true,
  },
  price: {
    label: "Price",
    placeholder: "0.00",
    type: "number",
    step: "0.01",
    min: 0,
    required: true,
  },
  stock: {
    label: "Stock",
    placeholder: "0",
    type: "number",
    min: 0,
    required: false,
  },
  option: {
    label: "Option",
    placeholder: "Enter option value...",
    required: true,
  },
};

// Export all schemas for easy importing
export const schemas = {
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  variantType: variantTypeSchema,
  option: optionSchema,
  combinationUpdate: combinationUpdateSchema,
  bulkUpdate: bulkUpdateSchema,
  combinationLookup: combinationLookupSchema,
};

// Type exports for better IDE support
export const createProductSchemaType = createProductSchema;
export const updateProductSchemaType = updateProductSchema;
export const variantTypeSchemaType = variantTypeSchema;
export const optionSchemaType = optionSchema;
export const combinationUpdateSchemaType = combinationUpdateSchema;
export const bulkUpdateSchemaType = bulkUpdateSchema;
export const combinationLookupSchemaType = combinationLookupSchema;
