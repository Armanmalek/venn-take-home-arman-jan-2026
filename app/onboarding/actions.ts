"use server";

import {
  fetchCorporationValidation,
  postProfileDetails,
} from "@/lib/api/vault";
import { step1Schema, type Step1Values } from "@/lib/validation/schemas";
import {
  saveOnboardingDraft,
  clearOnboardingDraft,
} from "@/lib/session/onboardingSession";

export const validateCorporationNumber = async (number: string) => {
  if (!number) {
    return { valid: false, message: "Corporation number is required" };
  }

  try {
    return await fetchCorporationValidation(number);
  } catch (error) {
    return {
      valid: false,
      message: "Unable to validate corporation number. Please try again.",
    };
  }
};

export const saveDraft = async (payload: Partial<Step1Values>) => {
  await saveOnboardingDraft(payload);
};

export const submitStep1 = async (payload: Step1Values) => {
  const parsed = step1Schema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  await saveOnboardingDraft(parsed.data);
  try {
    const response = await postProfileDetails(parsed.data);
    if (!response.ok) {
      throw new Error(response.message);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Submission failed";
    throw new Error(message);
  }

  await clearOnboardingDraft();
};
