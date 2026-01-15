import type { IronSessionOptions } from "iron-session";

const sessionSecret = process.env.SESSION_SECRET;
const fourteenDaysInSeconds = 60 * 60 * 24 * 14;

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
}

export const sessionOptions: IronSessionOptions = {
  cookieName: "onboarding_session",
  password: sessionSecret,
  ttl: fourteenDaysInSeconds,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
