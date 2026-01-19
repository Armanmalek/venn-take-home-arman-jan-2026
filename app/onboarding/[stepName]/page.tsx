import { notFound } from "next/navigation"
import { Flex, Box, Text, Heading } from "@chakra-ui/react"
import StepRenderer from "@/components/onboarding/StepRenderer"
import {
  stepRegistry,
  isValidStepName,
  TOTAL_STEPS,
} from "@/lib/onboarding/flow"

type OnboardingPageProps = {
  params: Promise<{ stepName: string }>
}

const OnboardingPage = async ({ params }: OnboardingPageProps) => {
  const { stepName } = await params

  if (!isValidStepName(stepName)) {
    notFound()
  }

  const stepConfig = stepRegistry[stepName]

  return (
    <Flex
      minH="100vh"
      align="flex-start"
      justify="center"
      bg="gray.50"
      px={4}
      py={16}
    >
      <Box w="full" maxW="2xl">
        <Text
          textAlign="center"
          fontSize="sm"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color="gray.500"
        >
          Step {stepConfig.id} of {TOTAL_STEPS}
        </Text>

        <Box
          mt={10}
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
          px={8}
          py={10}
          boxShadow="sm"
        >
          <Heading
            as="h1"
            textAlign="center"
            fontSize="2xl"
            fontWeight="semibold"
            color="gray.900"
          >
            {stepConfig.title}
          </Heading>
          <Box mt={8}>
            <StepRenderer stepName={stepName} />
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}

export default OnboardingPage
