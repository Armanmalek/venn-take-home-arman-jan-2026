"use client"

import OnboardingForm from "@/components/onboarding/OnboardingForm"
import { stepRegistry, StepRegistryKey } from "@/lib/onboarding/flow"
import { useOnboarding } from "@/components/providers/OnboardingProvider"

type StepRendererProps = {
  stepName: StepRegistryKey
}

const StepRenderer = ({ stepName }: StepRendererProps) => {
  const { getStepState, completeStep } = useOnboarding()
  const stepState = getStepState(stepName)
  const stepConfig = stepRegistry[stepName]
  const FieldsComponent = stepConfig.component

  const handleSubmit = async (values: typeof stepConfig.defaultValues) => {
    await stepConfig.submitAction(values)
    completeStep(stepName, values)
  }

  return (
    <OnboardingForm
      schema={stepConfig.schema}
      defaultValues={stepState.data ?? stepConfig.defaultValues}
      onSubmit={handleSubmit}
      asyncValidate={stepConfig.asyncValidate}
    >
      <FieldsComponent />
    </OnboardingForm>
  )
}

export default StepRenderer
