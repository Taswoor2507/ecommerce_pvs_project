import { z } from "zod";

// Add variant type schema
export const addVariantTypeSchema = z.object({
  name: z
    .string("Variant type name is required")
    .min(1, "Variant type name is required")
    .max(100, "Variant type name must be less than 100 characters")
    .trim(),
  options: z
    .array(z.string("Option is required").trim())
    .min(1, "At least one option is required")
    .refine(
      (options) => {
        const seen = new Set();
        return options.every(opt => {
          const normalized = opt.toLowerCase();
          if (seen.has(normalized)) return false;
          seen.add(normalized);
          return true;
        });
      },
      "Duplicate options are not allowed"
    ),
});

// Add option schema
export const addOptionSchema = z.object({
  option: z
    .string("Option is required")
    .min(1, "Option is required")
    .max(100, "Option must be less than 100 characters")
    .trim(),
});

// Update combination schema
export const updateCombinationSchema = z.object({
  additional_price: z
    .number("Additional price must be a number")
    .min(0, "Additional price cannot be negative")
    .optional(),
  stock: z
    .number("Stock must be a number")
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),
});

// Lookup combination schema (dynamic keys)
export const lookupCombinationSchema = z.object({}).loose();

export const addVariantTypeSchemaType = addVariantTypeSchema;
export const addOptionSchemaType = addOptionSchema;
export const updateCombinationSchemaType = updateCombinationSchema;
