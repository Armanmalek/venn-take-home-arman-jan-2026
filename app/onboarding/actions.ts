"use server"

import { fetchCorporationValidation, postProfileDetails } from "@/lib/api/api"
import { step1Schema, type Step1Values } from "@/lib/validation/schemas"
import { ValidationResult } from "@/lib/types/validation"

export const validateCorporationNumber = async (
  number: string,
): Promise<ValidationResult> => {
  const trimmed = number.trim()

  if (!trimmed) {
    return { valid: false, message: "Corporation number is required" }
  }

  return await fetchCorporationValidation(trimmed)
}

export const submitStep1 = async (payload: Step1Values) => {
  const parsed = step1Schema.safeParse(payload)
  if (!parsed.success) {
    throw new Error("Invalid form data")
  }

  await postProfileDetails(parsed.data)
}
