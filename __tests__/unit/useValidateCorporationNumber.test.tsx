import { renderHook, waitFor, act } from "@testing-library/react"
import useValidateCorporationNumber from "@/hooks/useValidateCorporationNumber"
import { validateCorporationNumber } from "@/app/onboarding/actions"

jest.mock("@/app/onboarding/actions", () => ({
  validateCorporationNumber: jest.fn(),
}))

const mockedValidate = validateCorporationNumber as jest.MockedFunction<
  typeof validateCorporationNumber
>

describe("useValidateCorporationNumber", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("initializes with isValidatingCorporationNumber as false", () => {
    const { result } = renderHook(() => useValidateCorporationNumber())
    expect(result.current.isValidatingCorporationNumber).toBe(false)
  })

  it("sets loading state to true during validation", async () => {
    mockedValidate.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ valid: true }), 50),
        ),
    )

    const { result } = renderHook(() => useValidateCorporationNumber())

    act(() => {
      result.current.validateCorporationNumber("123456789")
    })

    expect(result.current.isValidatingCorporationNumber).toBe(true)

    await waitFor(() => {
      expect(result.current.isValidatingCorporationNumber).toBe(false)
    })
  })

  it("returns validation result from server action", async () => {
    mockedValidate.mockResolvedValue({ valid: true })

    const { result } = renderHook(() => useValidateCorporationNumber())

    let validationResult
    await act(async () => {
      validationResult =
        await result.current.validateCorporationNumber("826417395")
    })

    expect(validationResult).toEqual({ valid: true })
    expect(mockedValidate).toHaveBeenCalledWith("826417395")
  })

  it("returns invalid result with message from server", async () => {
    mockedValidate.mockResolvedValue({
      valid: false,
      message: "Corporation not found",
    })

    const { result } = renderHook(() => useValidateCorporationNumber())

    let validationResult
    await act(async () => {
      validationResult =
        await result.current.validateCorporationNumber("000000000")
    })

    expect(validationResult).toEqual({
      valid: false,
      message: "Corporation not found",
    })
  })

  it("maintains stable function reference across renders", () => {
    const { result, rerender } = renderHook(() =>
      useValidateCorporationNumber(),
    )
    const firstRef = result.current.validateCorporationNumber

    rerender()

    expect(result.current.validateCorporationNumber).toBe(firstRef)
  })
})
