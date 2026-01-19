"use client"

import { useCallback, useState } from "react"
import { validateCorporationNumber as validateCorporationNumberAction } from "@/app/onboarding/actions"
import { ValidationResult } from "@/lib/types/validation"

const useValidateCorporationNumber = () => {
  const [isValidatingCorporationNumber, setIsValidatingCorporationNumber] =
    useState(false)

  const validateCorporationNumber = useCallback(
    async (number: string): Promise<ValidationResult> => {
      setIsValidatingCorporationNumber(true)
      const result = await validateCorporationNumberAction(number)
      setIsValidatingCorporationNumber(false)
      return result
    },
    [],
  )

  return { isValidatingCorporationNumber, validateCorporationNumber }
}

export default useValidateCorporationNumber
