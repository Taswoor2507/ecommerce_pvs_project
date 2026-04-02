import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name cannot be empty")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .email("Email is invalid")
    .transform(val => val.toLowerCase().trim()),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  contact: z
    .string()
    .trim()
    .max(20, "Contact must be less than 20 characters")
    .optional()
});