# Venn Onboarding

This project implements Step 1 of a multi-step onboarding flow using Next.js App Router, React Hook Form, and Zod.


Thank you to the team for the consideration, I really enjoyed working on this it was a nice challenge with lots of nuance.
I first started by going through an actual onboarding flow on Venn and learned somethings. I ended up taking the some styling bits from your website and found that you were using Chakra, and what i deduced to be React Hook Form for form handling so I implemented those, to give the team some familiarity during review.


In your design i saw that there was a "Step 1 of 5". I wanted to make the form extensible. I didn't want to implement backend peristence through session cookies (at first i did but removed it), nor redux or local storage. I opted for a simple context provider to handle form state for what I imagine will be the next steps of the onboarding flow. I decided to implement a StepRender that would eventually to be able to encapsulate logic about routing users to the correct step in the form based on what they have completed and fill in values that were previously submitted. 

All fields validate on blur but phone number and corporation number have asynchronous calls which lead to some complexity. 
I supported multiple flows of form submission

- Users can tab through all fields evenetually hitting submit by focusing on the button
- Users can submit at any time pressing enter whilst being inside the fields
- Users can press the submit button manually

All flows validate and work correctly. During submission I relied on client validation through Zod and the GET request to validate the corporation number before submitting the `POST` request. I did this because of my perceived product requirements 
> "Submission should validate fields and if any of values are missing,
appropriate validation message should appear under respective field. After
validation is made form values should be sent to an API using `POST`
method."

It seemed that the validation was wanted to run through that call hence why there is duplicated logic, at the field level for corporation number in `Step1.tsx` there is validation `onBlur` as well as in the `OnbordingProvider.tsx` in the `onSubmit`. With this requirement it essentially forces all the validation to be handled on the client and the form submission should return successfully barring a server error. 



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

   Visit [http://localhost:3000](http://localhost:3000) in your browser, click "Get Started" to see the onboarding flow/
### Running Tests

```bash
npm run test
```