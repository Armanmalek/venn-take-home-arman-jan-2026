import { stepRegistry, type StepRegistryKey } from "@/lib/onboarding/flow"

export type StepStatus = "complete" | "pending"

export type StepState<T> = {
  data: T | undefined
  status: StepStatus
}

export type OnboardingSteps = {
  [K in StepRegistryKey]: StepState<(typeof stepRegistry)[K]["defaultValues"]>
}

export type OnboardingContextValue = {
  steps: OnboardingSteps
  getStepState: <K extends StepRegistryKey>(stepName: K) => OnboardingSteps[K]
  completeStep: <K extends StepRegistryKey>(
    stepName: K,
    data: NonNullable<OnboardingSteps[K]["data"]>,
  ) => void
}
