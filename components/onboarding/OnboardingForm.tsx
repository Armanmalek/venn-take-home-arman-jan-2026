"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveDraft } from "@/app/onboarding/actions";
import { step1Schema, type Step1Values } from "@/lib/validation/schemas";

const schemaMap = {
  step1: step1Schema,
};

type SchemaKey = keyof typeof schemaMap;

type OnboardingFormProps = {
  schemaKey: SchemaKey;
  defaultValues: Step1Values;
  onSubmit: (values: Step1Values) => Promise<void>;
  children: ReactNode;
};

const OnboardingForm = ({
  schemaKey,
  defaultValues,
  onSubmit,
  children,
}: OnboardingFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const methods = useForm<Step1Values>({
    resolver: zodResolver(schemaMap[schemaKey]),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues,
  });

  const handleSubmit = async (values: Step1Values) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await onSubmit(values);
      setSubmitSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Submission failed";
      setSubmitError(message);
    }
  };

  const handleDraftBlur = () => {
    void saveDraft(methods.getValues());
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        onBlur={handleDraftBlur}
        noValidate
      >
        {children}

        {submitError && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600"
          >
            Submitted successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="mt-8 flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {methods.formState.isSubmitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;
