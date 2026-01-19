import type { Metadata } from "next"
import ChakraProvider from "@/components/providers/ChakraProvider"
import { OnboardingProvider } from "@/components/providers/OnboardingProvider"

export const metadata: Metadata = {
  title: "Venn Onboarding",
  description: "Onboarding flow",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ChakraProvider>
          <OnboardingProvider>{children}</OnboardingProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}

export default RootLayout
