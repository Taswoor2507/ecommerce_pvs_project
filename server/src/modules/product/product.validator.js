import { z } from "zod";

// Product creation schema
 const createProductSchema = z.object({
  name: z.string("Product name is required").min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  description: z.string("Description is required").max(2000, "Description must be less than 2000 characters").optional(),
  base_price: z.number("Base price should be a positive number").min(0, "Base price must be a positive number"),
});

export {createProductSchema};