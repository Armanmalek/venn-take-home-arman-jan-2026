import { z } from "zod";

export const phoneRegex = /^\+1\d{10}$/;

export const step1Schema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Phone number must start with +1 and include 10 digits"),
  corporationNumber: z
    .string()
    .min(1, "Corporation number is required")
    .length(9, "Corporation number must be 9 digits"),
});

export type Step1Values = z.infer<typeof step1Schema>;
