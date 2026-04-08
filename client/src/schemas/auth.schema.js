import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .email("Email is invalid")
    .trim()
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter") 
    .regex(/[0-9]/, "Must contain at least one number") 
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
});

export const loginSchema = z.object({
  email: z
    .email("Email is invalid")
    .trim()
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required"),
});