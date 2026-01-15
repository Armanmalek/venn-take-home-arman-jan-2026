import "server-only";

const BASE_URL = "https://fe-hometask-api.qa.vault.tryvault.com";

export type CorporationValidationResponse = {
  corporationNumber?: string;
  valid: boolean;
  message?: string;
};

export type ProfileDetailsPayload = {
  firstName: string;
  lastName: string;
  corporationNumber: string;
  phone: string;
};

export type ProfileDetailsError = {
  message?: string;
};

export const fetchCorporationValidation = async (
  number: string
): Promise<CorporationValidationResponse> => {
  const response = await fetch(`${BASE_URL}/corporation-number/${number}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = (await response.json()) as CorporationValidationResponse;

  if (!response.ok) {
    return {
      valid: false,
      message: data.message ?? "Unable to validate corporation number",
    };
  }

  return data;
};

export const postProfileDetails = async (
  payload: ProfileDetailsPayload
): Promise<{ ok: true } | { ok: false; message: string }> => {
  const response = await fetch(`${BASE_URL}/profile-details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return { ok: true };
  }

  const data = (await response.json()) as ProfileDetailsError;

  return {
    ok: false,
    message: data.message ?? "Submission failed",
  };
};
