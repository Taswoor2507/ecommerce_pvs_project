import z from "zod";

const updateCombinationSchema = z.object({
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

const lookupCombinationSchema = z.object({
  // Dynamic keys - will be validated in the service layer
  // This is just to ensure we have an object
}).loose();

export { updateCombinationSchema, lookupCombinationSchema };
export default updateCombinationSchema;