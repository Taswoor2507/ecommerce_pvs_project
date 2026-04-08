import z from "zod";

const orderItemSchema = z.object({
  productId: z.string("Product ID is required"),
  combinationId: z.string().optional(),
  quantity: z
    .number("Quantity must be a number")
    .int("Quantity must be integer")
    .min(1, "Minimum quantity is 1")
    .max(100, "Maximum quantity is 100"),
  price: z.number("Price is required").positive("Price must be positive"),
  name: z.string("Product name is required"),
  image: z.string().optional(),
  variants: z.array(z.object({
    type: z.string(),
    value: z.string()
  })).optional(),
}).refine((data) => data.productId, {
  message: "Product ID is required",
});

const shippingInfoSchema = z.object({
  fullName: z.string("Full name is required").min(2, "Full name must be at least 2 characters"),
  email: z.string("Email is required").email("Invalid email format"),
  phone: z.string("Phone number is required").min(10, "Phone number must be at least 10 digits"),
  address: z.string("Address is required").min(10, "Address must be at least 10 characters"),
  city: z.string("City is required").min(2, "City must be at least 2 characters"),
  postalCode: z.string("Postal code is required").min(4, "Postal code must be at least 4 characters"),
});

const placeOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  shippingInfo: shippingInfoSchema,
});

export default placeOrderSchema;
