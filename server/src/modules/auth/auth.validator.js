import { z } from "zod";

// register validator schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .email("Email is invalid")
    .transform(val => val.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});



// login validator schema
export const loginSchema = z.object({
    email: z
    .email("Email is invalid")
    .transform(val => val.toLowerCase().trim()),
    password: z.string().min(1, "Password cannot be empty")
});