var wrapper = require("@eth-optimism/solc/wrapper")

let compileJSON: ((input: any) => string) | null = (input) => {
  return ""
}

export const loadCompiler = (url: string) => {
  try {
    /* eslint-disable-next-line no-restricted-globals */
    delete (self as any).Module
    /* eslint-disable-next-line no-restricted-globals */
    ;(self as any).Module = undefined

    compileJSON = null
    importScripts(url)
    /* eslint-disable-next-line no-restricted-globals */
    const compiler = wrapper((self as any).Module)

    compileJSON = (input) => {
      try {
        const result = compiler.compile(input)
        return result
      } catch (exception) {
        return JSON.stringify(exception)
      }
    }
  } catch (error) {
    console.log("Error in worker", error)
  }
}

export const compile = async (input: any) => {
  if (compileJSON) {
    const result = compileJSON(input)
    return result
  }
}
