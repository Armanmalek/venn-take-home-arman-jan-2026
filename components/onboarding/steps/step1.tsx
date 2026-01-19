"use client"

import { useFormContext } from "react-hook-form"
import { Input, Text, Grid, Field } from "@chakra-ui/react"
import useValidateCorporationNumber from "@/hooks/useValidateCorporationNumber"
import type { Step1Values } from "@/lib/validation/schemas"

const Step1Fields = () => {
  const { isValidatingCorporationNumber, validateCorporationNumber } =
    useValidateCorporationNumber()
  const {
    register,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<Step1Values>()

  const handleCorporationBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value
    const isValid = await trigger("corporationNumber")
    if (!isValid) {
      return
    }

    const result = await validateCorporationNumber(value.trim())
    if (!result.valid) {
      setError("corporationNumber", {
        message: "Invalid corporation number",
      })
      return
    }

    clearErrors("corporationNumber")
  }

  return (
    <>
      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={6}>
        <Field.Root invalid={Boolean(errors.firstName)}>
          <Field.Label>First Name</Field.Label>
          <Input
            type="text"
            autoComplete="given-name"
            borderRadius="lg"
            {...register("firstName")}
          />
          <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(errors.lastName)}>
          <Field.Label>Last Name</Field.Label>
          <Input
            type="text"
            autoComplete="family-name"
            borderRadius="lg"
            {...register("lastName")}
          />
          <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
        </Field.Root>
      </Grid>

      <Field.Root invalid={Boolean(errors.phone)} mt={6}>
        <Field.Label>Phone Number</Field.Label>
        <Input
          type="tel"
          autoComplete="tel"
          placeholder="+1XXXXXXXXXX"
          borderRadius="lg"
          {...register("phone")}
        />
        <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={Boolean(errors.corporationNumber)} mt={6}>
        <Field.Label>Corporation Number</Field.Label>
        <Input
          type="text"
          inputMode="numeric"
          maxLength={9}
          borderRadius="lg"
          {...register("corporationNumber", {
            onBlur: handleCorporationBlur,
          })}
        />
        {isValidatingCorporationNumber && (
          <Text mt={2} fontSize="sm" color="gray.500">
            Validating...
          </Text>
        )}
        <Field.ErrorText>{errors.corporationNumber?.message}</Field.ErrorText>
      </Field.Root>
    </>
  )
}

export default Step1Fields
