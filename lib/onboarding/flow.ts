import { UseFormSetError } from "react-hook-form"
import { BUSINESS_DETAILS } from "./constants"
import { step1Schema, type Step1Values } from "@/lib/validation/schemas"
import Step1Fields from "@/components/onboarding/steps/Step1"
import {
  submitStep1,
  validateCorporationNumber,
} from "@/app/onboarding/actions"

export const stepRegistry = {
  [BUSINESS_DETAILS]: {
    id: 1,
    title: "Business Details",
    schema: step1Schema,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      corporationNumber: "",
    } satisfies Step1Values,
    component: Step1Fields,
    submitAction: submitStep1,
    asyncValidate: async (
      values: Step1Values,
      setError: UseFormSetError<Step1Values>,
    ) => {
      const result = await validateCorporationNumber(values.corporationNumber)
      if (!result.valid) {
        setError("corporationNumber", {
          message: "Invalid corporation number",
        })
        return false
      }
      return true
    },
  },
}

export type StepRegistryKey = keyof typeof stepRegistry

export const isValidStepName = (name: string): name is StepRegistryKey => {
  return name in stepRegistry
}

export const TOTAL_STEPS = Object.keys(stepRegistry).length
