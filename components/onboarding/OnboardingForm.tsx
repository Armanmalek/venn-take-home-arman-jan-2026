"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  FormProvider,
  useForm,
  FieldValues,
  DefaultValues,
  UseFormSetError,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Alert } from "@chakra-ui/react"
import type { ZodSchema } from "zod"

type OnboardingFormProps<T extends FieldValues> = {
  schema: ZodSchema<T>
  defaultValues: DefaultValues<T>
  onSubmit: (values: T) => Promise<void>
  asyncValidate?: (values: T, setError: UseFormSetError<T>) => Promise<boolean>
  children: ReactNode
}

const OnboardingForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  asyncValidate,
  children,
}: OnboardingFormProps<T>) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues,
  })

  const handleSubmit = async (values: T) => {
    setSubmitError(null)
    setSubmitSuccess(false)

    if (asyncValidate) {
      const isValid = await asyncValidate(values, methods.setError)
      if (!isValid) return
    }

    try {
      await onSubmit(values)
      setSubmitSuccess(true)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Submission failed"
      setSubmitError(message)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
        {children}

        {submitError && (
          <Alert.Root status="error" mt={6} borderRadius="2xl">
            <Alert.Indicator />
            <Alert.Title>{submitError}</Alert.Title>
          </Alert.Root>
        )}

        {submitSuccess && (
          <Alert.Root status="success" mt={6} borderRadius="2xl">
            <Alert.Indicator />
            <Alert.Title>Submitted successfully.</Alert.Title>
          </Alert.Root>
        )}

        <Button
          type="submit"
          onMouseDown={(e) => {
            // Prevent default to avoid double submission 
            e.preventDefault()
            methods.handleSubmit(handleSubmit)()
          }}
          loading={methods.formState.isSubmitting}
          loadingText="Submitting"
          w="full"
          mt={8}
          borderRadius="lg"
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  )
}

export default OnboardingForm
