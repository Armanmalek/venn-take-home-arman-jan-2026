"use client"

import Link from "next/link"
import { Box, Flex, Heading, Text, Button, Image } from "@chakra-ui/react"
import { BUSINESS_DETAILS } from "@/lib/onboarding/constants"

const Home = () => {
  return (
    <Box id="er" as="main" minH="100vh" bg="#21825b">
      <Flex
        as="section"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={{ base: 12, md: 20 }}
        direction={{ base: "column", lg: "row" }}
        align="center"
        gap={{ base: 10, lg: 16 }}
      >
        <Box flex="1" maxW={{ lg: "xl" }}>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            lineHeight="tall"
            color="gray.900"
          >
            Venn is business banking built for Canada
          </Heading>

          <Text
            mt={6}
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            lineHeight="tall"
          >
            Get local CAD and USD accounts with CDIC protection, 2% interest,
            corporate cards with 1% cashback, free local transfers, low FX, and
            more.
          </Text>

          <Flex mt={8} gap={4} direction={{ base: "column", sm: "row" }}>
            <Button
              asChild
              size="lg"
              bg="gray.900"
              color="white"
              borderRadius="md"
              px={8}
              _hover={{ bg: "black" }}
            >
              <Link href={`/onboarding/${BUSINESS_DETAILS}`}>Get started</Link>
            </Button>
          </Flex>
        </Box>

        <Box flex="1">
          <Image
            src="https://cdn.prod.website-files.com/63d435c02eb920d1c2f0c1ea/6967c02699e78eb187fec495_hero-img.avif"
            alt="Venn platform UI on desktop and phone, as well as the Venn card"
            borderRadius="xl"
            w="full"
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Home
