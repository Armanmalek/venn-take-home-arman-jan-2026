# Venn Onboarding

This project implements Step 1 of a multi-step onboarding flow using Next.js App Router, React Hook Form, and Zod. The UI is extensible for steps 2-5, with only step 1 implemented today.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.18.0 or later (required by Next.js 16)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/venn-onboarding.git
   cd venn-onboarding
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser, then navigate to `/onboarding/business-details` to see the onboarding flow.

### Running Tests

```bash
npm run test
```

## Architecture

- Server Component shell at `app/onboarding/[stepName]/page.tsx`.
- Client form wrapper (`components/onboarding/OnboardingForm.tsx`) and per-step fields (`components/onboarding/steps/step1.tsx`).
- Server Actions in `app/onboarding/actions.ts` for validation and submission.
- External API calls in `lib/api/api.ts` (server-only).
- Zod schema in `lib/validation/schemas.ts`.
- Flow config in `lib/onboarding/flow.ts`.

## Routes

- `/onboarding/business-details` renders Step 1.
- Other steps show a "Not implemented" placeholder.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run test     # Run tests
npm run lint     # Run ESLint
npm run prettier # Format code
```

## Tests

Integration tests use React Testing Library and mock server actions.

```bash
npm run test
```
