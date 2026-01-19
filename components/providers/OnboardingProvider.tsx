"use client"

import { createContext, useContext, useState } from "react"
import { stepRegistry, type StepRegistryKey } from "@/lib/onboarding/flow"
import type {
  OnboardingSteps,
  OnboardingContextValue,
} from "@/lib/types/onboardingContext"

const createInitialSteps = (): OnboardingSteps =>
  Object.fromEntries(
    (Object.keys(stepRegistry) as StepRegistryKey[]).map((stepName) => [
      stepName,
      { data: undefined, status: "pending" },
    ]),
  ) as OnboardingSteps

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

type OnboardingProviderProps = {
  children: React.ReactNode
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [steps, setSteps] = useState<OnboardingSteps>(createInitialSteps)

  const getStepState = <K extends StepRegistryKey>(
    stepName: K,
  ): OnboardingSteps[K] => {
    return steps[stepName]
  }

  const completeStep = <K extends StepRegistryKey>(
    stepName: K,
    data: NonNullable<OnboardingSteps[K]["data"]>,
  ) => {
    setSteps((prev) => ({
      ...prev,
      [stepName]: {
        data,
        status: "complete",
      },
    }))
  }

  const value: OnboardingContextValue = {
    steps,
    getStepState,
    completeStep,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
