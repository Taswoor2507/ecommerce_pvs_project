import z from "zod";

 const placeOrderSchema = z.object({
combinationId: z.string().min(1, "Combination ID is required"),

quantity: z
.number("Quantity must be a number")
.int("Quantity must be integer")
.min(1, "Minimum quantity is 1")
.max(100, "Maximum quantity is 100"),
});


export default placeOrderSchema;
