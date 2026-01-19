import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import OnboardingForm from "@/components/onboarding/OnboardingForm"
import ChakraProvider from "@/components/providers/ChakraProvider"

const testSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
})

type TestValues = z.infer<typeof testSchema>

const TestFieldComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TestValues>()
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" {...register("email")} />
      {errors.email && <span role="alert">{errors.email.message}</span>}
    </div>
  )
}

const renderForm = (
  props: Partial<React.ComponentProps<typeof OnboardingForm<TestValues>>> = {},
) => {
  const defaultProps = {
    schema: testSchema,
    defaultValues: { email: "" },
    onSubmit: jest.fn().mockResolvedValue(undefined),
    children: <TestFieldComponent />,
  }
  return render(
    <ChakraProvider>
      <OnboardingForm {...defaultProps} {...props} />
    </ChakraProvider>,
  )
}

describe("OnboardingForm", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      renderForm()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it("renders submit button", () => {
      renderForm()
      expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
    })
  })

  describe("synchronous validation", () => {
    it("validates fields on blur using Zod schema", async () => {
      renderForm()
      const user = userEvent.setup()

      const email = screen.getByLabelText(/email/i)
      await user.click(email)
      await user.tab()

      expect(await screen.findByRole("alert")).toHaveTextContent(
        /email is required/i,
      )
    })

    it("shows format validation errors", async () => {
      renderForm()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "invalid")
      await user.tab()

      expect(await screen.findByRole("alert")).toHaveTextContent(
        /invalid email format/i,
      )
    })

    it("clears validation error when valid input provided", async () => {
      renderForm()
      const user = userEvent.setup()

      const email = screen.getByLabelText(/email/i)
      await user.click(email)
      await user.tab()

      expect(await screen.findByRole("alert")).toBeInTheDocument()

      await user.type(email, "valid@example.com")
      await user.tab()

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
      })
    })
  })

  describe("submission", () => {
    it("calls onSubmit with form values on valid submission", async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      renderForm({ onSubmit })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com" })
      })
    })

    it("does not call onSubmit when form has validation errors", async () => {
      const onSubmit = jest.fn()
      renderForm({ onSubmit })
      const user = userEvent.setup()

      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument()
      })
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it("shows success message after successful submission", async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      renderForm({ onSubmit })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(await screen.findByText(/submitted successfully/i)).toBeInTheDocument()
    })

    it("shows error message when submission fails with Error", async () => {
      const onSubmit = jest.fn().mockRejectedValue(new Error("Server error"))
      renderForm({ onSubmit })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(await screen.findByText(/server error/i)).toBeInTheDocument()
    })

    it("shows generic error for non-Error rejections", async () => {
      const onSubmit = jest.fn().mockRejectedValue("unknown error")
      renderForm({ onSubmit })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(await screen.findByText(/submission failed/i)).toBeInTheDocument()
    })
  })

  describe("asyncValidate callback", () => {
    it("blocks submission when asyncValidate returns false", async () => {
      const onSubmit = jest.fn()
      const asyncValidate = jest.fn().mockResolvedValue(false)
      renderForm({ onSubmit, asyncValidate })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(asyncValidate).toHaveBeenCalled()
      })
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it("allows submission when asyncValidate returns true", async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      const asyncValidate = jest.fn().mockResolvedValue(true)
      renderForm({ onSubmit, asyncValidate })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it("passes form values to asyncValidate", async () => {
      const asyncValidate = jest.fn().mockResolvedValue(true)
      renderForm({ asyncValidate })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(asyncValidate).toHaveBeenCalledWith(
          { email: "test@example.com" },
          expect.any(Function),
        )
      })
    })

    it("allows asyncValidate to set field-level errors via setError", async () => {
      const onSubmit = jest.fn()
      const asyncValidate = jest
        .fn()
        .mockImplementation(async (_values, setError) => {
          setError("email", { message: "Email already exists" })
          return false
        })
      renderForm({ onSubmit, asyncValidate })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(await screen.findByRole("alert")).toHaveTextContent(
        /email already exists/i,
      )
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe("loading states", () => {
    it("shows loading text during submission", async () => {
      const onSubmit = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )
      renderForm({ onSubmit })
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(await screen.findByText(/submitting/i)).toBeInTheDocument()
    })
  })
})
