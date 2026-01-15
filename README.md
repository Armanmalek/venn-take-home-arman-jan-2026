# Venn Onboarding

This project implements Step 1 of a multi-step onboarding flow using Next.js App Router, React Hook Form, and Zod. The UI is extensible for steps 2-5, with only step 1 implemented today.

## Architecture
- Server Component shell at `app/onboarding/[step]/page.tsx` with a shared `StepShell`.
- Client form wrapper (`components/onboarding/OnboardingForm.tsx`) and per-step fields (`components/onboarding/steps/step1.tsx`).
- Server Actions in `app/onboarding/actions.ts` for validation, draft persistence, and submission.
- Encrypted cookie persistence via iron-session in `lib/session`.
- External API calls in `lib/api/vault.ts` (server-only).
- Zod schema in `lib/validation/schemas.ts`.
- Flow config for steps 1-5 in `lib/onboarding/flow.ts`.

## Routes
- `/onboarding/1` renders Step 1.
- `/onboarding/2` through `/onboarding/5` show a "Not implemented" placeholder.
- Any other step shows "Invalid step."

## Environment
Create `.env.local` with a secret of at least 32 characters:

```bash
SESSION_SECRET=replace_with_a_long_random_secret_string
```

## Scripts
```bash
npm run dev
npm run build
npm run start
npm run test
```

## Tests
Integration tests use React Testing Library and mock server actions.

```bash
npm run test
```
