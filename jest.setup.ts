import "@testing-library/jest-dom"

// Polyfill for structuredClone (required by Chakra UI in jsdom)
if (typeof structuredClone === "undefined") {
  global.structuredClone = <T>(obj: T): T => {
    if (obj === undefined) return undefined as T
    if (obj === null) return null as T
    return JSON.parse(JSON.stringify(obj))
  }
}
