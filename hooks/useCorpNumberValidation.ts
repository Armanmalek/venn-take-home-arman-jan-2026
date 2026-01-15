"use client";

import { useCallback, useState } from "react";
import { validateCorporationNumber } from "@/app/onboarding/actions";

type ValidationResult = {
  valid: boolean;
  message?: string;
};

export const useCorpNumberValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (number: string): Promise<ValidationResult> => {
    setIsValidating(true);
    try {
      return await validateCorporationNumber(number);
    } catch (error) {
      return {
        valid: false,
        message: "Unable to validate corporation number. Please try again.",
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  return { isValidating, validate };
};
