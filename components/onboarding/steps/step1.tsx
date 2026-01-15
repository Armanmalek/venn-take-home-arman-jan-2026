"use client";

import { useFormContext } from "react-hook-form";
import { useCorpNumberValidation } from "@/hooks/useCorpNumberValidation";
import type { Step1Values } from "@/lib/validation/schemas";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100";

const Step1Fields = () => {
  const { isValidating, validate } = useCorpNumberValidation();
  const {
    register,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<Step1Values>();

  const handleCorpBlur = async (value: string) => {
    const isValid = await trigger("corporationNumber");
    if (!isValid) {
      return;
    }

    const result = await validate(value.trim());
    if (!result.valid) {
      setError("corporationNumber", {
        type: "server",
        message: result.message ?? "Invalid corporation number",
      });
      return;
    }

    clearErrors("corporationNumber");
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="firstName">
          First Name
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            className={inputClassName}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p id="firstName-error" className="mt-2 text-sm text-red-500" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </label>

        <label className="text-sm font-medium text-zinc-700" htmlFor="lastName">
          Last Name
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            className={inputClassName}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p id="lastName-error" className="mt-2 text-sm text-red-500" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </label>
      </div>

      <label className="mt-6 block text-sm font-medium text-zinc-700" htmlFor="phone">
        Phone Number
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1XXXXXXXXXX"
          className={inputClassName}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-2 text-sm text-red-500" role="alert">
            {errors.phone.message}
          </p>
        )}
      </label>

      <label
        className="mt-6 block text-sm font-medium text-zinc-700"
        htmlFor="corporationNumber"
      >
        Corporation Number
        <input
          id="corporationNumber"
          type="text"
          inputMode="numeric"
          maxLength={9}
          className={inputClassName}
          aria-invalid={Boolean(errors.corporationNumber)}
          aria-describedby={
            errors.corporationNumber ? "corporationNumber-error" : undefined
          }
          {...register("corporationNumber", {
            onBlur: async (event) => {
              await handleCorpBlur(event.target.value);
            },
          })}
        />
        {isValidating && (
          <p className="mt-2 text-sm text-zinc-500">Validating...</p>
        )}
        {errors.corporationNumber && (
          <p
            id="corporationNumber-error"
            className="mt-2 text-sm text-red-500"
            role="alert"
          >
            {errors.corporationNumber.message}
          </p>
        )}
      </label>
    </>
  );
};

export default Step1Fields;
