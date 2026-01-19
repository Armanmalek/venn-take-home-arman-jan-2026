import { z } from "zod"
import { parsePhoneNumberWithError } from "libphonenumber-js"

const phoneFormatRegex = /^\+1\d+$/

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
    .regex(phoneFormatRegex, "Phone must start with +1 and contain only digits")
    .refine(
      (val) => {
        try {
          const phone = parsePhoneNumberWithError(val, "CA")
          return phone?.isValid() && phone?.country === "CA"
        } catch {
          return false
        }
      },
      {
        message: "Please enter a valid Canadian phone number",
      },
    ),
  corporationNumber: z
    .string()
    .min(1, "Corporation number is required")
    .length(9, "Corporation number must be 9 digits"),
})

export type Step1Values = z.infer<typeof step1Schema>
