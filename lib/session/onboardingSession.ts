import "server-only";

import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";
import { sessionOptions } from "./sessionConfig";
import type { OnboardingDraft } from "./types";

type OnboardingSession = {
  onboardingDraft?: OnboardingDraft;
};

const getSession = async (): Promise<OnboardingSession> => {
  const cookieStore = cookies();
  const rawCookie = cookieStore.get(sessionOptions.cookieName)?.value;

  if (!rawCookie) {
    return {};
  }

  try {
    return await unsealData<OnboardingSession>(rawCookie, {
      password: sessionOptions.password,
      ttl: sessionOptions.ttl,
    });
  } catch (error) {
    return {};
  }
};

const saveSession = async (session: OnboardingSession): Promise<void> => {
  const cookieStore = cookies();
  const sealed = await sealData(session, {
    password: sessionOptions.password,
    ttl: sessionOptions.ttl,
  });

  cookieStore.set(sessionOptions.cookieName, sealed, {
    ...sessionOptions.cookieOptions,
    maxAge: sessionOptions.ttl,
  });
};

export const getOnboardingDraft = async (): Promise<OnboardingDraft> => {
  const session = await getSession();
  return session.onboardingDraft ?? {};
};

export const saveOnboardingDraft = async (
  patch: Partial<OnboardingDraft>
): Promise<void> => {
  const session = await getSession();
  session.onboardingDraft = {
    ...session.onboardingDraft,
    ...patch,
  };
  await saveSession(session);
};

export const clearOnboardingDraft = async (): Promise<void> => {
  const cookieStore = cookies();
  cookieStore.set(sessionOptions.cookieName, "", {
    ...sessionOptions.cookieOptions,
    maxAge: 0,
  });
};
