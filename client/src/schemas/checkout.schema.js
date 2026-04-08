import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]*$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(10, 'Please enter a full delivery address')
    .max(300, 'Address is too long')
    .trim(),
  city: z
    .string()
    .min(2, 'City name is required')
    .trim(),
  postalCode: z
    .string()
    .min(4, 'Postal code must be at least 4 digits')
    .max(10, 'Postal code is too long')
    .trim(),
});
