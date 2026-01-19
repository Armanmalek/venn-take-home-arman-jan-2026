import "server-only"
import axios from "axios"

const BASE_URL = "https://fe-hometask-api.qa.vault.tryvault.com"

type CorporationValidationResponse = {
  corporationNumber?: string
  valid: boolean
  message?: string
}

export type ProfileDetailsPayload = {
  firstName: string
  lastName: string
  corporationNumber: string
  phone: string
}

export const fetchCorporationValidation = async (
  number: string,
): Promise<CorporationValidationResponse> => {
  try {
    const { data } = await axios.get<CorporationValidationResponse>(
      `${BASE_URL}/corporation-number/${number}`,
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return error.response.data
    }

    console.error("Error validating corporation number:", error)
    return { valid: false, message: "Unable to validate corporation number" }
  }
}

export const postProfileDetails = async (
  payload: ProfileDetailsPayload,
): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/profile-details`, payload)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error(error.response?.data?.message)
    }
    throw new Error("Failed to submit onboarding details")
  }
}
