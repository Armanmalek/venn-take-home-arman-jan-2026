"use client"

import { ChakraProvider as Provider, defaultSystem } from "@chakra-ui/react"
import type { ReactNode } from "react"

type ChakraProviderProps = {
  children: ReactNode
}

const ChakraProvider = ({ children }: ChakraProviderProps) => {
  return <Provider value={defaultSystem}>{children}</Provider>
}

export default ChakraProvider
